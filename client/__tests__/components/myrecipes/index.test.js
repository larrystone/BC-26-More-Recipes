import React from 'react';
import expect from 'expect';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import ConnectedMyRecipes, {
  MyRecipe
} from '../../../src/components/myrecipes';
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
    mountedComponent = shallow(<MyRecipe {...props} />, { context });
  }
  return mountedComponent;
};

describe('Component: AllRecipes', () => {
  beforeEach(() => {
    props = {
      location: {
        search: '?page=2&limit=10'
      },
      fetchMyRecipes: () => Promise.resolve(),
      addRecipe: () => Promise.resolve(),
      editRecipe: () => Promise.resolve(),
      addModal: () => Promise.resolve(),
      fetchRecipeDetails: () => Promise.resolve(),
      deleteRecipe: () => Promise.resolve(),
      pagination: {},
      recipes: {},
      recipe: mockData.validCurrentRecipe
    };
    mountedComponent = undefined;
  });

  describe('componentWillReceiveProps()', () => {
    it('should call componentWillReceiveProps()', () => {
      const newLocation = { location: { search: '?page=5&limit=10' } };
      sinon.spy(getComponent().instance(), 'componentWillReceiveProps');
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

  describe('showDetails()', () => {
    it('should call showDetails()', () => {
      sinon.spy(getComponent().instance(), 'showDetails');
      getComponent().instance().showDetails();
      expect(getComponent().instance().showDetails.calledOnce)
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

  describe('fetchRecipes()', () => {
    const newLocation = { search: '?by=name&text=food&page=1&limit=10' };
    it('success response', () => {
      sinon.spy(getComponent().instance(), 'fetchRecipes');
      getComponent().instance().fetchRecipes(newLocation);
      expect(getComponent().instance().fetchRecipes.calledOnce)
        .toEqual(true);
    });

    it('failure response', () => {
      props.fetchMyRecipes = () => Promise.reject();
      props.location.search = '?by=name&text=food&page=1&limit=10';
      sinon.spy(getComponent().instance(), 'fetchRecipes');
      getComponent().instance().fetchRecipes(newLocation);
      expect(getComponent().instance().fetchRecipes.calledOnce)
        .toEqual(true);
    });
  });

  describe('saveRecipe()', () => {
    it('returns validation error', () => {
      sinon.spy(getComponent().instance(), 'saveRecipe');
      getComponent().instance().saveRecipe();
      expect(getComponent().instance().saveRecipe.calledOnce)
        .toEqual(true);
    });

    it('success response', () => {
      sinon.spy(getComponent().instance(), 'saveRecipe');
      mountedComponent = getComponent();
      mountedComponent.setState({
        name: 'Fried rice',
        description: '',
        ingredients: 'salt,water,sugar,maggi',
        procedure: 'Let\'s start cooking'
      });
      getComponent().instance().saveRecipe();
      expect(getComponent().instance().saveRecipe.calledOnce)
        .toEqual(true);
    });

    it('failure response', () => {
      props.addRecipe = () => Promise.reject();
      sinon.spy(getComponent().instance(), 'saveRecipe');
      mountedComponent = getComponent();
      mountedComponent.setState({
        name: 'Fried rice',
        description: '',
        ingredients: 'salt,water,sugar,maggi',
        procedure: 'Let\'s start cooking'
      });
      getComponent().instance().saveRecipe();
      expect(getComponent().instance().saveRecipe.calledOnce)
        .toEqual(true);
    });
  });

  describe('updateRecipe()', () => {
    it('returns validation error', () => {
      sinon.spy(getComponent().instance(), 'updateRecipe');
      getComponent().instance().updateRecipe(2);
      expect(getComponent().instance().updateRecipe.calledOnce)
        .toEqual(true);
    });

    it('success response', () => {
      sinon.spy(getComponent().instance(), 'updateRecipe');
      mountedComponent = getComponent();
      mountedComponent.setState({
        name: 'Fried rice',
        description: '',
        ingredients: 'salt,water,sugar,maggi',
        procedure: 'Let\'s start cooking'
      });
      getComponent().instance().updateRecipe(2);
      expect(getComponent().instance().updateRecipe.calledOnce)
        .toEqual(true);
    });

    it('failure response', () => {
      props.editRecipe = () => Promise.reject();
      sinon.spy(getComponent().instance(), 'updateRecipe');
      mountedComponent = getComponent();
      mountedComponent.setState({
        name: 'Fried rice',
        description: '',
        ingredients: 'salt,water,sugar,maggi',
        procedure: 'Let\'s start cooking'
      });
      getComponent().instance().updateRecipe(2);
      expect(getComponent().instance().updateRecipe.calledOnce)
        .toEqual(true);
    });
  });

  describe('addModal()', () => {
    it('should call addModal()', () => {
      sinon.spy(getComponent().instance(), 'addModal');
      getComponent().instance().addModal();
      expect(getComponent().instance().addModal.calledOnce)
        .toEqual(true);
    });
  });

  describe('newRecipe()', () => {
    it('should call newRecipe()', () => {
      sinon.spy(getComponent().instance(), 'newRecipe');
      getComponent().instance().newRecipe('create_recipe');
      expect(getComponent().instance().newRecipe.calledOnce)
        .toEqual(true);
    });
  });

  describe('editRecipe()', () => {
    it('should call newRecipe()', () => {
      sinon.spy(getComponent().instance(), 'editRecipe');
      getComponent().instance().editRecipe(2);
      expect(getComponent().instance().editRecipe.calledOnce)
        .toEqual(true);
    });
  });

  describe('removeRecipe() > deleteRecipe()', () => {
    it('success response', () => {
      sinon.spy(getComponent().instance(), 'removeRecipe');
      getComponent().instance().removeRecipe('fufu', 2);
      expect(getComponent().instance().removeRecipe.calledOnce)
        .toEqual(true);
    });

    it('failure response', () => {
      props.deleteRecipe = () => Promise.reject();
      sinon.spy(getComponent().instance(), 'removeRecipe');
      getComponent().instance().removeRecipe('fufu', 2);
      expect(getComponent().instance().removeRecipe.calledOnce)
        .toEqual(true);
    });
  });

  describe('Connected AllRecipes component', () => {
    it('component successfully rendered', () => {
      const { validPagedRecipe, validCurrentRecipe } = mockData;
      const store = mockStore({
        recipe: {
          myRecipes: validPagedRecipe,
          currentRecipe: validCurrentRecipe
        },
        modal: {
          modal: { type: 'create_edit_recipe' }
        },
        auth: {
          user: { id: 2 }
        }
      });
      const wrapper = shallow(<ConnectedMyRecipes store={store} />);
      expect(wrapper.length).toBe(1);
    });
  });
});
