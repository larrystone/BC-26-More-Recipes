import expect from 'expect';
import {
  addModal,
  removeModal
} from '../../src/actions/modalActions';
import { ADD_MODAL, REMOVE_MODAL } from '../../src/constants';

describe('Modal actions', () => {
  const modal = { type: 'create_edit_recipe' };
  it('add modal', (done) => {
    const expectedActions = {
      type: ADD_MODAL,
      modal
    };
    expect(addModal(modal)).toEqual(expectedActions);
    done();
  });

  it('remove modal', (done) => {
    const expectedActions = {
      type: REMOVE_MODAL
    };
    expect(removeModal()).toEqual(expectedActions);
    done();
  });
});

