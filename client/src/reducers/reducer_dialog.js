import { SET_DIALOG } from '../constants';

let dialogType = '';

export default (state = dialogType, action) => {
  if (action.type === SET_DIALOG) {
    const { newDialogType } = action;
    dialogType = newDialogType;
    return dialogType;
  }
  return state;
};