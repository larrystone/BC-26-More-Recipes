import {
  ADD_MODAL, REMOVE_MODAL
} from '../constants';

const initialState = {
  modal: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_MODAL:
      return { ...state, modal: action.modal };
    case REMOVE_MODAL:
      return { ...state, modal: {} };
    default: return state;
  }
};
