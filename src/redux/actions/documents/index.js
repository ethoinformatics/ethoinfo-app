import uuid from 'uuid';
import R from 'ramda';

export const DOCS_LOAD_ALL = 'DOCS_LOAD_ALL';
export const DOCS_LOAD_ALL_SUCCESS = 'DOCS_LOAD_ALL_SUCCESS';
export const DOCS_LOAD_ALL_ERROR = 'DOCS_LOAD_ALL_ERROR';

export const DOC_CREATE = 'DOC_CREATE';
export const DOC_CREATE_SUCCESS = 'DOC_CREATE_SUCCESS';
export const DOC_CREATE_ERROR = 'DOC_CREATE_ERROR';

export const DOC_UPDATE = 'DOC_UPDATE';
export const DOC_UPDATE_SUCCESS = 'DOC_UPDATE_SUCCESS';
export const DOC_UPDATE_ERROR = 'DOC_UPDATE_ERROR';

export const DOC_DELETE = 'DOC_DELETE';
export const DOC_DELETE_SUCCESS = 'DOC_DELETE_SUCCESS';
export const DOC_DELETE_ERROR = 'DOC_DELETE_ERROR';

// -----------------------------------------------------------------------------
// PRIVATE ACTION CREATORS

function requestAllStart() {
  return { type: DOCS_LOAD_ALL };
}

function requestAllSuccess(docs) {
  return { type: DOCS_LOAD_ALL_SUCCESS, payload: docs };
}

function requestAllError(err) {
  return { type: DOCS_LOAD_ALL_ERROR, payload: err };
}

function createDocStart() {
  return { type: DOC_CREATE };
}

function createDocSuccess(doc) {
  return { type: DOC_CREATE_SUCCESS, payload: doc };
}

function createDocError(err) {
  return { type: DOC_CREATE_ERROR, payload: err };
}

function updateDocStart() {
  return { type: DOC_UPDATE };
}

function updateDocSuccess(doc) {
  return { type: DOC_UPDATE_SUCCESS, payload: doc };
}

function updateDocError(err) {
  return { type: DOC_UPDATE_ERROR, payload: err };
}

function deleteDocStart() {
  return { type: DOC_DELETE };
}

function deleteDocSuccess(doc) {
  return { type: DOC_DELETE_SUCCESS, payload: doc };
}

function deleteDocError(err) {
  return { type: DOC_DELETE_ERROR, payload: err };
}

// -----------------------------------------------------------------------------
// EXPORTED ACTIONS

// Fetch all documents from pouchdb.
export function fetchAll() {
  return (dispatch, getState, { pouchdb }) => {
    dispatch(requestAllStart());

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
export function create(doc, domainName) {
  return (dispatch, getState, { pouchdb }) => {
    dispatch(createDocStart());

    const newDoc = {
      _id: uuid(),
      domainName,
      ...doc
    };

    return pouchdb.put(newDoc)
      .then((res) => {
        if (res.error) {
          throw res;
        } else {
          dispatch(createDocSuccess(res));
          return res;
        }
      }).catch((err) => {
        dispatch(createDocError(err));
        throw err;
      });
  };
}

const mergeFn = (l, r) => r || l;

// update a document in pouchdb.
export function update(id, newValues) {
  return (dispatch, getState, { pouchdb }) => {
    dispatch(updateDocStart());

    // Pouch is our source of truth. Get document and merge new fields.
    return pouchdb.get(id)
    .then((doc) => {
      // const newDoc = { ...doc, ...newValues };
      const newDoc = R.mergeWith(mergeFn, doc, newValues);
      // console.log('>>> Updating Document:', doc, newValues);
      // console.log('>>>>> Result:', newDoc);
      return pouchdb.put(newDoc);
    })
    .catch((err) => {
      dispatch(updateDocError(err));
      throw err;
    })
    .then((res) => {
      dispatch(updateDocSuccess(res));
      return res;
    })
    .catch((err) => {
      dispatch(updateDocError(err));
      throw err;
    });
  };
}


// Delete a document from pouchdb.
export function deleteDoc(id, rev) {
  console.log('Should delete doc:', id, rev);
  return (dispatch, getState, { pouchdb }) => {
    dispatch(deleteDocStart());

    return pouchdb.remove(id, rev)
      .then((res) => {
        dispatch(deleteDocSuccess(res));
        return res;
      }).catch((err) => {
        dispatch(deleteDocError(err));
        throw err;
      });
  };
}
