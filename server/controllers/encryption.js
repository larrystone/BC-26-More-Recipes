import bcrypt from 'bcrypt';

export const generateHash = (password) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  return hash;
};

export const verifyHash = (password, hash) => {
  const status = bcrypt.compareSync(password, hash);
  return status;
};
