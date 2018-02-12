import expect from 'expect';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import moxios from 'moxios';
import jsonwebtoken from 'jsonwebtoken';
import mockData from '../../__mocks__/mockData';
import {
  signIn,
  signUp,
  signOut,
  getUser,
  updateProfile,
  changePassword
} from '../../src/actions/authActions';
import {
  SET_CURRENT_USER, SET_USER_PROFILE, PASSWORD_CHANGED
} from '../../src/constants';

import mockLocalStorage from '../../__mocks__/localStorageMock';

const middlewares = [thunk];

const mockStore = configureMockStore(middlewares);

const url = '/api/v1/users/';

window.localStorage = mockLocalStorage;

describe('Authentication actions', () => {
  beforeEach(() => moxios.install());
  afterEach(() => moxios.uninstall());

  it('sign up action', async (done) => {
    const { signUpData, signUpresponse } = mockData;
    moxios.stubRequest(`${url}signup`, {
      status: 200,
      response: signUpresponse
    });
    const { token } = signUpresponse;
    const expectedActions = [{
      type: SET_CURRENT_USER,
      userData: jsonwebtoken.decode(token)
    }];
    const store = mockStore({});
    await store.dispatch(signUp(signUpData))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    done();
  });

  it('sign in action', async (done) => {
    const { signInData, signInResponse } = mockData;
    moxios.stubRequest(`${url}signin`, {
      status: 200,
      response: signInResponse
    });
    const { token } = signInResponse;
    const expectedActions = [{
      type: SET_CURRENT_USER,
      userData: jsonwebtoken.decode(token)
    }];
    const store = mockStore({});
    await store.dispatch(signIn(signInData))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    done();
  });

  it('sign out action', async (done) => {
    const expectedActions = [{
      type: SET_CURRENT_USER,
      userData: {}
    }];
    const store = mockStore({});
    store.dispatch(signOut());
    expect(store.getActions()).toEqual(expectedActions);
    done();
  });

  it('get user profile', async (done) => {
    const { userProfileResponse } = mockData;
    moxios.stubRequest(`${url}12/profile`, {
      status: 200,
      response: userProfileResponse
    });

    const {
      user: {
        userId,
        name,
        username,
        email,
        imageUrl,
        myRecipes,
        myReviews,
        myFavs
      }
    } = userProfileResponse;

    const expectedActions = [{
      type: SET_USER_PROFILE,
      user: {
        userId,
        name,
        username,
        email,
        imageUrl,
        myRecipes,
        myReviews,
        myFavs
      }
    }];
    const store = mockStore({});
    await store.dispatch(getUser(12))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    done();
  });

  it('update user profile', async (done) => {
    const { signInResponse: { token } } = mockData;
    moxios.stubRequest(`${url}profile`, {
      status: 200,
      response: { user: { token } }
    });

    const expectedActions = [{
      type: SET_CURRENT_USER,
      userData: jsonwebtoken.decode(token)
    }];
    const store = mockStore({});
    await store.dispatch(updateProfile({ name: 'New name' }))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    done();
  });

  it('update user password', async (done) => {
    moxios.stubRequest(`${url}changePassword`, {
      status: 200,
    });

    const expectedActions = [{
      type: PASSWORD_CHANGED
    }];
    const store = mockStore({});
    await store.dispatch(changePassword({
      oldPassword: 'password', newPassword: 'kdffsfsk'
    }))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    done();
  });
});

