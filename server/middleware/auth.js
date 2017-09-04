import jwt from 'jsonwebtoken';

const secret = process.env.secret || '!^sl1@#=5';

export const verify = (req, res, next) => {
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

export const sign = id => jwt.sign(id, secret);
