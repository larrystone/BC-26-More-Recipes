import expect from 'expect';
import Modal from '../../src/reducers/modal';
import mockData from '../../__mocks__/mockData';

describe('Modal Reducer', () => {
  const { modal } = mockData;
  describe('ADD_MODAL', () => {
    it('set modal with provided data', () => {
      const initialState = {
        modal: {}
      };
      const action = {
        type: 'ADD_MODAL',
        modal
      };
      const newState = Modal(initialState, action);
      expect(newState.modal).toEqual(modal);
    });
  });

  describe('REMOVE_MODAL', () => {
    it('set modal to empty object', () => {
      const initialState = {
        modal
      };

      const action = {
        type: 'REMOVE_MODAL'
      };
      const newState = Modal(initialState, action);
      expect(newState.modal).toEqual({});
    });
  });

  describe('Edge cases', () => {
    it('return initial state when invalid action type is provided',
      () => {
        const initialState = {
          modal
        };
        const action = {
          type: 'MODAL_TEST'
        };
        const newState = Modal(initialState, action);
        expect(newState.modal).toEqual(initialState.modal);
      });

    it('set and return initial state when no state data is passed',
      () => {
        const action = {
          type: 'REMOVE_MODAL'
        };
        const newState = Modal(undefined, action);
        expect(newState).toEqual({ modal: {} });
      });
  });
});
