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
      return res.status(403).json({
        success: false,
        message: validateSignUpError });
    }

    user
      .findOne({
        attributes: ['id', 'email', 'username'],
        where: {
          $or: [
            { username: {
              $iLike: username }
            },
            { email: {
              $iLike: email }
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

          return res.status(403).json({
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
            const token = newAuth.sign(result.id);

            const createdUser = {
              userId: result.id,
              username: result.username,
              email: result.email,
              token
            };

            return res.status(201).json({
              success: true,
              data: createdUser });
          });
      })
      .catch(e => res.status(503).json({
        success: false,
        message: `Error Creating user ${e.message}}` }));

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
            { username: {
              $iLike: usernameOrEmail }
            },
            { email: {
              $iLike: usernameOrEmail }
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
          const token = newAuth.sign(userFound.id);

          return res.status(201).json({
            success: true,
            data: {
              id: userFound.id,
              name: userFound.name,
              username: userFound.username,
              email: userFound.email,
              token
            }
          });
        }
        res.status(401).json({
          success: false,
          message: 'Incorrect Password!'
        });
      });

    return this;
  }
}
