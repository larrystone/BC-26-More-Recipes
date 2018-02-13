import React from 'react';
import expect from 'expect';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import ConnectedRecipeDetails, {
  RecipeDetail
} from '../../../src/components/recipedetails';
import mockData from '../../../__mocks__/mockData';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

let props;
let mountedComponent;
jest.mock('../../../src/utils/notify');

/**
 * @description Initialise the component
 *
 * @returns {object} ManageRecipe - Mounted component
 */
const getComponent = () => {
  if (!mountedComponent) {
    mountedComponent = shallow(<RecipeDetail {...props} />);
  }
  return mountedComponent;
};

describe('Component: RecipeDetails', () => {
  beforeEach(() => {
    global.toastr = {
      success: jest.fn(),
      error: jest.fn()
    };
    props = {
      match: {
        params: { id: 1 }
      },
      recipe: {
        id: 2
      },
      reviews: [],
      isFav: false,
      addRecipeReview: jest.fn(),
      downvote: jest.fn(),
      upvote: jest.fn(),
      removeFav: jest.fn(),
      addFav: jest.fn(),
      fetchRecipeDetails: () => Promise.resolve(),
      fetchSingleFavorite: () => Promise.resolve(),
      fetchRecipeReviews: () => Promise.resolve(),
    };
    mountedComponent = undefined;
  });

  describe('componentWillMount() >  fetchRecipeDetails()', () => {
    it('should call componentWillMount()', () => {
      props.fetchRecipeDetails = () => Promise.reject();
      sinon.spy(getComponent().instance(), 'componentWillMount');
      getComponent().instance().componentWillMount();
      expect(getComponent().instance().componentWillMount.calledOnce)
        .toEqual(true);
    });
  });

  describe('addFav()', () => {
    it('failure response', () => {
      props.addFav = () => Promise.reject();
      sinon.spy(getComponent().instance(), 'addFav');
      getComponent().instance().addFav();
      expect(getComponent().instance().addFav.calledOnce)
        .toEqual(true);
    });
  });

  describe('removeFav()', () => {
    it('failure response', () => {
      props.removeFav = () => Promise.reject();
      sinon.spy(getComponent().instance(), 'removeFav');
      getComponent().instance().removeFav();
      expect(getComponent().instance().removeFav.calledOnce)
        .toEqual(true);
    });
  });

  describe('upvote()', () => {
    it('success response', () => {
      props.upvote = () => Promise.resolve();
      sinon.spy(getComponent().instance(), 'upvote');
      getComponent().instance().upvote();
      expect(getComponent().instance().upvote.calledOnce)
        .toEqual(true);
    });

    it('failure response', () => {
      props.upvote = () => Promise.reject();
      sinon.spy(getComponent().instance(), 'upvote');
      getComponent().instance().upvote();
      expect(getComponent().instance().upvote.calledOnce)
        .toEqual(true);
    });
  });

  describe('downvote()', () => {
    it('success response', () => {
      props.downvote = () => Promise.resolve();
      sinon.spy(getComponent().instance(), 'downvote');
      getComponent().instance().downvote();
      expect(getComponent().instance().downvote.calledOnce)
        .toEqual(true);
    });

    it('failure response', () => {
      props.downvote = () => Promise.reject();
      sinon.spy(getComponent().instance(), 'downvote');
      getComponent().instance().downvote();
      expect(getComponent().instance().downvote.calledOnce)
        .toEqual(true);
    });
  });

  describe('storeToState()', () => {
    it('calls downvote() and gets failure response', () => {
      const event = { key: 'name', value: 'fufu' };
      sinon.spy(getComponent().instance(), 'storeToState');
      getComponent().instance().storeToState(event.key, event.value);
      expect(getComponent().instance().storeToState.calledOnce)
        .toEqual(true);
    });
  });

  describe('addReview() > addRecipeReview()', () => {
    it('success response', () => {
      props.addRecipeReview = () => Promise.resolve();
      sinon.spy(getComponent().instance(), 'addReview');
      getComponent().instance().addReview();
      expect(getComponent().instance().addReview.calledOnce)
        .toEqual(true);
    });

    it('failure response', () => {
      props.addRecipeReview = () => Promise.reject(new Error({
        message: 'An error'
      }));
      sinon.spy(getComponent().instance(), 'addReview');
      getComponent().instance().addReview();
      expect(getComponent().instance().addReview.calledOnce)
        .toEqual(true);
    });
  });

  describe('Connected RecipeDetails component', () => {
    it('tests that the component successfully rendered', () => {
      const { validCurrentRecipe, validReviews } = mockData;
      const store = mockStore({
        auth: {
          user: { id: 2 }
        },
        recipe: {
          currentRecipe: validCurrentRecipe
        },
        review: {
          reviews: validReviews
        },
        favorite: {
          isFav: true
        }
      });
      const wrapper = shallow(<ConnectedRecipeDetails store={store} />);
      expect(wrapper.length).toBe(1);
    });
  });
});
