import expect from 'expect';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import moxios from 'moxios';
import mockData from '../../__mocks__/mockData';
import {
  addFav,
  removeFav,
  fetchFavorites,
  fetchSingleFavorite
} from '../../src/actions/favActions';
import { REMOVE_FAV, SET_MY_FAVS, SET_IS_FAV } from '../../src/constants';

const middlewares = [thunk];

const url = '/api/v1/users';

const mockStore = configureMockStore(middlewares);

describe('Favorite actions', () => {
  beforeEach(() => moxios.install());
  afterEach(() => moxios.uninstall());

  it('add new recipe to favorite', async (done) => {
    moxios.stubRequest(`${url}/recipes/22`, {
      status: 200,
      isFav: true
    });
    const expectedActions = [{
      type: SET_IS_FAV,
      isFav: true
    }];
    const store = mockStore({});
    await store.dispatch(addFav(22))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    done();
  });

  it('remove recipe from favorites', async (done) => {
    moxios.stubRequest(`${url}/recipes/12`, {
      status: 200,
      id: 12
    });
    const expectedActions = [{
      type: REMOVE_FAV,
      id: 12
    }];
    const store = mockStore({});
    await store.dispatch(removeFav(12))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    done();
  });

  it('fetch user favorite recipes', async (done) => {
    const { validFavoriteResponse, validFavoriteAction } = mockData;
    moxios.stubRequest(`${url}/12/recipes`, {
      status: 200,
      response: {
        recipes: validFavoriteResponse
      }
    });
    const expectedActions = [{
      type: SET_MY_FAVS,
      recipes: validFavoriteAction
    }];
    const store = mockStore({});
    await store.dispatch(fetchFavorites(12))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    done();
  });


  it('set isFav to true when a recipe is user favorited', async (done) => {
    const { validFavoriteResponse } = mockData;
    moxios.stubRequest(`${url}/recipes/14`, {
      status: 200,
      response: {
        recipe: validFavoriteResponse
      }
    });
    const expectedActions = [{
      type: SET_IS_FAV,
      isFav: true
    }];
    const store = mockStore({});
    await store.dispatch(fetchSingleFavorite(14))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    done();
  });

  it('set isFav to false when a recipe is not user favorited', async (done) => {
    moxios.stubRequest(`${url}/recipes/14`, {
      status: 404
    });
    const expectedActions = [{
      type: SET_IS_FAV,
      isFav: false
    }];
    const store = mockStore({});
    await store.dispatch(fetchSingleFavorite(14))
      .catch(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    done();
  });
});

