/* @flow */

import { combineReducers } from 'redux';
import docs, * as FromDocuments from './documents';
import views from './views';
import fields from './fields';

// -----------------------------------------------------------------------------
// REDUCER

const rootReducer = combineReducers({
  docs,
  fields,
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


// -----------------------------------------------------------------------------
// REDUCER EXPORT

export default rootReducer;
