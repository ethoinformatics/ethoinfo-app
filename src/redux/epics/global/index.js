import {
  CONFIG_DOWNLOAD_SYNC_ERROR,
  CONFIG_DOWNLOAD_SYNC_SUCCESS,
  CONFIG_UPLOAD_SYNC_ERROR,
  CONFIG_UPLOAD_SYNC_SUCCESS,
  CONFIG_DELETE_LOCAL_DB_ERROR,
  CONFIG_DELETE_LOCAL_DB_SUCCESS
} from '../../actions/config';

import {
  createMessage,
} from '../../actions/global';

const downloadSyncSuccessEpic = (action$) => {
  const a$ = action$.ofType(CONFIG_DOWNLOAD_SYNC_SUCCESS);

  return a$.map((action) => {
    const info = action.payload;
    const docsWritten = info.docs_written;
    return createMessage(`Download success: ${docsWritten} docs written.`);
  });
};

const downloadSyncErrorEpic = (action$) => {
  const a$ = action$.ofType(CONFIG_DOWNLOAD_SYNC_ERROR);

  return a$.map((action) => {
    const err = action.err;
    return createMessage(`Error downloading: ${err.message}`);
  });
};

const uploadSyncSuccessEpic = (action$) => {
  const a$ = action$.ofType(CONFIG_UPLOAD_SYNC_SUCCESS);

  return a$.map((action) => {
    const info = action.payload;
    const docsWritten = info.docs_written;
    return createMessage(`Upload success: ${docsWritten} docs written.`);
  });
};

const uploadSyncErrorEpic = (action$) => {
  const a$ = action$.ofType(CONFIG_UPLOAD_SYNC_ERROR);

  return a$.map((action) => {
    const err = action.err;
    return createMessage(`Error uploading: ${err.message}`);
  });
};

const deleteSuccessEpic = (action$) => {
  const a$ = action$.ofType(CONFIG_DELETE_LOCAL_DB_SUCCESS);

  return a$.mapTo(createMessage('Local database deleted successfully.'));
};

const deleteErrorEpic = (action$) => {
  const a$ = action$.ofType(CONFIG_DELETE_LOCAL_DB_ERROR);

  return a$.map((action) => {
    const err = action.err;
    return createMessage(`Error deleting local database: ${err.message}`);
  });
};

export default [
  deleteSuccessEpic,
  deleteErrorEpic,
  downloadSyncSuccessEpic,
  downloadSyncErrorEpic,
  uploadSyncSuccessEpic,
  uploadSyncErrorEpic
];
