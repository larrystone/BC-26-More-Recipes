import React from 'react';
import { shallow } from 'enzyme';
import View from './../../../../client/src/components/allrecipes/View'; //eslint-disable-line

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

describe('Component: AllRecipes: View', () => {
  beforeEach(() => {
    props = {
      isLoading: false,
      recipes: {},
      storeToState: jest.fn(),
      search: jest.fn(),
      searchCategory: '',
      sought: false,
      showDetails: jest.fn()
    };
    mountedComponent = undefined;
  });

  describe('Conditional rendering', () => {
    it('renders loader component when isLoading', () => {
      props.isLoading = true;
      const loading = getComponent().find('Loading');
      expect(loading.length).toBe(1);
    });

    it('renders NothingFound component when no recipe is found', () => {
      props.isLoading = false;
      props.storeToState = jest.fn();
      const nothingFound = getComponent().find('NothingFound');
      expect(nothingFound.length).toBe(1);
    });

    it('renders recipes when found', () => {
      props.isLoading = false;
      props.storeToState = jest.fn();
      props.recipes = mockData.validPagedRecipe;
      const nothingFound = getComponent().find('NothingFound');
      expect(nothingFound.length).toBe(0);
    });
  });

  describe('Search box components', () => {
    const event = { target: { value: 'some text' } };
    const data = { value: '222' };

    beforeEach(() => {
      props.isLoading = false;
      props.storeToState = jest.fn();
      props.recipes = mockData.validPagedRecipe;
    });

    it('calls storeToState() when search string changes', () => {
      const storeToStateSpy = jest.spyOn(props, 'storeToState');
      const recipeImage = getComponent().find('Input').first();
      recipeImage.simulate('change', event);

      expect(storeToStateSpy).toHaveBeenCalledTimes(1);
    });

    it('calls storeToState() when search category changes', () => {
      const storeToStateSpy = jest.spyOn(props, 'storeToState');
      const recipeImage = getComponent().find('Select').first();
      recipeImage.simulate('change', event, data);

      expect(storeToStateSpy).toHaveBeenCalledTimes(1);
    });

    it('calls search() when search button is clicked', () => {
      const storeToStateSpy = jest.spyOn(props, 'search');
      const recipeImage = getComponent().find('Button').first();
      recipeImage.simulate('click');

      expect(storeToStateSpy).toHaveBeenCalledTimes(1);
    });
  });
});
