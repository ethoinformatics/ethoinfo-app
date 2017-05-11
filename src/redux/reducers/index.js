/* @flow */

import { combineReducers } from 'redux';
import config from './config';
import docs, * as FromDocuments from './documents';
import fields from './fields';
import geo from './geo';
import global from './global';
import views, * as FromViews from './views';

// -----------------------------------------------------------------------------
// REDUCER

const rootReducer = combineReducers({
  config,
  docs,
  fields,
  geo,
  global,
  views
});

// -----------------------------------------------------------------------------
// EXPORTED SELECTORS

export function getDocById(state, id) {
  return FromDocuments.getById(state.docs, id);
}

export function getDocsByDomain(state, domain) {
  return FromDocuments.getByDomain(state.docs, domain);
}

export function getAllModals(state) {
  return FromViews
    .getAllModals(state.views);
}

// -----------------------------------------------------------------------------
// REDUCER EXPORT

export default rootReducer;
