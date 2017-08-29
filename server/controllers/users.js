import models from '../models';
import * as auth from './authen';

const users = models.users;

/**
 * @exports createUser
 * @param  {obj} req request object
 * @param  {obj} res result object
 * @return {obj}  newUser object
 */
export const signUp = (req, res) => {
  const name = req.body.name || '';
  const username = req.body.username || '';
  const email = req.body.email || '';
  const newUser = users
    .create({
      name,
      username: username.replace(' ', ''),
      email: email.replace(' ', ''),
      password: auth.generateHash(req.body.password),
    })
    .then((result) => {
      const loggedInUser =
        { userId: result.id, username: result.username, email: result.email };

      req.session.user = result;

      return res.status(201).send(loggedInUser);
    })
    .catch(() => res.status(401).send({ error: 'Error Creating user' }));

  return newUser;
};


/**
 * @exports signIn
 * @param  {obj} req request object
 * @param  {obj} res result object
 * @return {obj}  newUser object
 */
export const signIn = (req, res) => {
  const usernameOrEmail = (req.body.username || req.body.email || '')
    .replace(' ', '');

  const newUser = users
    .findOne({
      attributes: ['id', 'name', 'username', 'email', 'password'],
      where: {
        $or: [
          { username: usernameOrEmail },
          { email: usernameOrEmail }
        ]
      }
    })
    .then((result) => {
      if (!result) {
        return res.status(404).send({
          error: 'Username or email does not exist!',
        });
      }

      if (auth.verifyHash(req.body.password, result.password)) {
        req.session.user = result;

        return res.status(201).send(
          { id: result.id,
            name: result.name,
            username: result.username,
            email: result.email });
      }
    })
    .catch(error => res.status(401).send(error));

  return newUser;
};


/**
 * @exports logOut
 * @param  {obj} req request object
 * @param  {obj} res result object
 * @return {obj}  undefined
 */
export const signOut = (req, res) => {
  if (req.session.user) {
    const username = req.session.user.username;
    req.session.user = null;
    res.status(201).send({ title: 'PostIt bids Goodbye...',
      message: `Thanks for your time ${username.toUpperCase()}...` });
  }
  res.status(201).send({ error: 'User not logged in!' });
};
