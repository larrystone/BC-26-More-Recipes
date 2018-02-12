import React from 'react';
import { shallow } from 'enzyme';
import ManageRecipe from './../../../../client/src/components/commons/ManageRecipe'; //eslint-disable-line
import Loading from './../../../../client/src/components/commons/Loading'; //eslint-disable-line

let props;
let mountedComponent;

/**
 * @description Initialise the component
 *
 * @returns {object} ManageRecipe - Mounted component
 */
const getComponent = () => {
  if (!mountedComponent) {
    mountedComponent = shallow(<ManageRecipe {...props} />);
  }
  return mountedComponent;
};

describe('Component: ManageRecipe', () => {
  beforeEach(() => {
    props = {
      actions: {
        updateRecipe: () => { },
        saveRecipe: () => { },
        handleImageChange: () => { },
        storeToState: () => { },
        removeModal: () => { }
      },
      loading: false,
      modal: {
        recipeId: 2,
        type: 'create_edit_recipe'
      },
      recipe: {},
      previewImage: ''
    };
    mountedComponent = undefined;
  });

  describe('Modal', () => {
    it('set the open state of the modal to true', () => {
      const modal = getComponent().find('Modal');
      expect(modal.props().open).toBe(true);
    });
  });

  describe('Modal header', () => {
    it('show "Edit a Recipe" as header text', () => {
      props.modal.recipeId = 2;
      const modalHeader = getComponent().find('ModalHeader').first();
      expect(modalHeader.length).toEqual(1);
      expect(modalHeader.props().children).toBe('Edit  a Recipe');
    });

    it('show "Create a Recipe" as header text', () => {
      props.modal.recipeId = null;
      const modalHeader = getComponent().find('ModalHeader').first();
      expect(modalHeader.length).toEqual(1);
      expect(modalHeader.props().children).toBe('Create  a Recipe');
    });
  });

  describe('Form buttons', () => {
    it('call removeModal() when cancel clicked', () => {
      const handleRemoveModalSpy = jest.spyOn(props.actions, 'removeModal');
      getComponent().find('Button').first().simulate('click');
      expect(handleRemoveModalSpy).toHaveBeenCalledTimes(1);
    });

    it('call updateRecipe() when update clicked', () => {
      const handleUpdateRecipeSpy = jest.spyOn(props.actions, 'updateRecipe');
      getComponent().find('Button').last().simulate('click');
      expect(handleUpdateRecipeSpy).toHaveBeenCalledTimes(1);
    });

    it('call saveRecipe() when save clicked', () => {
      props.modal.recipeId = null;
      const handleSaveRecipeSpy = jest.spyOn(props.actions, 'saveRecipe');
      getComponent().find('Button').last().simulate('click');
      expect(handleSaveRecipeSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Form input components', () => {
    const event = { target: { value: 'some text' } };

    it('call storeToState() when description change', () => {
      const handleOnChangeSpy = jest.spyOn(props.actions, 'storeToState');
      getComponent().find('FormInput').last().simulate('change', event);
      expect(handleOnChangeSpy).toHaveBeenCalledTimes(1);
    });

    it('call storeToState() when Ingredients change', () => {
      const handleRemoveModalSpy = jest.spyOn(props.actions, 'storeToState');
      getComponent().find('FormTextArea').first().simulate('change', event);
      expect(handleRemoveModalSpy).toHaveBeenCalledTimes(1);
    });

    it('call storeToState() when procedure change', () => {
      const handleRemoveModalSpy = jest.spyOn(props.actions, 'storeToState');
      getComponent().find('FormTextArea').last().simulate('change', event);
      expect(handleRemoveModalSpy).toHaveBeenCalledTimes(1);
    });

    it('call storeToState() when recipe name change', () => {
      const handleRemoveModalSpy = jest.spyOn(props.actions, 'storeToState');
      getComponent().find('FormInput').at(1).simulate('change', event);
      expect(handleRemoveModalSpy).toHaveBeenCalledTimes(1);
    });

    it('call handleImageChange() when image is picked', () => {
      const handleRemoveModalSpy =
        jest.spyOn(props.actions, 'handleImageChange');
      getComponent().find('FormInput').at(0).simulate('change', event);
      expect(handleRemoveModalSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Ingredients input value', () => {
    it('should set value to "" when null value passed', () => {
      props.recipe.ingredients = null;
      const ingredients = getComponent().find('FormTextArea').first();
      expect(ingredients.props().value).toBe('');
    });

    it('should set value when valid value passed', () => {
      props.recipe.ingredients = 'test;;ttst;;sdsd';
      const ingredients = getComponent().find('FormTextArea').first();
      expect(ingredients.props().value).toBe('test,ttst,sdsd');
    });
  });

  describe('Modal Content', () => {
    beforeEach(() => {
      props.loading = true;
      props.modal.recipeName = 'Test food';
    });
    it('should show Loading when props.loading is true', () => {
      const ingredients = getComponent().find('ModalContent').first();
      expect(ingredients.props().children)
        .toEqual(<Loading text="Test food" />);
    });
  });
});
