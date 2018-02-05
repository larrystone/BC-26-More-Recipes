import expect from 'expect';
import Review from '../../src/reducers/review';
import mockData from '../../__mocks__/mockData';

describe('Recipe Reducer', () => {
  const {
    validReviews,
    validNewReview
  } = mockData;
  describe('SET_RECIPE_REVIEWS', () => {
    it('set recipe reviews', () => {
      const initialState = {
        reviews: []
      };
      const action = {
        type: 'SET_RECIPE_REVIEWS',
        reviews: validReviews
      };
      const newState = Review(initialState, action);
      expect(newState.reviews).toEqual(validReviews);
    });
  });

  describe('ADD_REVIEW', () => {
    it('add new recipe review', () => {
      const initialState = {
        reviews: validReviews
      };
      const action = {
        type: 'ADD_REVIEW',
        review: validNewReview
      };
      const newState = Review(initialState, action);
      expect(newState.reviews.length).toEqual(3);
      expect(newState.reviews).toEqual([validNewReview, ...validReviews]);
    });
  });

  describe('Edge cases', () => {
    it('return initial state when invalid action type provided',
      () => {
        const initialState = {
          reviews: validReviews
        };
        const action = {
          type: 'REVIEW_ADD',
          review: validNewReview
        };
        const newState = Review(initialState, action);
        expect(newState).toEqual(initialState);
      });

    it('use default state when no initial state data is passed',
      () => {
        const action = {
          type: 'ADD_REVIEW',
          review: validNewReview
        };
        const newState = Review(undefined, action);
        expect(newState).toEqual({
          reviews: [validNewReview]
        });
      });
  });
});
