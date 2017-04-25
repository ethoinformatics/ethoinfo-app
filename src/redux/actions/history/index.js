import R from 'ramda';
import { pop as popModal } from '../../actions/modals';
import { getAllModals } from '../../reducers';
import history from '../../../history';

import routes from '../../../routes';
import router from '../../../router';

export const UPDATE_HISTORY = 'HISTORY_UPDATE';
export const SLICE_HISTORY = 'HISTORY_SLICE';

// PRIVATE ACTION CREATORS

function sliceHistory(path) {
  return { type: SLICE_HISTORY, payload: path };
}

// EXPORTED ACTION CREATORS

export function updateHistory(location) {
  return { type: UPDATE_HISTORY, payload: location };
}


export function slice(path) {
  return (dispatch, getState) => {
    const state = getState();
    const modals = getAllModals(state);

    // const filterEmpty = n => n !== ''; // Todo: better comparison
    // const stringify = R.pipe(R.flatten, R.filter(filterEmpty), R.join('/'));
    const stringify = R.pipe(R.flatten, R.join('/'));
    // const stringifiedPath = `/${stringify(path)}`;

    // Modals don't have a leading slash
    const stringifiedPath = stringify(path);

    // Strip duplicate slashes and final slash
    const cleanPath = `/${stringifiedPath}`.replace(/\/\//g, '/').replace(/\/$/, '');

    console.log('Path to go to:', cleanPath);

    const regEx = new RegExp(`^(${cleanPath}){1}.+`);

    // Pop all modals further down path
    const poppers = modals.filter(m => m.id.match(regEx));
    poppers.forEach(popper => dispatch(popModal(popper.id)));
    dispatch(sliceHistory(cleanPath));

    // And navigate if path matches one of our routes
    const view = router.resolve(routes, cleanPath);

    if (view) {
      history.push(cleanPath, {});
    }
  };
}
