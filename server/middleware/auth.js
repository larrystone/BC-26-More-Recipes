import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  const secret = process.env.secret || '!^sl1@#=5';

  const token = req.body.token
    || req.query.token
    || req.headers['x-access-token'];

  if (token) {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return res.json({ success: false,
          message: 'Failed to authenticate token.' });
      }
      req.userId = decoded;
      next();
    });
  } else {
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });
  }
};
