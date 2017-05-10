// import R from 'ramda';

import {
  CONFIG_LOAD_SUCCESS,
  CONFIG_SET_ITEM_SUCCESS,
} from '../../actions/config';

// -----------------------------------------------------------------------------
// PRIVATES

const defaultState = {
};

// -----------------------------------------------------------------------------
// REDUCER

function config(state = defaultState, action) {
  switch (action.type) {
    case CONFIG_LOAD_SUCCESS:
      return action.payload;
    case CONFIG_SET_ITEM_SUCCESS:
      return action.payload;
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

export default config;
