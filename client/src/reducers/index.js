import { combineReducers } from 'redux';

import dialog from './reducer_dialog';
import user from './reducer_user';
import dashboard from './reducer_dashboard';

export default combineReducers({
  dialog,
  user,
  dashboard
});
