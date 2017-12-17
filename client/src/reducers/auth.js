import { SET_CURRENT_USER, SET_USER_PROFILE } from '../constants';

const initialState = {
  user: {},
  profile: {}
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state, user: action.userData
      };
    case SET_USER_PROFILE:
      return {
        ...state, profile: action.user
      };
    default: return state;
  }
};

