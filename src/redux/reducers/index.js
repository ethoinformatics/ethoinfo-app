/* @flow */

import { combineReducers } from 'redux';
import docs, * as FromDocuments from './documents';
import views from './views';

// -----------------------------------------------------------------------------
// REDUCER

const rootReducer = combineReducers({
  docs,
  views
});

// -----------------------------------------------------------------------------
// EXPORTED SELECTORS

export function getDocumentById(state, id) {
  return FromDocuments.getById(state.documents, id);
}

// -----------------------------------------------------------------------------
// REDUCER EXPORT

export default rootReducer;
