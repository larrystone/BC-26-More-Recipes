import { SIGNED_IN } from '../constants';

export const logUser = (newUser) => {
  const action = {
    type: SIGNED_IN,
    newUser
  }
  return action;
}