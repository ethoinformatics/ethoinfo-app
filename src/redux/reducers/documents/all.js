import { DOCS_LOAD_ALL_SUCCESS } from '../../actions/documents';

// -----------------------------------------------------------------------------
// PRIVATES

const defaultState = [];

// -----------------------------------------------------------------------------
// REDUCER

function all(state = defaultState, action) {
  switch (action.type) {
    case DOCS_LOAD_ALL_SUCCESS:
      return action.payload.map(doc => doc._id);
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
