import R from 'ramda';
import { pop as popModal } from '../../actions/modals';
import { getAllModals } from '../../reducers';
import history from '../../../history';

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

    const regEx = new RegExp(`^(${stringifiedPath}){1}.+`);

    // Pop all modals further down path
    const poppers = modals.filter(m => m.id.match(regEx));
    poppers.forEach(popper => dispatch(popModal(popper.id)));
    dispatch(sliceHistory(stringifiedPath));

    // And navigate if path matches
    // Strip duplicate slashes and final slash
    const cleanPath = `/${stringifiedPath}`.replace(/\/\//g, '/').replace(/\/$/, '');
    console.log(cleanPath);
    history.push(cleanPath, {});
  };
}
