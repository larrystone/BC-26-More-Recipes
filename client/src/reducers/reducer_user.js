import { SIGNED_IN } from '../constants';

let user = {
  id: 0,
  username: null,
  email: null
};

export default (state = user, action) => {
  switch (action.type) {
    case SIGNED_IN:
      const { newUser } = action;
      user = newUser;
      return user;
    default:
      return state;
  }
}