import bcrypt from 'bcrypt';

/** Encrypt password
 * @exports generateHash
 * @param  {string} password -User  Password
 * @return {string} The encrypted password
 */
export const generateHash = (password) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  return hash;
};


/** Verify Decrypt password
 * @exports verifyHash
 * @param  {string} password -User  Password
 * @param  {string} hash -User  Password
 * @return {boolean} The status of decryption
 */
export const verifyHash = (password, hash) => {
  const status = bcrypt.compareSync(password, hash);
  return status;
};
