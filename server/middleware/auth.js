import jasonwebtoken from 'jsonwebtoken';

/**
 * @description - Class Definition for the Authentication
 * using Jason Web Token
 *
 * @export
 *
 * @class Auth
 */
export default class Auth {
  /**
   * @description - Verify JWT token
   *
   * @param {object} req - HTTP Request
   *
   * @param {object} res - HTTP Response
   *
   * @param {function} next - HTTP Next() function
   *
   * @returns {object} this - Class instance
   *
   * @memberof Auth
   */
  verify(req, res, next) {
    const token = req.body.token
      || req.query.token
      || req.headers['x-access-token'];

    if (token) {
      const secret = process.env.secret || '!^sl1@#=5';
      jasonwebtoken.verify(token, secret, (err, decoded) => {
        if (err) {
          return res.status(401).json({
            success: false,
            message: 'Failed to authenticate token.'
          });
        }
        req.user = decoded;
        next();
      });
    } else {
      return res.status(403).json({
        success: false,
        message: 'No token provided.'
      });
    }

    return this;
  }

  /**
   * @description - Sign (Hash) User details with JWT token
   *
   * @param {object} user - User object (id and email address)
   *
   * @returns {string} jwtToken - Encrypted string
   *
   * @memberof Auth
   */
  sign(user) {
    this.secret = process.env.secret || '!^sl1@#=5';
    return jasonwebtoken.sign(user, this.secret);
  }
}
