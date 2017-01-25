import R from 'ramda';

import {
  SET_FIELD,
  RESET_FIELDS,
} from '../../actions/fields';

// -----------------------------------------------------------------------------
// PRIVATES

const defaultState = {
};

// -----------------------------------------------------------------------------
// REDUCER

function fields(state = defaultState, action) {
  switch (action.type) {
    case SET_FIELD:
      console.log(action.payload);
      return R.assocPath(
        action.payload.path,
        action.payload.value,
        state
      );
    case RESET_FIELDS:
      return R.dissocPath(
        action.payload.path,
        state
      );
    default:
      break;
  }

  return state;
}

// -----------------------------------------------------------------------------
// EXPORTED SELECTORS

export function getByPath(state, path) {
  console.log('Get by path:', state, path);
  console.log(R.path(path, state));
  return R.path(path, state);
}

// -----------------------------------------------------------------------------
// EXPORTED REDUCER

export default fields;
