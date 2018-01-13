import { ADD_MODAL, REMOVE_MODAL } from '../constants';

/**
 * Adds a modal to the window
 * 
 * @export
 * @param {any} modalType 
 * @returns {obj} action
 */
export function addModal(modalType) {
  return {
    type: ADD_MODAL,
    modalType
  };
}

/**
 * Removes a modal from the window
 * 
 * @export
 * @param {any} modalType 
 * @returns {obj} action
 */
export function removeModal(modalType) {
  return {
    type: REMOVE_MODAL,
    modalType
  };
}
