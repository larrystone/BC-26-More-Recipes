
export default (req, res, next) => {
  // check for authentication here
  if (!req.session.user) {
    return res.status(401).send({
      error: 'You do not have the permission to perform this action!' });
  }

  next();
};
