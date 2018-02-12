import React from 'react';
import { shallow } from 'enzyme';
import View from './../../../../client/src/components/header/View'; //eslint-disable-line

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

describe('Component: HeaderView', () => {
  beforeEach(() => {
    props = {
      loggedUser: {},
      activePage: '',
      goTo: jest.fn(),
      signOut: jest.fn()
    };
    mountedComponent = undefined;
  });

  it('renders properly', () => {
    const divs = getComponent().find('div');
    expect(divs.length).toBeGreaterThan(0);
  });

  describe('Navigation and Links', () => {
    it('navigate to Profile page', () => {
      const handleSaveRecipeSpy = jest.spyOn(props, 'goTo');
      getComponent().find('MenuItem').first().simulate('click');
      expect(handleSaveRecipeSpy).toHaveBeenCalledTimes(1);
    });

    it('sign out and goto hompage', () => {
      const handleSaveRecipeSpy = jest.spyOn(props, 'signOut');
      getComponent().find('MenuItem').last().simulate('click');
      expect(handleSaveRecipeSpy).toHaveBeenCalledTimes(1);
    });

    it('navigate to recipes homepage', () => {
      const handleSaveRecipeSpy = jest.spyOn(props, 'goTo');
      getComponent().find('Button').first().simulate('click');
      expect(handleSaveRecipeSpy).toHaveBeenCalledTimes(1);
    });

    it('navigate to my recipes page', () => {
      const handleSaveRecipeSpy = jest.spyOn(props, 'goTo');
      getComponent().find('Button').at(1).simulate('click');
      expect(handleSaveRecipeSpy).toHaveBeenCalledTimes(1);
    });

    it('navigate to my favorite recipes page', () => {
      const handleSaveRecipeSpy = jest.spyOn(props, 'goTo');
      getComponent().find('Button').last().simulate('click');
      expect(handleSaveRecipeSpy).toHaveBeenCalledTimes(1);
    });
  });
});
