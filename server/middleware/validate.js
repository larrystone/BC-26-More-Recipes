export default (req) => {
  if (!req.body.password || req.body.password.length < 6) {
    return 'Password must be at least 6 characters!';
  }

  if (!req.body.username || req.body.username.length < 3) {
    return 'Username must be at least 3 characters!';
  }

  return false;
};

