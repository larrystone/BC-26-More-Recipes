import models from '../models';
import * as encryption from '../middleware/encryption';
import * as auth from '../middleware/auth';
import * as validate from '../middleware/validate';

const user = models.User;

/** Sign Up user - Create user record
 * @exports signUp
 * @param  {object} req - request
 * @param  {object} res - response
 * @return {object} The status/created user
 */
export const signUp = (req, res) => {
  const name = (req.body.name || '').replace(/\s\s+/g, ' ');
  const username = (req.body.username || '').replace(/\s+/g, '');
  const email = (req.body.email || '').replace(/\s+/g, '');
  const password = (req.body.password || '');

  const validateSignUpError =
    validate.validateSignUp(name, username, email, password);

  if (validateSignUpError) {
    return res.status(403).json({
      success: false,
      message: validateSignUpError });
  }

  const newUser = user
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
          password: encryption.generateHash(password),
        })
        .then((result) => {
          const token = auth.sign(result.id);

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

      return newUser;
    })
    .catch(() => res.status(503).json({
      success: false,
      message: 'Error Creating user' }));
};

/** Sign In a user
 * @exports signIn
 * @param  {object} req - request
 * @param  {object} res - response
 * @return {object} The status/signed in user
 */
export const signIn = (req, res) => {
  const usernameOrEmail = (req.body.email || req.body.username || '')
    .replace(/\s+/g, '');

  const newUser = user
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

      if (encryption.verifyHash(req.body.password, userFound.password)) {
        const token = auth.sign(userFound.id);

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
      throw new Error();
    })
    .catch(() => res.status(401).json({
      success: false,
      message: 'Incorrect Password!' }));

  return newUser;
};
