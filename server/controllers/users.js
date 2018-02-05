import jsonwebtoken from 'jsonwebtoken';
import { User, Recipe, Review, Favorite } from '../models';
import Encryption from '../middleware/encryption';
import { validateUserName } from '../middleware/userValidation';
import { validateSignUp } from '../middleware/inputValidation';
import trimWhiteSpaces from '../services/trimWhiteSpaces';
import cloudinary, { uploadWithMulter } from '../services/uploadImage';

import * as Mailer from '../services/mailer';

const newEncryption = new Encryption();
const notify = new Mailer.default();

const { JWT_SECRET } = process.env;

/**
 * @description - Checks if email or username already exist in the database
 *
 * @param {string} username - Username
 *
 * @param {string} email - Email address
 *
 * @returns {Promise} promise - Asynchronous promise
 */
const verifyAuthName = (username, email) => {
  const promise = new Promise((resolve, reject) => {
    User
      .findOne({
        attributes: ['email', 'username'],
        where: {
          $or: [
            {
              username: {
                $iLike: username
              }
            }, {
              email: {
                $iLike: email
              }
            }
          ]
        }
      })
      .then((userFound) => {
        if (userFound) {
          let field;
          if (userFound.username.toUpperCase() === username.toUpperCase()) {
            field = 'Username';
          } else {
            field = 'Email';
          }

          reject(`${field} already taken!`);
        }

        resolve();
      });
  });
  return promise;
};

/**
 * @description - Class Definition for the User Object
 *
 * @export
 *
 * @class Users
 */
export default class Users {
  /**
   * @description - Sign Up user (Create new user)
   *
   * @param {object} req - HTTP Request
   *
   * @param {object} res - HTTP Response
   *
   * @return {object} this - Class instance
   *
   * @memberof Users
   */
  signUp({ body }, res) {
    const name = trimWhiteSpaces(body.name, ' ');
    const username = trimWhiteSpaces(body.username);
    const email = trimWhiteSpaces(body.email);
    const password = (body.password || '');

    const validateSignUpError =
      validateSignUp({
        name,
        username,
        email,
        password
      });

    if (validateSignUpError.length > 0) {
      return res.status(400).json({
        success: false,
        message: validateSignUpError
      });
    }

    verifyAuthName(username, email).then(() => {
      User
        .create({
          name,
          username,
          email,
          imageUrl: '',
          password: newEncryption.generateHash(password),
        })
        .then((result) => {
          const token = jsonwebtoken.sign({
            id: result.id,
            username: result.username,
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24)
          }, JWT_SECRET);

          notify.send({
            type: 'welcome',
            email,
            name,
            userId: result.id,
            subject: 'Welcome to more recipe'
          });

          return res.status(201).json({
            success: true,
            message: 'New user created/token generated!',
            token
          });
        })
        .catch(error => res.status(500).json({
          success: false,
          message: `Error creating user ${error.message}`
        }));
    }).catch(error =>
      res.status(409).json({
        success: false,
        message: error
      }));

