import models from '../models';
import * as Encryption from '../middleware/encryption';
import * as Auth from '../middleware/auth';
import * as validate from '../middleware/validate';

const user = models.User;

const newAuth = new Auth.default();
const newEncryption = new Encryption.default();

const trimWhiteSpaces = (param, value) => (param || '')
  .replace(/\s+/g, value || '');

/**
 * Class Definition for the User Object
 *
 * @export
 * @class User
 */
export default class User {
  /**
   * Sign Up user (Create new user)
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   * @returns {object} Class instance
   * @memberof User
   */
  signUp(req, res) {
    const name = trimWhiteSpaces(req.body.name, ' ');
    const username = trimWhiteSpaces(req.body.username);
    const email = trimWhiteSpaces(req.body.email);
    const password = (req.body.password || '');

    const validateSignUpError =
      validate.validateSignUp(name,
        username, email, password);

    if (validateSignUpError) {
      return res.status(400).json({
        success: false,
        message: validateSignUpError
      });
    }

    user
      .findOne({
        attributes: ['id', 'email', 'username'],
        where: {
          $or: [
            {
              username: {
                $iLike: username
              }
            },
            {
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

          return res.status(409).json({
            success: false,
            message: `${field} already taken!`
          });
        }

        user
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
              userId: result.id,
              name: result.name,
              username: result.username,
              email: result.email,
              token
            };

            return res.status(201).json({
              success: true,
              message: 'New user created/token generated!',
              user: createdUser
            });
          });
      })
      .catch(() => res.status(500).json({
        success: false,
        message: 'Error Creating user'
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
      trimWhiteSpaces(req.body.email || req.body.username);

    user
      .findOne({
        attributes: ['id', 'name', 'username', 'email', 'password'],
        where: {
          $or: [
            {
              username: {
                $iLike: usernameOrEmail
              }
            },
            {
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
          const token = newAuth.sign({
            id: userFound.id,
            email: userFound.email,
            username: userFound.username
          });

          const loggedUser = {
            userId: userFound.id,
            name: userFound.name,
            username: userFound.username,
            email: userFound.email,
            token
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
  getUser(req, res) {
    const userId = req.params.userId;

    user
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
   * Update the user record (e.g from profile page)
   * 
   * @param {any} req 
   * @param {any} res 
   * @returns {null} Null
   * @memberof User
   */
  updateUser(req, res) {
    const userId = req.params.userId;

    user
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
}
