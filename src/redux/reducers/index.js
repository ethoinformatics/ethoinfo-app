/* @flow */

import { combineReducers } from 'redux';
import docs, * as FromDocuments from './documents';
import views, * as FromViews from './views';
import fields from './fields';
import geo from './geo';

// -----------------------------------------------------------------------------
// REDUCER

const rootReducer = combineReducers({
  docs,
  fields,
  geo,
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
