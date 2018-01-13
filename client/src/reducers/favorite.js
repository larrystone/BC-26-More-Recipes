import _ from 'lodash';

import {
  SET_MY_FAVS,
  SET_IS_FAV,
  REMOVE_FAV,
  DELETE_RECIPE
} from '../constants';

const initialState = {
  myFavorites: {},
  isFav: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_MY_FAVS:
      return { ...state, myFavorites: action.recipes };
    case SET_IS_FAV:
      return { ...state, isFav: action.isFav };
    case REMOVE_FAV:
      return {
        ...state,
        myFavorites: _.omit(state.myFavorites, action.id),
        isFav: false
      };
    case DELETE_RECIPE:
      return { ...state, myFavorites: _.omit(state.myFavorites, action.id) };
    default: return state;
  }
};
