import bcrypt from 'bcrypt';

/**
 * Class Definition for the Encryption Object
 *
 * @export
 * @class Encryption
 */
export default class Encryption {
  /**
   * Generate Hash for password string
   *
   * @param {string} password
   * @returns {string} hashed password
   * @memberof Encryption
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
