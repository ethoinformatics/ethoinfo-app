// -----------------------------------------------------------------------------
// PRIVATES

const defaultState = {};

// -----------------------------------------------------------------------------
// REDUCER

function byId(state = defaultState, action) {
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
