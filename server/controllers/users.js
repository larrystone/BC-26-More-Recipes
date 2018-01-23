import { User, Recipe, Review, Favorite } from '../models';
import Encryption from '../middleware/encryption';
import Auth from '../middleware/auth';
import { validateSignUp, validateUserName } from '../middleware/validate';
import trimWhiteSpaces from '../services/trimWhiteSpaces';
import cloudinary, { uploadWithMulter } from '../services/uploadImage';

import * as Mailer from '../services/mailer';

const newAuth = new Auth();
const newEncryption = new Encryption();
const notify = new Mailer.default();
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
      validateSignUp(name,
        username, email, password);

    if (validateSignUpError) {
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
          const token = newAuth.sign({
            id: result.id,
            email: result.email,
            username: result.username,
          });

          notify.send({
            type: 'welcome',
            email,
            username,
            userId: result.id,
            subject: 'Welcome to More-Recipe'
          });

          return res.status(201).json({
            success: true,
            message: 'New user created/token generated!',
            token
          });
        })
        .catch((/* error */) => res.status(500).json({
          success: false,
          message: 'Error creating user'
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
          const { id, email, username } = userFound;
          const token = newAuth.sign({
            id, email, username
          });

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
      name, username, imageUrl, res, userId
    }) => {
      User.findOne({
        where: { id: userId }
      })
        .then((foundUser) => {
          if (!foundUser) {
            return res.status(404).json({
              success: false,
              message: 'User not found'
            });
          }

          foundUser.updateAttributes({
            name,
            username,
            imageUrl: imageUrl || foundUser.imageUrl
          })
            .then((user) => {
              const { id, email } = user;
              const token = newAuth.sign({
                id,
                email,
                username
              });

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

      if (name.length < 6 || !name.includes(' ')) {
        return res.status(400).json({
          success: false,
          message: 'Enter a valid full name!'
        });
      }

      if (username.length < 3) {
        return res.status(400).json({
          success: false,
          message: 'Username must contain at least 3 alphabets!'
        });
      }

      validateUserName(User, username, userId).then(() => {
        if (file) {
          cloudinary.upload_stream(({ error, url }) => {
            if (!error) {
              updateDatabase({
                name,
                username,
                imageUrl: url,
                res,
                userId
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
            imageUrl: '',
            res,
            userId
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
