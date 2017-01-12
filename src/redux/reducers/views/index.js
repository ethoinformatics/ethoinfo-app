/* @flow */
import { combineReducers } from 'redux';
import menu from './menu';
import history from './history';

// -----------------------------------------------------------------------------
// REDUCER

const ui = combineReducers({
  menu,
  history
});

// -----------------------------------------------------------------------------
// REDUCER EXPORT

export default ui;
