import axios from 'axios';
import jwt from 'jsonwebtoken';
import setToken from '../utils/setToken';
import {
  SET_CURRENT_USER, SET_USER_PROFILE
} from '../constants';

const url = '/api/v1/users/';

/**
 * @description - Sets the current user in the store
 *
 * @export
 *
 * @param {object} userData - User details
 *
 * @returns {object} action - Created user action
 */
export function setCurrentUser(userData) {
  return {
    type: SET_CURRENT_USER,
    userData
  };
}

/**
 * @description - Signs out a user
 *
 * @export
 *
 * @returns {object} dispatch - Dispatched action
 */
export function signOut() {
  return (dispatch) => {
    localStorage.removeItem('token');
    setToken(false);
    dispatch(setCurrentUser({}));
    window.location.reload();
  };
}

/**
 * @description - Signs in a user
 *
 * @export
 *
 * @param {object} userData - User credential
 *
 * @returns {object} dispatch - Dispatched action
 */
export function signIn(userData) {
  return dispatch => axios.post(`${url}signin`, userData)
    .then((response) => {
      const { token } = response.data;
      localStorage.setItem('token', token);
      setToken(token);
      dispatch(setCurrentUser(jwt.decode(localStorage.getItem('token'))));
    });
}

/**
 * @description - Signs up a user
 *
 * @export
 *
 * @param {object} userData - User details
 *
 * @returns {object} dispatch - Dispatched action
 */
export function signUp(userData) {
  return dispatch => axios.post(`${url}signup`, userData)
    .then((response) => {
      const { token } = response.data;
      localStorage.setItem('token', token);
      setToken(token);
      dispatch(setCurrentUser(jwt.decode(localStorage.getItem('token'))));
    });
}

/**
 * @description - Get User information and stats
 *
 * @export
 *
 * @param {number} userId - User ID
 *
 * @returns {object} dispatch - Dispatched action
 */
export function getUser(userId) {
  return dispatch =>
    axios.get(`${url}${userId}/profile`)
      .then((response) => {
        const { data: { user } } = response;
        dispatch({
          type: SET_USER_PROFILE,
          user
        });
      });
}

/**
 * @description - Update user profile information
 *
 * @export
 *
 * @param {Number} userId - User ID
 *
 * @param {object} userData - User details
 *
 * @returns {object} dispatch - Dispatched action
 */
export function updateProfile(userId, userData) {
  return dispatch => axios.put(`${url}${userId}/profile`, userData)
    .then((response) => {
      const {
        user: { token }
      } = response.data;
      localStorage.setItem('token', token);
      setToken(token);
      dispatch(setCurrentUser(jwt.decode(token)));
    });
}

/**
 * @description - Change user password
 *
 * @export
 *
 * @param {object} userData - User details
 *
 * @returns {object} dispatch - Dispatched action
 */
export function changePassword(userData) {
  return dispatch => axios.put(`${url}changePassword`, userData);
}
