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
  const name = req.body.name;
  const username = (req.body.username || '').replace(' ', '');
  const email = (req.body.email || '').replace(' ', '');
  const password = req.body.password;

  const validateError = validate.default(req);
  if (validateError) {
    return res.status(403).json({
      success: false,
      message: validateError });
  }

  const newUser = user
    .findOne({
      attributes: ['id'],
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
        return res.status(403).json({
          success: false,
          message: 'Username or email already taken!'
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
        })
        .catch(() => res.status(503).json({
          success: false,
          message: 'Error Creating user' }));

      return newUser;
    });
};

/** Sign In a user
 * @exports signIn
 * @param  {object} req - request
 * @param  {object} res - response 
 * @return {object} The status/signed in user
 */
export const signIn = (req, res) => {
  const usernameOrEmail = (req.body.username || req.body.email || '')
    .replace(' ', '');

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
