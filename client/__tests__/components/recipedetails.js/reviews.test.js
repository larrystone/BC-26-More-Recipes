import React from 'react';
import { shallow } from 'enzyme';
import Reviews from './../../../../client/src/components/recipedetails/Reviews'; //eslint-disable-line

import mockData from '../../../__mocks__/mockData';

let props;
let mountedComponent;
const reviews = mockData.validReviews;

/**
 * @description Initialise the component
 *
 * @returns {object} ManageRecipe - Mounted component
 */
const getComponent = () => {
  if (!mountedComponent) {
    mountedComponent = shallow(<Reviews {...props} />);
  }
  return mountedComponent;
};

describe('Component: RecipeDetails > Reviews', () => {
  beforeEach(() => {
    props = {
      actions: {
        storeToState: jest.fn()
      },
      reviews: [],
      newReview: '',
      index: 0,
      posting: true,

    };
    mountedComponent = undefined;
  });

  describe('Conditional rendering', () => {
    it('renders "No user posted a review"', () => {
      const cardContent = getComponent().find('CommentText').first();
      expect(cardContent.props().children).toBe('No user posted a review');
    });

    it('renders "Loading reviews..."', () => {
      props.reviews = undefined;
      const cardContent = getComponent().find('CommentText').first();
      expect(cardContent.props().children).toBe('Loading Reviews...');
    });

    it('renders reviews', () => {
      props.reviews = reviews;
      const comments = getComponent().find('CommentAvatar');
      expect(comments.length).toBeGreaterThan(0);
    });


    it('loadOlder button', () => {
      props.reviews = reviews
        .concat(reviews, reviews, reviews, reviews, reviews);
      props.index = 0;
      const loadOlderButton = getComponent().find('button').at(0);
      expect(loadOlderButton.props().children).toBe('Load older');

      const buttonClickSpy = jest.spyOn(props.actions, 'storeToState');
      loadOlderButton.simulate('click');
      expect(buttonClickSpy).toHaveBeenCalledTimes(1);
    });

    it('loadNewer button', () => {
      props.reviews = mockData.validReviews;
      props.index = 2;
      const loadNewerButton = getComponent().find('button').at(0);
      expect(loadNewerButton.props().children).toBe('Load newer');

      const buttonClickSpy = jest.spyOn(props.actions, 'storeToState');
      loadNewerButton.simulate('click');
      expect(buttonClickSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Form inputs', () => {
    const event = { target: { value: 'some review' } };
    beforeEach(() => {
      props.actions.addReview = jest.fn();
    });
    it('calls storeToState() when review changes', () => {
      const formInput = getComponent().find('FormTextArea').at(0);

      const inputChangeSpy = jest.spyOn(props.actions, 'storeToState');
      formInput.simulate('change', event);
      expect(inputChangeSpy).toHaveBeenCalledTimes(2);
    });

    it('calls addReview() when submit button clicked', () => {
      const formInput = getComponent().find('Button').at(0);

      const buttonClick = jest.spyOn(props.actions, 'addReview');
      formInput.simulate('click');
      expect(buttonClick).toHaveBeenCalledTimes(1);
    });
  });
});
