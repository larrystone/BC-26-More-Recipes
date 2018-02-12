import React from 'react';
import { shallow } from 'enzyme';
import AppIntro from './../../../../client/src/components/Home/AppIntro'; //eslint-disable-line

let props;
let mountedComponent;

/**
 * @description Initialise the component
 *
 * @returns {object} ManageRecipe - Mounted component
 */
const getComponent = () => {
  if (!mountedComponent) {
    mountedComponent = shallow(<AppIntro {...props} />);
  }
  return mountedComponent;
};

describe('AppIntro', () => {
  beforeEach(() => {
    props = {
      storeToState: jest.fn(),
      handleSignIn: jest.fn(),
      handleSignUp: jest.fn(),
      isLoading: false
    };
    mountedComponent = undefined;
  });

  it('renders properly', () => {
    const divs = getComponent().find('div');
    expect(divs.length).toBeGreaterThan(0);
  });

  describe('Sign In Form', () => {
    const event = { target: { value: 'some text' } };
    it('calls storeToState() when authName changes', () => {
      const storeToStateSpy = jest.spyOn(props, 'storeToState');
      getComponent().find('FormInput').first().simulate('change', event);
      expect(storeToStateSpy).toHaveBeenCalledTimes(1);
    });

    it('calls storeToState() when password changes', () => {
      const storeToStateSpy = jest.spyOn(props, 'storeToState');
      getComponent().find('FormInput').at(1).simulate('change', event);
      expect(storeToStateSpy).toHaveBeenCalledTimes(1);
    });

    it('calls handleSignIn() when sign In button clicked', () => {
      const signInSpy = jest.spyOn(props, 'handleSignIn');
      getComponent().find('FormButton').first().simulate('click');
      expect(signInSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Sign Up Form', () => {
    const event = { target: { value: 'some text' } };
    it('calls storeToState() when full name changes', () => {
      const storeToStateSpy = jest.spyOn(props, 'storeToState');
      getComponent().find('FormInput').at(2).simulate('change', event);
      expect(storeToStateSpy).toHaveBeenCalledTimes(1);
    });

    it('calls storeToState() when username changes', () => {
      const storeToStateSpy = jest.spyOn(props, 'storeToState');
      getComponent().find('FormInput').at(3).simulate('change', event);
      expect(storeToStateSpy).toHaveBeenCalledTimes(1);
    });

    it('calls storeToState() when email changes', () => {
      const storeToStateSpy = jest.spyOn(props, 'storeToState');
      getComponent().find('FormInput').at(4).simulate('change', event);
      expect(storeToStateSpy).toHaveBeenCalledTimes(1);
    });

    it('calls storeToState() when password changes', () => {
      const storeToStateSpy = jest.spyOn(props, 'storeToState');
      getComponent().find('FormInput').at(5).simulate('change', event);
      expect(storeToStateSpy).toHaveBeenCalledTimes(1);
    });

    it('calls storeToState() when confirm password changes', () => {
      const storeToStateSpy = jest.spyOn(props, 'storeToState');
      getComponent().find('FormInput').at(6).simulate('change', event);
      expect(storeToStateSpy).toHaveBeenCalledTimes(1);
    });

    it('calls handleSignUp() when sign up button clicked', () => {
      const signInSpy = jest.spyOn(props, 'handleSignUp');
      getComponent().find('FormButton').last().simulate('click');
      expect(signInSpy).toHaveBeenCalledTimes(1);
    });
  });
});
