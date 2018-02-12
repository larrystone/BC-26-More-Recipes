import React from 'react';
import { shallow } from 'enzyme';
import RecipeItem from './../../../../client/src/components/commons/RecipeItem'; //eslint-disable-line

let props;
let mountedComponent;

/**
 * @description Initialise the component
 *
 * @returns {object} ManageRecipe - Mounted component
 */
const getComponent = () => {
  if (!mountedComponent) {
    mountedComponent = shallow(<RecipeItem {...props} />);
  }
  return mountedComponent;
};

describe('Component: RecipeItem', () => {
  beforeEach(() => {
    props = {
      actions: {
        showDetails: jest.fn(),
        editRecipe: jest.fn(),
        deleteRecipe: jest.fn(),
        deleteFav: jest.fn(),
      },
      recipe: {},
    };
    mountedComponent = undefined;
  });

  it('renders properly', () => {
    const cards = getComponent().find('Card');
    expect(cards.length).toBe(1);
  });

  describe('handleView()', () => {
    it('should call showDetails() when recipe Image clicked', () => {
      props.actions.showDetails = jest.fn();
      const handleUpdateRecipeSpy = jest.spyOn(props.actions, 'showDetails');
      const recipeImage = getComponent().find('Image').first();
      recipeImage.simulate('click');

      expect(handleUpdateRecipeSpy).toHaveBeenCalledTimes(1);
    });

    it('should call notify() when recipe Image clicked', () => {
      props.actions.showDetails = undefined;
      const recipeImage = getComponent().find('Image').first();
      recipeImage.simulate('click');
    });
  });

  describe('My Recipe actions', () => {
    beforeEach(() => {
      props.isAdmin = true;
      props.actions.editRecipe = jest.fn();
      props.actions.deleteRecipe = jest.fn();
    });

    it('call showDetails() when view clicked', () => {
      props.actions.showDetails = jest.fn();
      const handleUpdateRecipeSpy = jest.spyOn(props.actions, 'showDetails');
      const viewRecipe = getComponent().find('div').at(1);
      viewRecipe.simulate('click');
      expect(handleUpdateRecipeSpy).toHaveBeenCalledTimes(1);
    });

    it('call editRecipe() when edit clicked', () => {
      const editRecipeSpy = jest.spyOn(props.actions, 'editRecipe');
      const editRecipe = getComponent().find('div').at(3);
      editRecipe.simulate('click');
      expect(editRecipeSpy).toHaveBeenCalledTimes(1);
    });

    it('call deleteRecipe() when delete clicked', () => {
      const deleteRecipeSpy = jest.spyOn(props.actions, 'deleteRecipe');
      const deleteRecipe = getComponent().find('div').at(5);
      deleteRecipe.simulate('click');
      expect(deleteRecipeSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Favorite recipe actions', () => {
    beforeEach(() => {
      props.isFav = true;
      props.actions.deleteFav = jest.fn();
    });

    it('call showDetails() when view clicked', () => {
      props.actions.showDetails = jest.fn();
      const handleUpdateRecipeSpy = jest.spyOn(props.actions, 'showDetails');
      const viewRecipe = getComponent().find('div').at(1);
      viewRecipe.simulate('click');
      expect(handleUpdateRecipeSpy).toHaveBeenCalledTimes(1);
    });

    it('call deleteFav() when remove clicked', () => {
      const deleteFavSpy = jest.spyOn(props.actions, 'deleteFav');
      const deleteFav = getComponent().find('div').at(3);
      deleteFav.simulate('click');
      expect(deleteFavSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Recipe owner name', () => {
    it('shows by User.name when props.recipe.User exist', () => {
      props.recipe = {
        User: {
          name: 'larrystone'
        }
      };
      const recipeAuthor = getComponent().find('em').first();
      expect(recipeAuthor.props().children[1]).toBe('larrystone');
    });

    it('shows nothing when props.recipe.User does not exist', () => {
      const cardContent = getComponent().find('CardContent').first();
      expect(cardContent.props().children[2]).toBe('');
    });
  });
});

