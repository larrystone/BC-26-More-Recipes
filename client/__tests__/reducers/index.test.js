import { createStore } from 'redux';
import combinedReducer from '../../src/reducers';

const store = createStore(combinedReducer);

describe('combinedReducer', () => {
  it('return auth state value', () => {
    expect(store.getState().auth).toEqual({user: {}, profile: {}});
  });

  it('dispatch simple modal action', () => {
    const action = { type: 'REMOVE_MODAL' };
    store.dispatch(action);
    expect(store.getState().modal).toEqual({ modal: {} });
  });
});
