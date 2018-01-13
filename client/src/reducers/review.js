import {
  SET_RECIPE_REVIEWS, ADD_REVIEW
} from '../constants';

const initialState = {
  reviews: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_RECIPE_REVIEWS:
      return { ...state, reviews: action.reviews };
    case ADD_REVIEW:
      return {
        ...state,
        reviews: [action.review, ...state.reviews]
      };
    default: return state;
  }
};
