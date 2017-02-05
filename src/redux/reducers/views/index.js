import { combineReducers } from 'redux';
import history from './history';
import menu from './menu';
import modals, * as FromByModals from './modals';

// -----------------------------------------------------------------------------
// REDUCER

const views = combineReducers({
  menu,
  modals,
  history
});



// -----------------------------------------------------------------------------
// EXPORTED SELECTORS

export function getAllModals(state) {
  return FromByModals
    .getAll(state.modals);
}

// -----------------------------------------------------------------------------
// REDUCER EXPORT

export default views;
