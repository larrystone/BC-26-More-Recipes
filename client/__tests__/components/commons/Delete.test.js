import React from 'react';
import { shallow } from 'enzyme';
import Delete from './../../../../client/src/components/commons/Delete.jsx';


let props;
let mountedComponent;

/**
 * @description Initialise the component
 *
 * @returns {object} Loading - Mounted component
 */
const getComponent = () => {
  if (!mountedComponent) {
    mountedComponent = shallow(<Delete {...props} />);
  }
  return mountedComponent;
};

describe('Component: Delete', () => {
  beforeEach(() => {
    props = {
      error: '',
      modalType: 'favorites',
      modal: { type: 'favorites', recipeName: 'jollof rice' },
      removeModal: () => { },
      removeRecipe: () => { }
    };
    mountedComponent = undefined;
  });

  describe('Modal', () => {
    it('set the open state of the modal to true', () => {
      const modal = getComponent().find('Modal');
      expect(modal.props().open).toBe(true);
    });

    it('call removeModal() method of modal', () => {
      const handleRemoveModalSpy = jest.spyOn(props, 'removeModal');
      const removeModal = getComponent().find('Modal').first();
      removeModal.simulate('close');
      expect(handleRemoveModalSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Modal header', () => {
    it('show recipe name as header text', () => {
      props.modalType = 'recipe';
      props.modal = { type: 'recipe', recipeName: 'jollof rice' };

      const wrappingDiv = getComponent().find('Header');
      expect(wrappingDiv.length).toEqual(1);
      expect(wrappingDiv.props().content).toBe(`${props.modal.recipeName}`);
    });
  });

  describe('Confirmation buttons', () => {
    it('call removeModal() when clicked', () => {
      const handleRemoveModalSpy = jest.spyOn(props, 'removeModal');
      const removeModalButton = getComponent().find('Button').first();
      removeModalButton.simulate('click');
      expect(handleRemoveModalSpy).toHaveBeenCalledTimes(1);
    });

    it('call removeRecipe() when clicked', () => {
      const handleRemoveRecipeSpy = jest.spyOn(props, 'removeRecipe');
      const removeRecipeButton = getComponent().find('Button').last();
      removeRecipeButton.simulate('click');
      expect(handleRemoveRecipeSpy).toHaveBeenCalledTimes(1);
    });
  });
});
