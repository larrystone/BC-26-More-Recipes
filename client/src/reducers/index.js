import { combineReducers } from 'redux';

import dialog from './reducer_dialog';
import user from './reducer_user';

export default combineReducers({
  dialog,
  user
});
