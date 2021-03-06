import { Observable } from 'rxjs';
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

import {
  beginTransaction,
  endTransaction,
} from '../../actions/global';

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

  return download$
    .filter(() => store.getState().global.transactionInProgress === false)
    .switchMap(
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

      const opts = { live: false };

      /* return db.replicate.from(fullUrl, opts)
      .then((info) => {
        const docsWritten = info.docs_written;
        console.log(`Download success: ${docsWritten} docs written.`);
        return downloadSyncSuccess();
      })
      .catch((err) => {
        console.log(`Download error: ${err.message}`);
        return downloadSyncError(err);
      }); */

      const replicateDown = () =>
        db.replicate.from(fullUrl, opts)
        .then(info => downloadSyncSuccess(info))
        .catch(err => downloadSyncError(err));

      return Observable.concat(
        Observable.of(beginTransaction()),
        replicateDown(),
        Observable.of(endTransaction())
      );
    }
  );
};

// ------------------------------------------------------------
// UPLOAD SYNC EPIC
// Upload local pouchdb to remote couch
const uploadSyncEpic = (action$, store) => {
  const upload$ = action$.ofType(CONFIG_UPLOAD_SYNC);

  return upload$
    .filter(() => store.getState().global.transactionInProgress === false)
    .switchMap(
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

      const opts = { live: false };

      const replicateUp = () =>
        db.replicate.to(fullUrl, opts)
        .then((info) => {
          const docsWritten = info.docs_written;
          console.log(`Upload success: ${docsWritten} docs written.`);
          return uploadSyncSuccess(info);
        })
        .catch((err) => {
          console.log(`Upload error: ${err.message}`);
          return uploadSyncError(err);
        });

      return Observable.concat(
        Observable.of(beginTransaction()),
        replicateUp(),
        Observable.of(endTransaction())
      );
    }
  );
};

// ------------------------------------------------------------
// DELETE LOCAL DATABASE EPIC
// Delete local pouchdb
// Calling it destroy here since delete is a reserved word in JS
const destroyEpic = (action$, store) => {
  const destroy$ = action$.ofType(CONFIG_DELETE_LOCAL_DB);

  return destroy$
    .filter(() => store.getState().global.transactionInProgress === false)
    .switchMap(
    () => {
      const destroy = () => {
        const dbName = appConfig[KEYS.pouchDbName];
        const db = new PouchDB(dbName);

        return db.destroy()
        .then(() => deleteLocalDbSuccess())
        .catch(err => deleteLocalDbError(err));
      };

      return Observable.concat(
        Observable.of(beginTransaction()),
        destroy(),
        Observable.of(endTransaction())
      );
    }
  );
};

export default [
  destroyEpic,
  downloadSyncEpic,
  loadConfigEpic,
  setItemEpic,
  uploadSyncEpic
];
