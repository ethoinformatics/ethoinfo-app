import uuid from 'uuid';

export const DOCS_LOAD_ALL = 'DOCS_LOAD_ALL';
export const DOCS_LOAD_ALL_SUCCESS = 'DOCS_LOAD_ALL_SUCCESS';
export const DOCS_LOAD_ALL_ERROR = 'DOCS_LOAD_ALL_ERROR';

export const DOC_CREATE = 'DOC_CREATE';
export const DOC_CREATE_SUCCESS = 'DOC_CREATE_SUCCESS';
export const DOC_CREATE_ERROR = 'DOC_CREATE_ERROR';

// -----------------------------------------------------------------------------
// PRIVATES

function requestAll() {
  return { type: DOCS_LOAD_ALL };
}

function requestAllSuccess(docs) {
  return { type: DOCS_LOAD_ALL_SUCCESS, payload: docs };
}

function requestAllError(err) {
  return { type: DOCS_LOAD_ALL_ERROR, payload: err };
}

function createDoc() {
  return { type: DOC_CREATE };
}

function createDocSuccess(doc) {
  return { type: DOC_CREATE_SUCCESS, payload: doc };
}

function createDocError(err) {
  return { type: DOC_CREATE_ERROR, payload: err };
}

// -----------------------------------------------------------------------------
// EXPORTED ACTIONS

// Fetch all documents from pouchdb. 
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

// Save a new document to pouchdb.
export function create(doc, schema) {
  return (dispatch, getState, { pouchdb }) => {
    dispatch(createDoc());

    const newDoc = {
      _id: uuid(),
      domainName: schema.name,
      ...doc
    };

    console.log('Creating doc:', newDoc);

    return pouchdb.put(doc)
      .then((res) => {
        console.log(res);
        dispatch(createDocSuccess(res));
      }).catch((err) => {
        dispatch(createDocError(err));
      });
  };
}
