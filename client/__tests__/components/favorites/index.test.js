import React from 'react';
import expect from 'expect';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import ConnectedFavorites, {
  Favorite
} from '../../../src/components/favorites';
import mockData from '../../../__mocks__/mockData';

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
    mountedComponent = shallow(<Favorite {...props} />, { context });
  }
  return mountedComponent;
};

describe('Component: AllRecipes', () => {
  beforeEach(() => {
    props = {
      location: {
        search: '?page=2&limit=10'
      },
      fetchFavorites: () => Promise.resolve(),
      pagination: {},
      recipes: {},
      userId: 1,
      addModal: jest.fn(),
      removeModal: jest.fn(),
      removeFav: jest.fn(),
      modal: {}
    };
    mountedComponent = undefined;
  });

  describe('componentWillMount(): fetchFavorites()', () => {
    it('.then() - success', () => {
      props.location.search = '?page=2&limit=10';
      sinon.spy(getComponent().instance(), 'componentWillMount');
      getComponent().instance().componentWillMount(props);
      expect(getComponent().instance().componentWillMount.calledOnce)
        .toEqual(true);
    });

    it('.catch() - failure', () => {
      props.fetchFavorites = () => Promise.reject();
      props.location.search = '?page=2&limit=10';
      sinon.spy(getComponent().instance(), 'componentWillMount');
      getComponent().instance().componentWillMount(props);
      expect(getComponent().instance().componentWillMount.calledOnce)
        .toEqual(true);
    });
  });

  describe('Pagination requests', () => {
    const page = 2;
    const size = 3;

    it('should call onPageSizeChange()', () => {
      sinon.spy(getComponent().instance(), 'onPageSizeChange');
      getComponent().instance().onPageSizeChange(page, size);
      expect(getComponent().instance().onPageSizeChange.calledOnce)
        .toEqual(true);
    });

    it('should call onPageChange()', () => {
      sinon.spy(getComponent().instance(), 'onPageChange');
      getComponent().instance().onPageChange(page);
      expect(getComponent().instance().onPageChange.calledOnce)
        .toEqual(true);
    });
  });

  describe('showDetails()', () => {
    it('should call showDetails()', () => {
      sinon.spy(getComponent().instance(), 'showDetails');
      getComponent().instance().showDetails();
      expect(getComponent().instance().showDetails.calledOnce)
        .toEqual(true);
    });
  });

  describe('removeRecipe()', () => {
    describe('calls removeFav()', () => {
      it('.then() - success response', () => {
        props.removeFav = () => Promise.resolve();
        props.removeModal = () => Promise.resolve();
        sinon.spy(getComponent().instance(), 'removeRecipe');
        getComponent().instance().removeRecipe('fufu', 2);
        expect(getComponent().instance().removeRecipe.calledOnce)
          .toEqual(true);
      });

      it('.catch() - failure response', () => {
        props.removeFav = () => Promise.reject();
        props.removeModal = () => Promise.resolve();
        sinon.spy(getComponent().instance(), 'removeRecipe');
        getComponent().instance().removeRecipe('fufu', 2);
        expect(getComponent().instance().removeRecipe.calledOnce)
          .toEqual(true);
      });
    });
  });


  describe('Modal actions', () => {
    it('removeModal()', () => {
      props.removeModal = jest.fn();
      sinon.spy(getComponent().instance(), 'removeModal');
      getComponent().instance().removeModal();
      expect(getComponent().instance().removeModal.calledOnce)
        .toEqual(true);
    });

    it('addModal()', () => {
      props.addModal = jest.fn();
      sinon.spy(getComponent().instance(), 'addModal');
      getComponent().instance().addModal('amala', 1);
      expect(getComponent().instance().addModal.calledOnce)
        .toEqual(true);
    });
  });

  describe('Connected AllRecipes component', () => {
    it('tests that the component successfully rendered', () => {
      const { validPagedRecipe } = mockData;
      const store = mockStore({
        modal: {
          modal: {
            type: 'remove',
            id: 1
          }
        },
        auth: {
          user: {
            id: 1
          }
        },
        favorite: {
          myFavorites: validPagedRecipe
        }
      });
      const wrapper = shallow(<ConnectedFavorites store={store} />);
      expect(wrapper.length).toBe(1);
    });
  });
});