    return this;
  }

  /**
   * @description - Sign In a user (Search for user)
   *
   * @param {object} req - HTTP Request
   *
   * @param {object} res - HTTP Response
   *
   * @return {object} this - Class instance
   *
   * @memberof Users
   */
  signIn(req, res) {
    const authName =
      trimWhiteSpaces(req.body.authName);

    User
      .findOne({
        attributes: ['id', 'name', 'username', 'email', 'password'],
        where: {
          $or: [
            {
              username: {
                $iLike: authName
              }
            }, {
              email: {
                $iLike: authName
              }
            }
          ]
        }
      })
      .then((userFound) => {
        if (!userFound) {
          return res.status(401).json({
            success: false,
            message: 'Invalid Login Credentials!'
          });
        }

        if (newEncryption.verifyHash(req.body.password, userFound.password)) {
          const { id, username } = userFound;
          const token = jsonwebtoken.sign({
            id,
            username,
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24)
          }, JWT_SECRET);

          return res.status(200).json({
            success: true,
            message: 'User Signed In/token generated!',
            token
          });
        }
        res.status(401).json({
          success: false,
          message: 'Invalid Login Credentials!'
        });
      })
      .catch((/* error */) => res.status(500).json({
        success: false,
        message: 'An error occured'
      }));

    return this;
  }

  /**
   * @description - Get the user record (e.g for profile page)
   *
   * @param {any} req - HTTP request
   *
   * @param {any} res - HTTP reponse
   *
   * @returns {void} Nothing
   *
   * @memberof Users
   */
  getUser({ params }, res) {
    const { userId } = params;
    User
      .findOne({
        attributes: ['id', 'name', 'username', 'email', 'imageUrl'],
        where: { id: userId }
      })
      .then((userFound) => {
        if (!userFound) {
          return res.status(404).json({
            success: false,
            message: 'User not found!'
          });
        }

        const {
          id, name, username, email, imageUrl
        } = userFound;

        const userInfo = {
          userId: id, name, username, email, imageUrl
        };

        Recipe.count({
          where: { userId },
        })
          .then((recipeCount) => {
            userInfo.myRecipes = recipeCount;

            Review.count({
              where: { userId },
            })
              .then((reviewCount) => {
                userInfo.myReviews = reviewCount;

                Favorite.count({
                  where: { userId },
                })
                  .then((favCount) => {
                    userInfo.myFavs = favCount;
                    return res.status(200).json({
                      success: true,
                      message: 'User found!',
                      user: userInfo
                    });
                  });
              });
          })
          .catch((/* error */) => res.status(500).json({
            success: false,
            message: 'Error fetching other details'
          }));
      })
      .catch((/* error */) => res.status(500).json({
        success: false,
        message: 'Error fetching user details'
      }));

    return this;
  }

  /**
   * @description - Change user password
   *
   * @param {any} req - HTTP request
   *
   * @param {any} res - HTTP response
   *
   * @returns {void} Nothing
   *
   * @memberof Users
   */
  changePassword({ body, user }, res) {
    const { id } = user;
    const { oldPassword } = body;
    const newPassword = (body.newPassword || '');

    if (newPassword.trim().length === 0 || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters!'
      });
    }

    const password = newEncryption.generateHash(newPassword);
    User
      .findOne({
        attributes: ['id', 'password'],
        where: { id }
      })
      .then((userFound) => {
        if (!userFound) {
          return res.status(404).json({
            success: false,
            message: 'User does not exist!'
          });
        }

        if (!newEncryption.verifyHash(oldPassword, userFound.password)) {
          return res.status(401).json({
            success: false,
            message: 'Incorrect Password'
          });
        }

        userFound.updateAttributes({
          password
        }).then(() => res.status(200).json({
          success: true,
          message: 'Password Changed Successfully'
        }));
      })
      .catch((/* error */) => res.status(500).json({
        success: false,
        message: 'An error occured'
      }));

    return this;
  }

  /**
   * @description - Modify user record
   *
   * @param {object} req - HTTP Request
   *
   * @param {object} res - HTTP Response
   *
   * @return {object} this - Class instance
   *
   * @memberof Users
   */
  modifyUser(req, res) {
    /**
     * @description - Updates the user details in the database
     *
     * @param {object} userData - User details
     *
     * @returns {object} Response - HTTP Response
     */
    const updateDatabase = ({
      name, username, imageUrl, res, userId, imageId
    }) => {
      User.findOne({
        where: { id: userId },
      })
        .then((foundUser) => {
          if (!foundUser) {
            return res.status(404).json({
              success: false,
              message: 'User not found'
            });
          }

          if (imageId !== foundUser.imageId) {
            cloudinary.destroy(foundUser.imageId, () => { });
          }

          foundUser.updateAttributes({
            name,
            username,
            imageUrl: imageUrl || foundUser.imageUrl,
            imageId: imageId || foundUser.imageId
          })
            .then((user) => {
              const { id } = user;
              const token = jsonwebtoken.sign({
                id,
                username,
                exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24)
              }, JWT_SECRET);

              return res.status(200).json({
                success: true,
                message: 'User record updated',
                user: {
                  username, name, imageUrl: user.imageUrl, token
                }
              });
            });
        })
        .catch((/* error */) => res.status(500).json({
          success: false,
          message: 'An error occured'
        }));
    };

    uploadWithMulter(req, res).then(({ file, user, body }) => {
      const userId = user.id;
      const name = trimWhiteSpaces(body.name, ' ');
      const username = trimWhiteSpaces(body.username);

      if (name.length < 3 || name.length > 100) {
        return res.status(400).json({
          success: false,
          message: 'Name must be between 3 to 100 characters!'
        });
      }

      if (username.length < 3 || username.length > 50) {
        return res.status(400).json({
          success: false,
          message: 'Username must be between 3 to 50 character!'
        });
      }

      validateUserName(User, username, userId).then(() => {
        if (file) {
          cloudinary.upload_stream(({ error, secure_url, public_id }) => {
            if (!error) {
              updateDatabase({
                name,
                username,
                res,
                userId,
                imageUrl: secure_url,
                imageId: public_id
              });
            } else {
              res.status(503).json({
                success: false,
                message: 'Error uploading image, check your network connection'
              });
            }
          }).end(file.buffer);
        } else {
          updateDatabase({
            name,
            username,
            res,
            userId,
            imageUrl: '',
            imageId: ''
          });
        }
      })
        .catch(({ status, message }) => {
          res.status(status).json({
            success: false,
            message
          });
        });
    })
      .catch(({ message }) => {
        res.status(400).json({
          success: false,
          message
        });
      });
    return this;
  }
}
