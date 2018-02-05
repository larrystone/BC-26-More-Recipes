import React from 'react';
import { shallow } from 'enzyme';
import View from './../../../../client/src/components/myrecipes/View'; //eslint-disable-line

import mockData from '../../../__mocks__/mockData';

jest.mock('../../../src/components/commons/RecipeItem');

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

describe('Component: MyRecipes > View', () => {
  beforeEach(() => {
    props = {
      isLoading: false,
      recipes: {},
      showDetails: jest.fn(),
      deleteRecipe: jest.fn(),
      newRecipe: jest.fn(),
      editRecipe: jest.fn()
    };
    mountedComponent = undefined;
  });

  describe('Conditional rendering', () => {
    it('renders loader component when isLoading is true', () => {
      props.isLoading = true;
      const loading = getComponent().find('Loading');
      expect(loading.length).toBe(1);
    });

    it('renders NothingFound component when no recipe is found', () => {
      props.isLoading = false;
      props.newRecipe = jest.fn();
      const nothingFound = getComponent().find('NothingFound');
      expect(nothingFound.length).toBe(1);
    });

    it('renders recipes component when found', () => {
      props.isLoading = false;
      props.storeToState = jest.fn();
      props.recipes = mockData.validPagedRecipe;
      const nothingFound = getComponent().find('NothingFound');
      expect(nothingFound.length).toBe(0);
    });
  });

  it('calls newRecipe() when new recipe button clicked', () => {
    const newRecipeSpy = jest.spyOn(props, 'newRecipe');
    getComponent().find('Button').first().simulate('click');

    expect(newRecipeSpy).toHaveBeenCalledTimes(1);
  });
});

