import R from 'ramda';

import {
  DOCS_LOAD_ALL_SUCCESS,
  DOC_UPDATE_SUCCESS,
} from '../../actions/documents';

// -----------------------------------------------------------------------------
// PRIVATES

const defaultState = {};

// -----------------------------------------------------------------------------
// REDUCER

function byId(state = defaultState, action) {
  switch (action.type) {
    case DOCS_LOAD_ALL_SUCCESS:
      // Reduce array to a "data table"
      // with the IDs of the docs as keys and the docs themselves as the values.
      return action.payload
        .reduce((acc, val) => R.assoc(val._id, val, acc), {});

    case DOC_UPDATE_SUCCESS: {
      // Update doc
      const doc = action.payload;
      return R.assoc(doc._id, doc, state);
    }

    default:
      break;
  }
  return state;
}

// -----------------------------------------------------------------------------
// EXPORTED SELECTORS

export function getById(state, id) {
  return state[id];
}

// -----------------------------------------------------------------------------
// EXPORTED REDUCER

export default byId;
