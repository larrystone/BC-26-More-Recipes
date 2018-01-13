import { ADD_MODAL, REMOVE_MODAL } from '../constants';

/**
 * Adds a modal to the window
 *
 * @export
 * @param {any} modal
 * @returns {obj} action
 */
export function addModal(modal) {
  return {
    type: ADD_MODAL,
    modal
  };
}

/**
 * Removes a modal from the window
 *
 * @export
 * @returns {obj} action
 */
export function removeModal() {
  return {
    type: REMOVE_MODAL,
  };
}
