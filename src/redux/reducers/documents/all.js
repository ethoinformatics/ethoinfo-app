// import R from 'ramda';

import {
  DOCS_LOAD_ALL_SUCCESS,
  DOC_DELETE_SUCCESS,
  DOC_DELETE_ERROR
} from '../../actions/documents';

// -----------------------------------------------------------------------------
// PRIVATES

const defaultState = [];

// -----------------------------------------------------------------------------
// REDUCER

function all(state = defaultState, action) {
  switch (action.type) {
    case DOCS_LOAD_ALL_SUCCESS:
      // Map array of docs to an arra of doc ids
      return action.payload.map(doc => doc._id);
    case DOC_DELETE_SUCCESS:
      // Remove id from array of doc ids
      return state.filter(id => id !== action.payload.id);
    case DOC_DELETE_ERROR:
      break;
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
