import axios from 'axios';
import Toastr from 'toastr';

/**
 * @description - Sets token for subsequent axios calls
 *
 * @export
 *
 * @param {string} token - Token
 *
 * @returns {void} Nothing
 */
export default function setToken(token) {
  if (token) {
    axios.defaults.headers.common['x-access-token'] = token;
    Toastr.options.positionClass = 'toast-bottom-left';
    Toastr.options.timeOut = 700;
  } else {
    delete axios.defaults.headers.common['x-access-token'];
  }
}
