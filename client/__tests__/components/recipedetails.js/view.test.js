import React from 'react';
import { shallow } from 'enzyme';
import View from './../../../../client/src/components/recipedetails/View'; //eslint-disable-line

import mockData from '../../../__mocks__/mockData';

let props;
let mountedComponent;

/**
 * @description Initialise the component
 *
 * @returns {object} ManageRecipe - Mounted component
 */
const getComponent = () => {
  if (!mountedComponent) {
    mountedComponent = shallow(<View {...props} />);
  }
  return mountedComponent;
};

describe('Components: RecipeDetails > View', () => {
  beforeEach(() => {
    props = {
      actions: {},
      newReview: '',
      posting: true,
      isFav: false,
      loading: false,
      index: 0,
      recipe: {},
      reviews: []
    };
    mountedComponent = undefined;
  });

  describe('Conditional rendering', () => {
    it('renders Loader component', () => {
      const loading = getComponent().find('Loading').first();
      expect(loading.length).toBe(1);
    });

    it('renders recipe details properly', () => {
      props.recipe = mockData.validCurrentRecipe;
      props.actions.upvote = jest.fn();
      props.actions.downvote = jest.fn();
      const divs = getComponent().find('div');
      expect(divs.length).toBeGreaterThan(0);
    });
  });

  describe('Vote actions', () => {
    beforeEach(() => {
      props.recipe = mockData.validCurrentRecipe;
      props.actions.upvote = jest.fn();
      props.actions.downvote = jest.fn();
    });

    it('calls upvote() when upvote button is clicked', () => {
      const upvoteButton = getComponent().find('Button').at(2);
      expect(upvoteButton.props().content).toBe('Likes');

      const buttonClickSpy = jest.spyOn(props.actions, 'upvote');
      upvoteButton.simulate('click');
      expect(buttonClickSpy).toHaveBeenCalledTimes(1);
    });

    it('calls downvote() when downvote button is clicked', () => {
      const downvoteButton = getComponent().find('Button').at(1);
      expect(downvoteButton.props().content).toBe('Dislikes');

      const buttonClickSpy = jest.spyOn(props.actions, 'downvote');
      downvoteButton.simulate('click');
      expect(buttonClickSpy).toHaveBeenCalledTimes(1);
    });
  });


  describe('Favorite button', () => {
    beforeEach(() => {
      props.recipe = mockData.validCurrentRecipe;
      props.isFav = true;
      props.actions.removeFav = jest.fn();
      props.actions.addFav = jest.fn();
    });

    it('render a recipe as favorite', () => {
      const favButton = getComponent().find('Icon').at(0);
      expect(favButton.props().name).toBe('star');
    });

    it('do not render a recipe as favorite', () => {
      props.isFav = false;
      const favButton = getComponent().find('Icon').at(0);
      expect(favButton.props().name).toBe('empty star');
    });


    describe('Actions', () => {
      it('calls removeFav() when clicked', () => {
        const removeFavButton = getComponent().find('Icon').at(0);
        const buttonClickSpy = jest.spyOn(props.actions, 'removeFav');
        removeFavButton.simulate('click');
        expect(buttonClickSpy).toHaveBeenCalledTimes(1);
      });

      it('calls addFav() when clicked', () => {
        props.isFav = false;
        const addFavButton = getComponent().find('Icon').at(0);
        const buttonClickSpy = jest.spyOn(props.actions, 'addFav');
        addFavButton.simulate('click');
        expect(buttonClickSpy).toHaveBeenCalledTimes(1);
      });
    });
  });
});
