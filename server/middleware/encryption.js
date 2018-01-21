import bcrypt from 'bcrypt';

/**
 * @description - Class Definition for the Encryption Object
 *
 * @export
 *
 * @class Encryption
 */
export default class Encryption {
  /**
   * @description - Generate Hash for password string
   *
   * @param {string} password - User password
   *
   * @return {string} hashedPassword - hashed password
   *
   * @memberof Encryption
   */
  generateHash(password) {
    this.salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, this.salt);

    return hash;
  }


  /**
   * @description - Verify/Decrypt password
   *
   * @exports verifyHash
   *
   * @param  {string} password - User Password
   *
   * @param  {string} hash - hashed User Password
   *
   * @return {boolean} status - The status of decryption
   */
  verifyHash(password, hash) {
    this.status = bcrypt.compareSync(password, hash);
    return this.status;
  }
}
