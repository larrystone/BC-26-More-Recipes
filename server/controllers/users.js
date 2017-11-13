import { User } from '../models';
import Encryption from '../middleware/encryption';
import Auth from '../middleware/auth';
import { validateSignUp } from '../middleware/validate';
import trimWhiteSpaces from '../services/trimWhiteSpace';

const newAuth = new Auth();
const newEncryption = new Encryption();

const verifyUserNameAndEmail = (username, email) => {
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
          if (userFound.username.toUpperCase === username.toUpperCase) {
            field = 'Username';
          } else if (userFound.email === email) {
            field = 'Email';
          }

          reject(`${field} already taken!`);
        }

        resolve();
      })
      .catch(() => {
        reject('An error occured!');
      });
  });
  return promise;
};

/**
 * Class Definition for the User Object
 *
 * @export
 * @class User
 */
export default class Users {
  /**
   * Sign Up user (Create new user)
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   * @returns {object} Class instance
   * @memberof User
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

    verifyUserNameAndEmail(username, email).then(() => {
      User
        .create({
          name,
          username,
          email,
          password: newEncryption.generateHash(password),
        })
        .then((result) => {
          const token = newAuth.sign({
            id: result.id,
            email: result.email,
            username: result.username,
          });

          const createdUser = {
            token,
            userId: result.id,
            name: result.name,
            username: result.username,
            email: result.email
          };

          return res.status(201).json({
            success: true,
            message: 'New user created/token generated!',
            user: createdUser
          });
        })
        .catch(() => res.status(500).json({
          success: false,
          message: 'Error Creating user'
        }));
    }).catch(error =>
      res.status(409).json({
        success: false,
        message: error
      }));

    return this;
  }

  /**
   * Sign In a user (Search for user)
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   * @returns {object} Class instance
   * @memberof User
   */
  signIn(req, res) {
    const usernameOrEmail =
      trimWhiteSpaces(req.body.usernameOrEmail);

    User
      .findOne({
        attributes: ['id', 'name', 'username', 'email', 'password'],
        where: {
          $or: [
            {
              username: {
                $iLike: usernameOrEmail
              }
            }, {
              email: {
                $iLike: usernameOrEmail
              }
            }
          ]
        }
      })
      .then((userFound) => {
        if (!userFound) {
          return res.status(404).json({
            success: false,
            message: 'Username or email does not exist!'
          });
        }

        if (newEncryption.verifyHash(req.body.password, userFound.password)) {
          const { id, name, email, username } = userFound;
          const token = newAuth.sign({
            id, email, username
          });

          const loggedUser = {
            token,
            name,
            username,
            email,
            userId: id
          };

          return res.status(201).json({
            success: true,
            message: 'User Signed In/token generated!',
            user: loggedUser
          });
        }
        res.status(401).json({
          success: false,
          message: 'Incorrect Password!'
        });
      })
      .catch(() => res.status(500).json({
        success: false,
        message: 'Error Signing In User'
      }));

    return this;
  }

  /**
   * Get the user record (e.g for profile page)
   *
   * @param {any} req
   * @param {any} res
   * @returns {null} Null
   * @memberof User
   */
  getUser({ params }, res) {
    const { userId } = params;
    User
      .findOne({
        attributes: ['id', 'name', 'username', 'email'],
        where: { id: userId }
      })
      .then((userFound) => {
        const loggedUser = {
          userId: userFound.id,
          name: userFound.name,
          username: userFound.username,
          email: userFound.email,
        };

        return res.status(201).json({
          success: true,
          message: 'User found!',
          user: loggedUser
        });
      })
      .catch(() => res.status(500).json({
        success: false,
        message: 'Error Fetching User'
      }));

    return this;
  }

  /**
   * Get the user record (e.g for profile page)
   *
   * @param {any} req
   * @param {any} res
   * @returns {null} Null
   * @memberof User
   */
  changePassword({ body, user }, res) {
    const { id } = user;
    const oldPassword = (body.oldPassword || '');
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
        }))
          .catch(error => res.status(500).json({
            success: false,
            message: `Error Changing password ${error}`
          }));
      })
      .catch(error => res.status(500).json({
        success: false,
        message: `Error Changing password ${error}`
      }));

    return this;
  }
}
