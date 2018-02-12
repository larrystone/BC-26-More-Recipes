import expect from 'expect';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import moxios from 'moxios';
import mockData from '../../__mocks__/mockData';
import {
  fetchRecipeReviews,
  addRecipeReview
} from '../../src/actions/reviewActions';
import {
  SET_RECIPE_REVIEWS, ADD_REVIEW
} from '../../src/constants';

const middlewares = [thunk];

const url = '/api/v1/recipes';

const mockStore = configureMockStore(middlewares);

describe('Review actions', () => {
  beforeEach(() => moxios.install());
  afterEach(() => moxios.uninstall());

  const {
    validReviews,
    validReviewsResponse,
    validNewReview,
    validNewReviewResponse
  } = mockData;
  it('fetch and set reviews when found', async (done) => {
    moxios.stubRequest(`${url}/15/reviews`, {
      status: 200,
      response: validReviewsResponse
    });
    const expectedActions = [{
      type: SET_RECIPE_REVIEWS,
      reviews: validReviews
    }];
    const store = mockStore({});
    await store.dispatch(fetchRecipeReviews(15))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    done();
  });

  it('set empty array when no review found', async (done) => {
    moxios.stubRequest(`${url}/1/reviews`, {
      status: 404,
    });
    const expectedActions = [{
      type: SET_RECIPE_REVIEWS,
      reviews: []
    }];
    const store = mockStore({});
    await store.dispatch(fetchRecipeReviews(1))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    done();
  });

  it('add new recipe review',
    async (done) => {
      moxios.stubRequest(`${url}/20/reviews`, {
        status: 201,
        response: validNewReviewResponse
      });
      const expectedActions = [{
        type: ADD_REVIEW,
        review: validNewReview
      }];
      const store = mockStore({});
      await store.dispatch(addRecipeReview(20, validNewReview))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions);
        });
      done();
    });
});
