// import R from 'ramda';

import {
  MODAL_PUSH,
  MODAL_POP,
} from '../../../actions/modals';

// -----------------------------------------------------------------------------
// PRIVATES

const defaultState = [];

// -----------------------------------------------------------------------------
// REDUCER

function all(state = defaultState, action) {
  switch (action.type) {
    case MODAL_PUSH: {
      // Remove duplicates and push modal id to end of array
      const { id, props } = action.payload;
      console.log('MODAL_PUSH', id, props);
      return [...state.filter(_id => _id !== id), id];
    }
    case MODAL_POP: {
      // Remove modal from array
      const { id, props } = action.payload;
      console.log('MODAL_POP', id, props);
      return state.filter(_id => _id !== id);
    }
    default:
      break;
  }
  return state;
}

// -----------------------------------------------------------------------------
// EXPORTED SELECTORS

export function getAll(state) {
  return state;
}

// -----------------------------------------------------------------------------
// EXPORTED REDUCER

export default all;
