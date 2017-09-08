import bcrypt from 'bcrypt';

/**
 * Class Definition for the Encryption Object
 * 
 * @export
 * @class Encryption
 */
export default class Encryption {
  /** 
 * @exports generateHash
 * @param  {string} password -User  Password
 * @return {string} The encrypted password
 */
  generateHash(password) {
    this.salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, this.salt);

    return hash;
  }


  /** Verify Decrypt password
 * @exports verifyHash
 * @param  {string} password -User  Password
 * @param  {string} hash -User  Password
 * @return {boolean} The status of decryption
 */
  verifyHash(password, hash) {
    this.status = bcrypt.compareSync(password, hash);
    return this.status;
  }
}
