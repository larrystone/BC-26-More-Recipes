import { SIGNED_IN } from '../constants';

let user = {
  id: 0,
  username: null,
  email: null
};

export default (state = user, action) => {
  if (action.type === SIGNED_IN) {
    const { newUser } = action;
    return Object.assign({}, state, newUser);
  }
  return state;
};