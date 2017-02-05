import R from 'ramda';

// -----------------------------------------------------------------------------
// IMPORTED ACTIONS

import {
  MODAL_PUSH,
  MODAL_POP,
} from '../../../actions/modals';

// -----------------------------------------------------------------------------
// PRIVATES

const defaultState = {};

// -----------------------------------------------------------------------------
// REDUCER

function byId(state = defaultState, action) {
  switch (action.type) {
    case MODAL_PUSH: {
      const { id, props } = action.payload;
      return R.assoc(id, { props, id }, state);
    }

    case MODAL_POP: {
      const { id } = action.payload;
      return R.dissoc(id, state);
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
