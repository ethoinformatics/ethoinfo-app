import R from 'ramda';

import {
  GEOLOCATION_LOAD_CACHE_SUCCESS,
} from '../../actions/geo';

// -----------------------------------------------------------------------------
// PRIVATES

const defaultState = {
  entries: []
};

// -----------------------------------------------------------------------------
// REDUCER

function all(state = defaultState, action) {
  switch (action.type) {
    case GEOLOCATION_LOAD_CACHE_SUCCESS:
      return R.assoc('entries', action.payload, state);
    default:
      break;
  }
  return state;
}

// -----------------------------------------------------------------------------
// EXPORTED SELECTORS

// Todo . . .

// -----------------------------------------------------------------------------
// EXPORTED REDUCER

export default all;
