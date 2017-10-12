import { combineReducers } from 'redux';

import dialog from './reducer_dialog';
import user from './reducer_user';
import dashboard from './reducer_dashboard';
import recipe from './reducer_recipe';

export default combineReducers({
  dialog,
  user,
  dashboard,
  recipe
});
