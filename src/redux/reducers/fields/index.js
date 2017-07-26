import R from 'ramda';

import {
  FIELD_SET,
  FIELDS_RESET,
} from '../../actions/fields';

import {
  BULK_DOC_UPDATE_SUCCESS,
} from '../../actions/documents';

// -----------------------------------------------------------------------------
// PRIVATES

const defaultState = {
};

// -----------------------------------------------------------------------------
// REDUCER

function fields(state = defaultState, action) {
  switch (action.type) {
    case BULK_DOC_UPDATE_SUCCESS: {
      const updated = action.payload.map(o => o._id);
      return R.omit(updated, state);
    }
    case FIELD_SET: {
      // console.log(action.payload.path, action.payload.value, state);
      return R.assocPath(
        action.payload.path,
        action.payload.value,
        state || {}
      );
    }
    case FIELDS_RESET: {
      const newState = R.dissocPath(
        action.payload.path,
        state || {}
      );

      return newState;
    }

    default:
      break;
  }

  return state;
}

// -----------------------------------------------------------------------------
// EXPORTED SELECTORS

export function getByPath(state, path) {
  return R.path(path, state);
}

// -----------------------------------------------------------------------------
// EXPORTED REDUCER

export default fields;
