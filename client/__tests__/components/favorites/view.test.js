import React from 'react';
import { shallow } from 'enzyme';
import View from './../../../../client/src/components/favorites/View'; //eslint-disable-line

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

describe('FavoritesView', () => {
  beforeEach(() => {
    props = {
      isLoading: false,
      recipes: {},
      showDetails: jest.fn(),
      addModal: jest.fn()
    };
    mountedComponent = undefined;
  });

  it('renders properly', () => {
    const divs = getComponent().find('div');
    expect(divs.length).toBeGreaterThan(0);
  });

  describe('Conditional rendering', () => {
    it('renders loader component when isLoading', () => {
      props.isLoading = true;
      const loading = getComponent().find('Loading');
      expect(loading.length).toBe(1);
    });

    it('renders NothingFound component when no recipe is found', () => {
      props.isLoading = false;
      const nothingFound = getComponent().find('NothingFound');
      expect(nothingFound.length).toBe(1);
    });

    it('renders recipes component when found', () => {
      props.isLoading = false;
      props.storeToState = jest.fn();
      props.recipes = mockData.validPagedRecipe;
      const recipeItems = getComponent().find('RecipeItem');
      expect(recipeItems.length).toBeGreaterThan(0);
    });
  });
});
