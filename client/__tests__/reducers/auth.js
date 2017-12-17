import expect from 'expect';
import Auth from '../../src/reducers/auth';

describe('Auth Reducer', () => {
  it('should set the current user when passed with SET_CURRENT_USER', () => {
    const initialState = {
      user: {}
    };
    const user = {
      username: 'larrystone',
      userId: 4
    };
    const action = {
      type: 'SET_CURRENT_USER',
      userData: user,
    };
    const newState = Auth(initialState, action);
    expect(newState.user.username).toEqual('larrystone');
    expect(newState.user.userId).toEqual(4);
  });

  it('should return initial state for invalid action type', () => {
    const initialState = {
      user: {
        username: '',
        userId: 0
      }
    };
    const user = {
      username: 'larrystone',
      userId: 4
    };
    const action = {
      type: 'TEST',
      userData: user
    };
    const newState = Auth(initialState, action);
    expect(newState.user.username).toEqual('');
  });
});
