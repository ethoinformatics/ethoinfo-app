export const CONFIG_LOAD = 'CONFIG_LOAD';
export const CONFIG_LOAD_SUCCESS = 'CONFIG_LOAD_SUCCESS';
export const CONFIG_LOAD_ERROR = 'CONFIG_LOAD_ERROR';

export const CONFIG_UPLOAD_SYNC = 'CONFIG_UPLOAD_SYNC';
export const CONFIG_UPLOAD_SYNC_SUCCESS = 'CONFIG_UPLOAD_SYNC_SUCCESS';
export const CONFIG_UPLOAD_SYNC_ERROR = 'CONFIG_UPLOAD_SYNC_ERROR';

export const CONFIG_DOWNLOAD_SYNC = 'CONFIG_DOWNLOAD_SYNC';
export const CONFIG_DOWNLOAD_SYNC_SUCCESS = 'CONFIG_DOWNLOAD_SYNC_SUCCESS';
export const CONFIG_DOWNLOAD_SYNC_ERROR = 'CONFIG_DOWNLOAD_SYNC_ERROR';

export const CONFIG_DELETE_LOCAL_DB = 'CONFIG_DELETE_LOCAL_DB';
export const CONFIG_DELETE_LOCAL_DB_SUCCESS = 'CONFIG_DELETE_LOCAL_DB_SUCCESS';
export const CONFIG_DELETE_LOCAL_DB_ERROR = 'CONFIG_DELETE_LOCAL_DB_ERROR';

export const CONFIG_SET_ITEM = 'CONFIG_SET_ITEM';
export const CONFIG_SET_ITEM_SUCCESS = 'CONFIG_SET_ITEM_SUCCESS';
export const CONFIG_SET_ITEM_ERROR = 'CONFIG_SET_ITEM_SUCCESS_ERROR';

// -----------------------------------------------------------------------------
// CONFIG LOADING
//

// Load config from local storage
export function loadConfig() {
  return { type: CONFIG_LOAD };
}

// Success loading config from local storage
export function loadConfigSuccess(payload) {
  return { type: CONFIG_LOAD_SUCCESS, payload };
}

// Error loading config from local storage
export function loadConfigError(err) {
  return { type: CONFIG_LOAD_ERROR, err };
}


// -----------------------------------------------------------------------------
// SYNCHRONIZATION
//

// Upload local database to remote
export function uploadSync() {
  return { type: CONFIG_UPLOAD_SYNC };
}

// Success uploading local database to remote
export function uploadSyncSuccess() {
  return { type: CONFIG_UPLOAD_SYNC_SUCCESS };
}

// Error uploading local database to remote
export function uploadSyncError(err) {
  return { type: CONFIG_UPLOAD_SYNC_ERROR, err };
}

// Download remote database to local
export function downloadSync() {
  return { type: CONFIG_DOWNLOAD_SYNC };
}

// Success downloading remote database to local
export function downloadSyncSuccess() {
  return { type: CONFIG_DOWNLOAD_SYNC_SUCCESS };
}

// Error downloading remote database to local
export function downloadSyncError(err) {
  return { type: CONFIG_DOWNLOAD_SYNC_ERROR, err };
}

// Delete local database
export function deleteLocalDb() {
  return { type: CONFIG_DELETE_LOCAL_DB };
}

// Success deleting local database
export function deleteLocalDbSuccess() {
  return { type: CONFIG_DELETE_LOCAL_DB_SUCCESS };
}

// Error deleting local database
export function deleteLocalDbError(err) {
  return { type: CONFIG_DELETE_LOCAL_DB_ERROR, err };
}

// -----------------------------------------------------------------------------
// CONFIG SET ITEM
//

// Set item
export function setItem(key, value) {
  return { type: CONFIG_SET_ITEM, payload: { key, value } };
}

// Set couch url success
export function setItemSuccess(key, value) {
  return { type: CONFIG_SET_ITEM_SUCCESS, payload: { key, value } };
}

// Set couch url error
export function setItemError(err) {
  return { type: CONFIG_SET_ITEM_ERROR, err };
}