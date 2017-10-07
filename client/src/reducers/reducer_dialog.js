import { SET_DIALOG } from '../constants';

let dialogType = '';

export default (state = dialogType, action) => {
  switch (action.type) {
    case SET_DIALOG:
      const { newDialogType } = action;
      dialogType = newDialogType;
      return dialogType;
    default:
      return state;
  }
}