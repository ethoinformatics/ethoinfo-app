import R from 'ramda';
import {
  DOCS_LOAD_ALL_SUCCESS,
  DOC_UPDATE_SUCCESS,
  BULK_DOC_UPDATE_SUCCESS,
} from '../../actions/documents';

// -----------------------------------------------------------------------------
// PRIVATES
const defaultState = {};

// -----------------------------------------------------------------------------
// REDUCER
function byId(state = defaultState, action) {
  switch (action.type) {
    /* case DOC_UPDATE_SUCCESS:
      console.log('>>>> update:', action.payload);
      return state; */
    case BULK_DOC_UPDATE_SUCCESS: {
      console.log('>>> Bulk update success:', action.payload);
      const updatedDocs = action.payload
        .reduce((acc, val) => R.assoc(val._id, val, acc), {});
      const newState = R.merge(state, updatedDocs);
      console.log('>>> New state:', newState);
      return newState;
    }

    case DOCS_LOAD_ALL_SUCCESS:
      // Reduce array to a "data table"
      // with the IDs of the docs as keys and the docs themselves as the values.
      return action.payload
        .reduce((acc, val) => R.assoc(val._id, val, acc), {});
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
