export const LOAD_ALL_DOCS = 'LOAD_ALL_DOCS';
export const LOAD_ALL_DOCS_SUCCESS = 'LOAD_ALL_DOCS_SUCCESS';
export const LOAD_ALL_DOCS_ERR = 'LOAD_ALL_DOCS_ERR';
export const FETCH_ALL_DOCS = 'FETCH_ALL_DOCS';

function requestAll() {
  return { type: LOAD_ALL_DOCS };
}

function requestAllSuccess(docs) {
  return { type: LOAD_ALL_DOCS_SUCCESS, payload: docs };
}

function requestAllError(err) {
  return { type: LOAD_ALL_DOCS_ERR, payload: err };
}

export function fetchAll() {
  return (dispatch, getState, { pouchdb }) => {
    dispatch(requestAll());

    return pouchdb.allDocs({
      include_docs: true,
      attachments: true
    }).then((result) => {
      // document is row.doc
      const docs = result.rows.map(row => row.doc);
      dispatch(requestAllSuccess(docs));
    }).catch(err => dispatch(requestAllError(err)));
  };
}
