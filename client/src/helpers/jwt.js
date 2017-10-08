import jwt from 'jsonwebtoken';
import { read_cookie } from 'sfcookies';

const TOKEN = 'more-recipe-token';

export const verifyUser = () => {
  let result = false;
  const token = read_cookie(TOKEN);
  if (token) {
    const secret = process.env.secret || '!^sl1@#=5';
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return false;
      }
      result = decoded;
    });
  }
  return result;
}
