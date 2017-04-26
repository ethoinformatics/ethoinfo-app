// import { Observable } from 'rxjs';
import R from 'ramda';
import localforage from 'localforage';
import url from 'url';
import PouchDB from 'pouchdb';

import appConfig from '../../../config';
import { KEYS } from '../../../constants';

import {
  CONFIG_LOAD,
  CONFIG_SET_ITEM,
  CONFIG_UPLOAD_SYNC,
  CONFIG_DOWNLOAD_SYNC,
  CONFIG_DELETE_LOCAL_DB,
  loadConfigSuccess,
  loadConfigError,
  setItemSuccess,
  setItemError,
  uploadSyncSuccess,
  uploadSyncError,
  downloadSyncSuccess,
  downloadSyncError,
  deleteLocalDbSuccess,
  deleteLocalDbError
} from '../../actions/config';

// Pouch query API uses global namespace in a terrible way
// https://github.com/pouchdb/pouchdb/issues/4624
// We are using https://github.com/nolanlawson/pouchdb-find
// as recommended by PouchDB maintainer.
PouchDB.plugin(require('pouchdb-find'));

// ------------------------------------------------------------
// LOAD CONFIG EPIC
// Load config from localstorage
const loadConfigEpic = (action$) => {
  const load$ = action$.ofType(CONFIG_LOAD);

  return load$.switchMap(
    () =>
      localforage
        .getItem('config')
        .then(config => loadConfigSuccess(config || {}))
        .catch(err => loadConfigError(err))
  );
};

// ------------------------------------------------------------
// SET ITEM EPIC
// Store key, value in localstorage
const setItemEpic = (action$) => {
  const setItem$ = action$.ofType(CONFIG_SET_ITEM);

  return setItem$.switchMap(
    action =>
      localforage
        .getItem('config')
        .then((config) => {
          const { key, value } = action.payload;
          const newConfig = R.assoc(key, value, config);
          return localforage.setItem('config', newConfig);
        })
        .then(config => setItemSuccess(config))
        .catch(err => setItemError(err))
  );
};

// ------------------------------------------------------------
// DOWNLOAD SYNC EPIC
// Download remote couch to local pouchdb
const downloadSyncEpic = (action$, store) => {
  const download$ = action$.ofType(CONFIG_DOWNLOAD_SYNC);

  return download$.switchMap(
    () => {
      const dbName = appConfig[KEYS.pouchDbName];
      const db = new PouchDB(dbName);

      const state = store.getState();
      const config = state.config;
      const { url: baseUrl, username, password } = config;

      const urlObj = url.parse(baseUrl);
      const protocol = urlObj.protocol;
      const host = urlObj.host;
      const path = urlObj.path;
      const fullUrl = `${protocol}//${username}:${password}@${host}${path}`;

      console.log('fullUrl is', fullUrl);

      const opts = { live: false };

      return db.replicate.from(fullUrl, opts)
      .then((info) => {
        const docsWritten = info.docs_written;
        console.log(`Download success: ${docsWritten} docs written.`);
        return downloadSyncSuccess();
      })
      .catch((err) => {
        console.log(`Download error: ${err.message}`);
        return downloadSyncError(err);
      });
    }
  );
};

export default [
  downloadSyncEpic,
  loadConfigEpic,
  setItemEpic
];
