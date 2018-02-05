import expect from 'expect';
import Auth from '../../src/reducers/auth';

describe('Auth Reducer', () => {
  describe('SET_CURRENT_USER', () => {
    it('set the current user with provided data', () => {
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
  });

  describe('SET_USER_PROFILE', () => {
    it('set the current user with provided data', () => {
      const initialState = {
        profile: {}
      };
      const profile = {
        username: 'larrystone',
        email: 'lanestone@gmail.com',
        myRecipes: 2,
        myReviews: 5,
        myFavorites: 1,
        name: 'Lane stone',
        userId: 4
      };
      const action = {
        type: 'SET_USER_PROFILE',
        user: profile,
      };
      const newState = Auth(initialState, action);
      expect(newState.profile.username).toEqual('larrystone');
      expect(newState.profile.userId).toEqual(4);
    });
  });
});

describe('Edge Cases', () => {
  it('return initial state when no action passed',
    () => {
      const initialState = {
        profile: {}
      };
      const newState = Auth(initialState);
      expect(newState.profile).toEqual({});
    });

  it('set state to initial state when no state data passed',
    () => {
      const user = {
        username: 'larrystone',
        userId: 4
      };
      const action = {
        type: 'SET_CURRENT_USER',
        userData: user,
      };
      const newState = Auth(undefined, action);
      expect(newState).toEqual({
        user,
        profile: {}
      });
    });
});
