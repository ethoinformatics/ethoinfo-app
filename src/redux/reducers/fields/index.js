import R from 'ramda';

import {
  FIELD_SET,
  FIELDS_RESET,
} from '../../actions/fields';

// -----------------------------------------------------------------------------
// PRIVATES

const defaultState = {
};

// -----------------------------------------------------------------------------
// REDUCER

function fields(state = defaultState, action) {
  switch (action.type) {
    case FIELD_SET:
      return R.assocPath(
        action.payload.path,
        action.payload.value,
        state
      );
    case FIELDS_RESET:
      console.log('Reset path:', action.payload.path, state);

      const newState = R.dissocPath(
        action.payload.path,
        state
      );

      console.log('Post reset:', newState);

      return newState;
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
