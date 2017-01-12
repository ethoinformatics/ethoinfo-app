// -----------------------------------------------------------------------------
// PRIVATES

const defaultState = [];

// -----------------------------------------------------------------------------
// REDUCER

function all(state = defaultState, action) {
  return state;
}

// -----------------------------------------------------------------------------
// EXPORTED SELECTORS

export function getAll(state: State) : Array<number> {
  return state;
}

// -----------------------------------------------------------------------------
// EXPORTED REDUCER

export default (all: Reducer<State, Action>);
