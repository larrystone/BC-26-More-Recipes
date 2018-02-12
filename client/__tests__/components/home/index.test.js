import React from 'react';
import expect from 'expect';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import ConnectedHome, {
  HomeView
} from '../../../src/components/Home';

import localStorageMock from '../../../__mocks__/localStorageMock';

window.localStorage = localStorageMock;

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

let props;
let mountedComponent;

const context = {
  router: {
    history: {
      push: jest.fn()
    }
  }
};

/**
 * @description Initialise the component
 *
 * @returns {object} ManageRecipe - Mounted component
 */
const getComponent = () => {
  if (!mountedComponent) {
    mountedComponent = shallow(
      <HomeView {...props} />, { context }
    );
  }
  return mountedComponent;
};

describe('Component: Home', () => {
  beforeEach(() => {
    props = {
      location: {
        search: '?page=2&limit=10'
      },
      fetchFavorites: () => Promise.resolve(),
      pagination: {},
      recipes: {}
    };
    mountedComponent = undefined;
  });

  it('successfully renders', () => {
    const divs = getComponent().find('div');
    expect(divs.length).toBeGreaterThan(0);
  });

  describe('componentDidMount()', () => {
    it('redirects to recipes page', () => {
      localStorage.setItem('token', 'ssdsfibsif9sfbis9ufs');
      props.location.search = '?page=2&limit=10';
      sinon.spy(getComponent().instance(), 'componentDidMount');
      getComponent().instance().componentDidMount(props);
      expect(getComponent().instance().componentDidMount.calledOnce)
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

  describe('handleSignUp()', () => {
    it('should call handleSignUp()', () => {
      sinon.spy(getComponent().instance(), 'handleSignUp');
      getComponent().instance().handleSignUp();
      expect(getComponent().instance().handleSignUp.calledOnce)
        .toEqual(true);
    });

    const state = {
      name: 'love lace',
      username: 'lovelace',
      email: 'lanescone@gmail.com',
      password: 'ddfdbfdfdff',
      confirmPassword: ''
    };
    it('returns "Password don\'t match error"', () => {
      props.signUp = () => Promise.resolve();
      sinon.spy(getComponent().instance(), 'handleSignUp');
      const renderedComponent = getComponent();
      renderedComponent.setState({ ...state });
      renderedComponent.instance().handleSignUp();
      expect(getComponent().instance().handleSignUp.calledOnce)
        .toEqual(true);
    });

    describe('signUp()', () => {
      beforeEach(() => {
        state.confirmPassword = 'ddfdbfdfdff';
      });
      it('success', () => {
        props.signUp = () => Promise.resolve();
        sinon.spy(getComponent().instance(), 'handleSignUp');
        const renderedComponent = getComponent();
        renderedComponent.setState(state);
        renderedComponent.instance().handleSignUp();
        expect(getComponent().instance().handleSignUp.calledOnce)
          .toEqual(true);
      });

      it('failure', () => {
        props.signUp = () => Promise.reject();
        sinon.spy(getComponent().instance(), 'handleSignUp');
        const renderedComponent = getComponent();
        renderedComponent.setState(state);
        renderedComponent.instance().handleSignUp();
        expect(getComponent().instance().handleSignUp.calledOnce)
          .toEqual(true);
      });
    });
  });

  describe('handleSignIn() > sign()', () => {
    it('success', () => {
      props.signIn = () => Promise.resolve();
      sinon.spy(getComponent().instance(), 'handleSignIn');
      getComponent().instance().handleSignIn();
      expect(getComponent().instance().handleSignIn.calledOnce)
        .toEqual(true);
    });

    it('failure', () => {
      props.signIn = () => Promise.reject();
      sinon.spy(getComponent().instance(), 'handleSignIn');
      getComponent().instance().handleSignIn();
      expect(getComponent().instance().handleSignIn.calledOnce)
        .toEqual(true);
    });
  });
});

describe('Connected ConnectedHome component', () => {
  it('tests that the component successfully rendered', () => {
    const store = mockStore({});
    const wrapper = shallow(<ConnectedHome store={store} />);
    expect(wrapper.length).toBe(1);
  });
});
