import React from 'react';
import { shallow } from 'enzyme';
import Info from './../../../../client/src/components/profile/Info'; //eslint-disable-line

let props;
let mountedComponent;

/**
 * @description Initialise the component
 *
 * @returns {object} ManageRecipe - Mounted component
 */
const getComponent = () => {
  if (!mountedComponent) {
    mountedComponent = shallow(<Info {...props} />);
  }
  return mountedComponent;
};

describe('Component: Profile > Info', () => {
  beforeEach(() => {
    props = {
      actions: {},
      loading: false,
      activeIndex: 0,
      isAdmin: false,
      profile: {}
    };
    mountedComponent = undefined;
  });

  it('renders properly', () => {
    const card = getComponent().find('Card');
    expect(card.length).toBeGreaterThan(0);
  });

  describe('Form input components', () => {
    beforeEach(() => {
      props.actions.handleImageChange = jest.fn();
      props.actions.storeToState = jest.fn();
      props.actions.updateProfile = jest.fn();
      props.actions.changePassword = jest.fn();
    });
    const event = { target: { value: 'some text' } };

    it('should call handleImageChange() when image is picked', () => {
      const handleRemoveModalSpy =
        jest.spyOn(props.actions, 'handleImageChange');
      getComponent().find('FormInput').at(0).simulate('change', event);
      expect(handleRemoveModalSpy).toHaveBeenCalledTimes(1);
    });

    it('should call storeToState() when full name change', () => {
      const handleOnChangeSpy = jest.spyOn(props.actions, 'storeToState');
      getComponent().find('FormInput').at(1).simulate('change', event);
      expect(handleOnChangeSpy).toHaveBeenCalledTimes(1);
    });

    it('should call storeToState() when username change', () => {
      const handleOnChangeSpy = jest.spyOn(props.actions, 'storeToState');
      getComponent().find('FormInput').at(2).simulate('change', event);
      expect(handleOnChangeSpy).toHaveBeenCalledTimes(1);
    });

    it('should call storeToState() when current password change', () => {
      const handleOnChangeSpy = jest.spyOn(props.actions, 'storeToState');
      getComponent().find('FormInput').at(4).simulate('change', event);
      expect(handleOnChangeSpy).toHaveBeenCalledTimes(1);
    });

    it('should call storeToState() when new password change', () => {
      const handleOnChangeSpy = jest.spyOn(props.actions, 'storeToState');
      getComponent().find('FormInput').at(5).simulate('change', event);
      expect(handleOnChangeSpy).toHaveBeenCalledTimes(1);
    });

    it('should call storeToState() when new password confirm change', () => {
      const handleOnChangeSpy = jest.spyOn(props.actions, 'storeToState');
      getComponent().find('FormInput').at(6).simulate('change', event);
      expect(handleOnChangeSpy).toHaveBeenCalledTimes(1);
    });

    it('should call storeToState() when new password change', () => {
      const handleOnChangeSpy = jest.spyOn(props.actions, 'storeToState');
      getComponent().find('FormInput').at(4).simulate('change', event);
      expect(handleOnChangeSpy).toHaveBeenCalledTimes(1);
    });

    it('call updateProfile() when Update button is clicked', () => {
      const handleOnChangeSpy = jest.spyOn(props.actions, 'updateProfile');
      getComponent().find('FormButton').at(0).simulate('click');
      expect(handleOnChangeSpy).toHaveBeenCalledTimes(1);
    });

    it('call changePassword() when Change password button is clicked', () => {
      const handleOnChangeSpy = jest.spyOn(props.actions, 'changePassword');
      getComponent().find('FormButton').at(1).simulate('click');
      expect(handleOnChangeSpy).toHaveBeenCalledTimes(1);
    });
  });
});
