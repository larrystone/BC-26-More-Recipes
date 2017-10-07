import { SET_DIALOG } from '../constants';

export const setDialogType = (newDialogType) => {
  const action = {
    type: SET_DIALOG,
    newDialogType
  }
  return action;
}