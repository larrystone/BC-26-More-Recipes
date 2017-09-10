import jwt from 'jsonwebtoken';

/**
 * Class Definition for the Authentication Object using Jason Web Token
 *
 * @export
 * @class Auth
 */
export default class Auth {
  /**
   * Verify JWT token
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   * @param {function} next - HTTP Next()
   * @returns {object} Class instance
   * @memberof Auth
   */
  verify(req, res, next) {
    const token = req.body.token
    || req.query.token
    || req.headers['x-access-token'];

    if (token) {
      const secret = process.env.secret || '!^sl1@#=5';
      jwt.verify(token, secret, (err, decoded) => {
        if (err) {
          return res.json({ success: false,
            message: 'Failed to authenticate token.' });
        }
        req.userId = decoded;
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
   * Sign (Hash) User ID with JWT token
   *
   * @param {string} id - User Id
   * @returns {string} Encrypted string
   * @memberof Auth
   */
  sign(id) {
    this.secret = process.env.secret || '!^sl1@#=5';
    return jwt.sign(id, this.secret);
  }
}
