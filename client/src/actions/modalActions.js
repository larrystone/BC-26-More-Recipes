import { ADD_MODAL, REMOVE_MODAL } from '../constants';

/**
 * @description - Adds a modal to the window
 *
 * @export
 *
 * @param {object} modal - modal Details
 *
 * @returns {object} action - Modal action
 */
export function addModal(modal) {
  return {
    type: ADD_MODAL,
    modal
  };
}

/**
 * @description - Removes a modal from the window
 *
 * @export
 *
 * @returns {object} action
 */
export function removeModal() {
  return {
    type: REMOVE_MODAL,
  };
}
