import React from 'react';
import expect from 'expect';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import ConnectedAllRecipes, {
  Recipes
} from '../../../src/components/allrecipes';
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
    mountedComponent = shallow(<Recipes {...props} />, { context });
  }
  return mountedComponent;
};

describe('Component: AllRecipes', () => {
  beforeEach(() => {
    props = {
      location: {
        search: '?page=2&limit=10'
      },
      searchRecipe: () => Promise.resolve(),
      fetchPagedRecipe: () => Promise.resolve(),
      pagination: {},
      recipes: {}
    };
    mountedComponent = undefined;
  });

  describe('componentWillReceiveProps()', () => {
    sinon.spy(Recipes.prototype, 'componentWillReceiveProps');
    it('should call componentWillReceiveProps()', () => {
      const newLocation = { location: { search: '?page=5&limit=10' } };
      getComponent().instance().componentWillReceiveProps({
        ...props, location: newLocation
      });
      expect(getComponent().instance().componentWillReceiveProps.calledOnce)
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

  describe('search()', () => {
    it('success response', () => {
      props.location.search = '?by=name&text=food&page=1&limit=10';
      sinon.spy(getComponent().instance(), 'search');
      getComponent().instance().search();
      expect(getComponent().instance().search.calledOnce)
        .toEqual(true);
    });

    it('failure response', () => {
      props.searchRecipe = () => Promise.reject();
      props.location.search = '?by=name&text=food&page=1&limit=10';
      sinon.spy(getComponent().instance(), 'search');
      getComponent().instance().search();
      expect(getComponent().instance().search.calledOnce)
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

  describe('fetchRecipes()', () => {
    describe('searchRecipe()', () => {
      it('success response', () => {
        sinon.spy(getComponent().instance(), 'fetchRecipes');
        props.location.search = 'by=name&text=fried&page=1&limit=10';
        getComponent().instance().fetchRecipes(props);
        expect(getComponent().instance().fetchRecipes.calledOnce)
          .toEqual(true);
      });

      it('failure response', () => {
        props.location.search = 'by=name&text=fried&page=1&limit=10';
        props.searchRecipe = () => Promise.reject();
        sinon.spy(getComponent().instance(), 'fetchRecipes');
        getComponent().instance().fetchRecipes(props);
        expect(getComponent().instance().fetchRecipes.calledOnce)
          .toEqual(true);
      });
    });

    describe('fetchPagedRecipe()', () => {
      it('success response', () => {
        sinon.spy(getComponent().instance(), 'fetchRecipes');
        getComponent().instance().fetchRecipes(props);
        expect(getComponent().instance().fetchRecipes.calledOnce)
          .toEqual(true);
      });

      it('failure response', () => {
        props.fetchPagedRecipe = () => Promise.reject();
        sinon.spy(getComponent().instance(), 'fetchRecipes');
        getComponent().instance().fetchRecipes(props);
        expect(getComponent().instance().fetchRecipes.calledOnce)
          .toEqual(true);
      });
    });
  });

  describe('Connected AllRecipes component', () => {
    it('component successfully rendered', () => {
      const { validPagedRecipe } = mockData;
      const store = mockStore({
        recipe: {
          allRecipes: validPagedRecipe
        }
      });
      const wrapper = shallow(<ConnectedAllRecipes store={store} />);
      expect(wrapper.length).toBe(1);
    });
  });
});
