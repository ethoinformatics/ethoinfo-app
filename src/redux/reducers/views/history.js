import { UPDATE_HISTORY } from '../../actions/history';

// -----------------------------------------------------------------------------
// PRIVATES

const defaultState = {
  path: '/',
};

// -----------------------------------------------------------------------------
// REDUCER

function history(state = defaultState, action) {
  switch (action.type) {
    case UPDATE_HISTORY:
      return {
        ...state,
        path: action.payload.pathname
      };
    default:
      break;
  }

  return state;
}

// -----------------------------------------------------------------------------
// EXPORTED REDUCER

export default history;
