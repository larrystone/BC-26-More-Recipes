import React from 'react';
import expect from 'expect';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import ConnectedHeader, {
  Head
} from '../../../src/components/header';

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
 * @returns {object} mountedComponent - Mounted component
 */
const getComponent = () => {
  if (!mountedComponent) {
    mountedComponent = shallow(<Head {...props} />, { context });
  }
  return mountedComponent;
};

describe('Component: Header', () => {
  beforeEach(() => {
    props = {
      location: {
        search: '?page=2&limit=10'
      },
      fetchFavorites: () => Promise.resolve(),
      signOut: jest.fn(),
      loggedUser: {},
      pagination: {},
      recipes: {}
    };
    mountedComponent = undefined;
  });

  it('component successfully rendered', () => {
    const view = getComponent().find('View');
    expect(view.length).toBe(1);
  });

  it('call goToRoute()', () => {
    const route = '/';
    sinon.spy(getComponent().instance(), 'goToRoute');
    getComponent().instance().goToRoute(route);
    expect(getComponent().instance().goToRoute.calledOnce)
      .toEqual(true);
  });

  describe('ConnectedHeader', () => {
    it('component successfully rendered', () => {
      const store = mockStore({
        auth: {
          user: {
            id: 1
          }
        }
      });
      const wrapper = shallow(<ConnectedHeader store={store} />);
      expect(wrapper.length).toBe(1);
    });
  });
});
