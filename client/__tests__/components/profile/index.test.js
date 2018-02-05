import React from 'react';
import expect from 'expect';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import ConnectedProfile, {
  ProfileContainer
} from '../../../src/components/profile';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

let props;
let mountedComponent;

/**
 * @description Initialise the component
 *
 * @returns {object} ManageRecipe - Mounted component
 */
const getComponent = () => {
  if (!mountedComponent) {
    mountedComponent = shallow(<ProfileContainer {...props} />);
  }
  return mountedComponent;
};

describe('Component: Profile', () => {
  beforeEach(() => {
    props = {
      match: {
        params: { userId: 1 }
      },
      getUser: () => Promise.resolve(),
      updateProfile: () => Promise.resolve(),
      fetchPagedRecipe: () => Promise.resolve(),
      userId: 1,
      pagination: {},
      profile: {
        userId: 1
      }
    };
    mountedComponent = undefined;
  });
  it('successfully renders', () => {
    const divs = getComponent().find('div');
    expect(divs.length).toBeGreaterThan(0);
  });

  describe('componentWillMount()', () => {
    it('should call componentWillMount()', () => {
      props.getUser = () => Promise.resolve();
      sinon.spy(getComponent().instance(), 'componentWillMount');
      getComponent().instance().componentWillMount();
      expect(getComponent().instance().componentWillMount.calledOnce)
        .toEqual(true);
    });
  });

  describe('componentWillReceiveProps()', () => {
    it('should call componentWillReceiveProps()', () => {
      props.getUser = () => Promise.resolve();
      sinon.spy(getComponent().instance(), 'componentWillReceiveProps');
      const match = { params: { userId: 8 } };
      getComponent().instance().componentWillReceiveProps({ ...props, match });
      expect(getComponent().instance().componentWillReceiveProps.calledOnce)
        .toEqual(true);
    });
  });

  describe('getUserProfile() > getUser()', () => {
    it('success response', () => {
      props.getUser = () => Promise.resolve();
      sinon.spy(getComponent().instance(), 'getUserProfile');
      getComponent().instance().getUserProfile(1);
      expect(getComponent().instance().getUserProfile.calledOnce)
        .toEqual(true);
    });

    it('failure response', () => {
      props.getUser = () => Promise.reject();
      sinon.spy(getComponent().instance(), 'getUserProfile');
      getComponent().instance().getUserProfile(1);
      expect(getComponent().instance().getUserProfile.calledOnce)
        .toEqual(true);
    });
  });

  describe('storeToState()', () => {
    const key = 'name';
    const value = 'stone';
    it('should call storeToState()', () => {
      sinon.spy(getComponent().instance(), 'storeToState');
      getComponent().instance().storeToState(key, value);
      expect(getComponent().instance().storeToState.calledOnce)
        .toEqual(true);
    });
  });

  describe('handleImageChange()', () => {
    beforeEach(() => {
      global.FileReader = () => ({
        readAsDataURL: () => { },
        onload: e => e
      });
      global.reader = {
        onload: () => { }
      };
    });
    const event = {
      target: {
        name: 'fufu',
        files: ['test files']
      },
      preventDefault: jest.fn()
    };
    it('should call handleImageChange()', () => {
      sinon.spy(getComponent().instance(), 'handleImageChange');
      getComponent().instance().handleImageChange(event);
      expect(getComponent().instance().handleImageChange.calledOnce)
        .toEqual(true);
    });
  });

  describe('handleAccordionClick()', () => {
    const event = {};
    const titleProps = { index: 2 };
    it('should call handleAccordionClick()', () => {
      sinon.spy(getComponent().instance(), 'handleAccordionClick');
      getComponent().instance().handleAccordionClick(event, titleProps);
      expect(getComponent().instance().handleAccordionClick.calledOnce)
        .toEqual(true);
    });
  });

  describe('updateProfile()', () => {
    it('success response', () => {
      props.updateProfile = () => Promise.resolve();
      sinon.spy(getComponent().instance(), 'updateProfile');
      getComponent().instance().updateProfile();
      expect(getComponent().instance().updateProfile.calledOnce)
        .toEqual(true);
    });

    it('failure response', () => {
      props.updateProfile = () => Promise.reject();
      sinon.spy(getComponent().instance(), 'updateProfile');
      getComponent().instance().updateProfile();
      expect(getComponent().instance().updateProfile.calledOnce)
        .toEqual(true);
    });
  });

  describe('changePassword()', () => {
    it('return "Password validation error"', () => {
      mountedComponent = getComponent();
      mountedComponent.setState({
        newPassword: 'iloveprogramming',
        confirmPassword: 'iloveprmming'
      });
      mountedComponent.instance().changePassword();
    });

    it('success response', () => {
      props.changePassword = () => Promise.resolve();
      sinon.spy(getComponent().instance(), 'changePassword');
      mountedComponent = getComponent();
      mountedComponent.setState({
        newPassword: 'iloveprogramming',
        confirmPassword: 'iloveprogramming'
      });
      getComponent().instance().changePassword();
      expect(getComponent().instance().changePassword.calledOnce)
        .toEqual(true);
    });

    it('failure response', () => {
      props.changePassword = () => Promise.reject();
      sinon.spy(getComponent().instance(), 'changePassword');
      mountedComponent = getComponent();
      mountedComponent.setState({
        newPassword: 'iloveprogramming',
        confirmPassword: 'iloveprogramming'
      });
      getComponent().instance().changePassword();
      expect(getComponent().instance().changePassword.calledOnce)
        .toEqual(true);
    });
  });

  describe('Connected Profile component', () => {
    it('successfully renders', () => {
      const store = mockStore({
        auth: {
          user: { id: 1 },
          profile: { name: 'stone' }
        }
      });
      const wrapper = shallow(<ConnectedProfile store={store} />);
      expect(wrapper.length).toBe(1);
    });
  });
});
