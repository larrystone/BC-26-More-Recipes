import { combineReducers } from 'redux';

import auth from './auth';
import recipe from './recipe';
import review from './review';
import modal from './modal';
import favorite from './favorite';

export default combineReducers({
  auth, recipe, review, modal, favorite
});
