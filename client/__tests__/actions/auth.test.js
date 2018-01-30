import expect from 'expect';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import moxios from 'moxios';
import jwt from 'jsonwebtoken';
import mockData from '../../__mocks__/dataMock';
import {
  signIn,
  signUp,
  signOut,
  getUser
} from '../../src/actions/authActions';
import { SET_CURRENT_USER, SET_USER_PROFILE } from '../../src/constants';

import mockLocalStorage from '../../__mocks__/localStorageMock';

const middlewares = [thunk];

const mockStore = configureMockStore(middlewares);

window.localStorage = mockLocalStorage;

describe('Authentication actions', () => {
  beforeEach(() => moxios.install());
  afterEach(() => moxios.uninstall());

  it('signs up a new user', async (done) => {
    const { signUpData, signUpresponse } = mockData;
    moxios.stubRequest('/api/v1/users/signup', {
      status: 200,
      response: signUpresponse
    });
    const { token } = signUpresponse;
    const expectedActions = [{
      type: SET_CURRENT_USER,
      userData: jwt.decode(token)
    }];
    const store = mockStore({});
    await store.dispatch(signUp(signUpData))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    done();
  });

  it('signs in a user', async (done) => {
    const { signInData, signInResponse } = mockData;
    moxios.stubRequest('/api/v1/users/signin', {
      status: 200,
      response: signInResponse
    });
    const { token } = signInResponse;
    const expectedActions = [{
      type: SET_CURRENT_USER,
      userData: jwt.decode(token)
    }];
    const store = mockStore({});
    await store.dispatch(signIn(signInData))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    done();
  });

  it('signs out a user', async (done) => {
    const expectedActions = [{
      type: SET_CURRENT_USER,
      userData: {}
    }];
    const store = mockStore({});
    store.dispatch(signOut());
    expect(store.getActions()).toEqual(expectedActions);
    done();
  });

  it('gets a user details', async (done) => {
    const { userProfileResponse } = mockData;
    moxios.stubRequest('/api/v1/users/12/profile', {
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
});

