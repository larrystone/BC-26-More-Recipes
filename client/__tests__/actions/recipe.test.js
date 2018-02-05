import expect from 'expect';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import moxios from 'moxios';
import mockData from '../../__mocks__/mockData';
import {
  fetchPagedRecipe,
  searchRecipe,
  fetchRecipeDetails,
  fetchMyRecipes,
  deleteRecipe,
  addRecipe,
  editRecipe
} from '../../src/actions/recipeActions';
import {
  SET_PAGED_RECIPE, SET_MY_RECIPES, SET_CURRENT_RECIPE,
  DELETE_RECIPE, ADD_RECIPE, EDIT_RECIPE
} from '../../src/constants';

const middlewares = [thunk];

const url = '/api/v1/recipes';

const mockStore = configureMockStore(middlewares);

describe('Recipe actions', () => {
  beforeEach(() => moxios.install());
  afterEach(() => moxios.uninstall());

  const {
    validPagedRecipe,
    validPagedRecipeResponse,
    validCurrentRecipe,
    validCurrentRecipeResponse
  } = mockData;
  it('fetch paginated records from all recipes', async (done) => {
    moxios.stubRequest(`${url}?sort=upvotes&order=descending&limit=5&page=1`, {
      status: 200,
      response: validPagedRecipeResponse
    });
    const expectedActions = [{
      type: SET_PAGED_RECIPE,
      recipes: validPagedRecipe
    }];
    const store = mockStore({});
    await store.dispatch(fetchPagedRecipe(1, 5))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    done();
  });

  it('search for recipe and set results when found',
    async (done) => {
      moxios.stubRequest(`${url}?name=fufu&limit=5&page=1`, {
        status: 200,
        response: validPagedRecipeResponse
      });
      const expectedActions = [{
        type: SET_PAGED_RECIPE,
        recipes: validPagedRecipe
      }];
      const store = mockStore({});
      await store.dispatch(searchRecipe('name', 'fufu', 1, 5))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions);
        });
      done();
    });

  it('search for recipes and set empty result when nothing found',
    async (done) => {
      moxios.stubRequest(`${url}?name=fufu&limit=5&page=1`, {
        status: 404,
      });
      const expectedActions = [{
        type: SET_PAGED_RECIPE,
        recipes: {
          recipes: {},
          pagination: {}
        }
      }];
      const store = mockStore({});
      await store.dispatch(searchRecipe('name', 'fufu', 1, 5))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions);
        });
      done();
    });

  it('fetch recipe details', async (done) => {
    moxios.stubRequest(`${url}/12`, {
      status: 200,
      response: validCurrentRecipeResponse
    });
    const expectedActions = [{
      type: SET_CURRENT_RECIPE,
      recipe: validCurrentRecipe
    }];
    const store = mockStore({});
    await store.dispatch(fetchRecipeDetails(12))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    done();
  });
  it('fetch user owned recipes (paginated)', async (done) => {
    moxios.stubRequest('/api/v1/users/myRecipes?limit=5&page=1', {
      status: 200,
      response: validPagedRecipeResponse
    });
    const expectedActions = [{
      type: SET_MY_RECIPES,
      recipes: validPagedRecipe
    }];
    const store = mockStore({});
    await store.dispatch(fetchMyRecipes(1, 5))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    done();
  });
  it('delete recipe', async (done) => {
    moxios.stubRequest(`${url}/16`, {
      status: 200
    });
    const expectedActions = [{
      type: DELETE_RECIPE,
      id: 16
    }];
    const store = mockStore({});
    await store.dispatch(deleteRecipe(16))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    done();
  });
  it('add new recipe', async (done) => {
    moxios.stubRequest(`${url}`, {
      status: 201,
      response: validCurrentRecipeResponse
    });
    const expectedActions = [{
      type: ADD_RECIPE,
      recipe: validCurrentRecipe
    }];
    const store = mockStore({});
    await store.dispatch(addRecipe())
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    done();
  });
  it('modify recipe', async (done) => {
    moxios.stubRequest(`${url}/198`, {
      status: 200,
      response: validCurrentRecipeResponse
    });
    const expectedActions = [{
      type: EDIT_RECIPE,
      recipe: validCurrentRecipe
    }];
    const store = mockStore({});
    await store.dispatch(editRecipe(198, validCurrentRecipe))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    done();
  });
});
