import axios from 'axios';
import Toastr from 'toastr';

/**
 * Sets token for subsequent axios calls
 *
 * @export
 * @param {any} token
 * @returns {null} Nothing
 */
export default function setToken(token) {
  if (token) {
    axios.defaults.headers.common['x-access-token'] = token;
    Toastr.options.positionClass = 'toast-top-center';
    Toastr.options.closeOnHover = true;
  } else {
    delete axios.defaults.headers.common['x-access-token'];
  }
}
