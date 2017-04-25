import { combineReducers } from 'redux';
import history from './history';
import menu from './menu';
import modals, * as FromByModals from './modals';

import routes from '../../../routes';
import router from '../../../router';

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

export function getCurrentView(state) {
  const view = router.resolve(routes, state.history.path);

  return view || {
    name: 'notFound',
    title: 'Not Found',
    params: null
  };
}

// -----------------------------------------------------------------------------
// REDUCER EXPORT

export default views;
