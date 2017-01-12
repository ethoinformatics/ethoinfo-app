import { action, computed, observable, map, toJS } from 'mobx';
import _ from 'lodash';
import url from 'url';
import PouchDB from 'pouchdb';
import pluralize from 'pluralize';
import Promise from 'bluebird';
import R from 'ramda';
import uuid from 'uuid/v4';
import localStorage from '../utilities/localStorage';
import { KEYS } from '../constants';
import config from '../config';
import schemas from '../schemas';
import schemaLoader from '../schemas/loader';
import { CategorySchema, ModelSchema } from '../schemas/schema';

// Pouch query API uses global namespace in a terrible way
// https://github.com/pouchdb/pouchdb/issues/4624
// We are using https://github.com/nolanlawson/pouchdb-find
// as recommended by PouchDB maintainer.
PouchDB.plugin(require('pouchdb-find'));

// Some issues:
// https://github.com/nolanlawson/pouchdb-find/issues/238
// No API for linked docs, so we need to query and link ourselves.
// This should be performant enough from a user's perspective,
// but we need to consider another approach if dataset becomes humongous.


/**
 * DataStore contains domain specific state.
 *
 * Normally we would compartmentalize state with a separate store
 * for each domain (e.g. WidgetsStore, TodosStore),
 * but since we define our domains programmatically via config,
 * we manage all domain state here.
 *
 * All domain state is contained within the @observable map "data",
 * and keyed by the name of the domain, eg:
 * data {
 *  widgets: widgetData,
 *  todos: todosData
 * }
 *
 * DataStore syncs our local (localStore, pouchDB)
 * and remote (couchDB) persistence layers
 * with our in-memory state.
 *
 * For more detailed information about general Store design, see
 * comments in ViewStore
 *
 * @export
 * @class DataStore
 */

export default class DataStore {
  constructor() {
    const dbName = config[KEYS.pouchDbName];
    const db = new PouchDB(dbName);

    db.createIndex({
      index: {
        fields: ['domainName']
      }
    }).then((result) => {
      console.log('Created index on "domainName"', result);
    }).catch((err) => {
      console.log('Error creating index on "domainName"', err);
    });

    // Load schemas
    this.loadSchemas();
  }

  // Observables
  @observable couchUsername = localStorage.getCouchUsername();
  @observable couchUrlBase = localStorage.getCouchUrlBase();
  @observable couchPassword = localStorage.getCouchPassword();

  @observable schemas = {
    categories: [],
    models: []
  }

  @observable schemasDebug = {
    categories: [],
    models: []
  }

  // Data holds our actual data.
  // PouchDB serves as the single source of truth, so we only modify data in response.
  // to Pouch I/O.
  // We use a map for dynamic keys.
  // https://mobx.js.org/refguide/map.html
  @observable data = map();

  // Fields holds our transient data input (form fields) state.
  // We use a map for dynamic keys.
  // https://mobx.js.org/refguide/map.html
  @observable fields = map();

  // Full URL includes username and password
  @computed get fullCouchUrl() {
    const urlObj = url.parse(this.couchUrlBase);
    const protocol = urlObj.protocol;
    const host = urlObj.host;
    const path = urlObj.path;
    const user = this.couchUsername;
    const pass = this.couchPassword;
    return `${protocol}//${user}:${pass}@${host}${path}`;
  }

  // Status
  @observable operationInFlight = false;
  @observable statusMessage = null;

  // Update remote couch password and persist to local storage
  @action updateCouchPassword(password) {
    this.couchPassword = password;
    localStorage.setCouchPassword(password);
  }

  /**
   * Update remote couch URL and persist to local storage
   *
   * @param {String} theUrl
   */
  @action updateCouchUrlBase(theUrl) {
    this.couchUrlBase = theUrl;
    localStorage.setCouchUrlBase(theUrl);
  }

  /**
   * Update remote couch username and persist to local storage
   *
   * @param {String} username
   */
  @action updateCouchUsername(username) {
    this.couchUsername = username;
    localStorage.setCouchUsername(username);
  }

  /**
   * Sets the given key to value on our observable data map (this.data)
   *
   * @param {String} key
   * @param {Any} value
   */
  @action setData(key, value) {
    const pluralizedAndCasedName = pluralize(_.camelCase(key));
    this.data.set(pluralizedAndCasedName, value);
  }

  // Replicate local pouchDB to remote couchDB (upload)
  @action uploadSync() {
    if (this.operationInFlight) {
      return;
    }

    /* this.operationInFlight = true;
    setTimeout(() => {
      this.operationInFlight = false;
      this.statusMessage = 'Upload success!';
    }, 1000); */

    const dbName = config[KEYS.pouchDbName];
    const db = new PouchDB(dbName);

    this.operationInFlight = true;

    const opts = { live: false };
    db.replicate.to(this.fullCouchUrl, opts)
    .on('complete', (info) => {
      this.operationInFlight = false;
      const docsWritten = info.docs_written;
      this.statusMessage = `Upload success: ${docsWritten} docs written.`;
    }).on('error', (err) => {
      this.operationInFlight = false;
      this.statusMessage = `Upload error: ${err.message}`;
    });
  }

  // Replicate remote couchDB to local pouchDB (download)
  @action downloadSync() {
    if (this.operationInFlight) {
      return;
    }

    const dbName = config[KEYS.pouchDbName];
    const db = new PouchDB(dbName);

    this.operationInFlight = true;

    const opts = { live: false };
    db.replicate.from(this.fullCouchUrl, opts)
    .on('complete', (info) => {
      this.operationInFlight = false;
      const docsWritten = info.docs_written;
      this.statusMessage = `Download success: ${docsWritten} docs written.`;
    }).on('error', (err) => {
      console.log(err);
      this.operationInFlight = false;
      this.statusMessage = `Download error: ${err.message}`;
    });
  }

  // Clear all local pouchDB data
  @action deletePouch() {
    const dbName = config[KEYS.pouchDbName];
    const db = new PouchDB(dbName);
    if (this.operationInFlight) {
      return;
    }

    this.operationInFlight = true;

    db.destroy().then(() => {
      this.operationInFlight = false;
      this.statusMessage = 'Local database cleared!';
    }).catch((err) => {
      this.operationInFlight = false;
      this.statusMessage = `Error clearing local database: ${err.message}`;
    });
  }

  @action loadAllDomains() {
    const dbName = config[KEYS.pouchDbName];
    const db = new PouchDB(dbName);

    const allSchemas = [
      ...toJS(this.schemas.categories),
      ...toJS(this.schemas.models)
    ];

    const allSchemaNames = allSchemas.map(schema => schema.name);

    // console.log(allSchemaNames);

    db.allDocs({
      include_docs: true,
      attachments: true
    }).then((result) => {
      const docs = result.rows
        .map(row => row.doc)
        .filter((doc) => {
          // console.log(doc);
          return allSchemaNames.includes(doc.domainName);
        });

      allSchemaNames.forEach((name) => {
        const collectionName = _.camelCase(name);
        const singularName = pluralize(collectionName, 1);

        const items = docs.filter(doc => doc.domainName === name);
        this.setData(pluralize(singularName), items);
      });

      // console.log('Loaded all docs', docs);
    }).catch((err) => {
      console.log('Error loading all docs', err);
    });
  }

  /**
   * Load data for a given domain name from pouchDB
   * @param {String} domainName
   */
  @action loadDomain(domainName) {
    const singularName = pluralize(domainName, 1);

    const dbName = config[KEYS.pouchDbName];
    const db = new PouchDB(dbName);

    db.find({
      selector: { domainName: singularName }
    }).then((result) => {
      console.log(`Loaded ${result.docs.length} docs for domain: ${singularName}`, result.docs.map(doc => doc));
      this.setData(pluralize(singularName), result.docs.slice());
    }).catch((err) => {
      console.log('Error loading domain:', err);
    });
  }

  /**
   * Puts a new document to pouchdb,
   * returning a promise that resolves on success and rejects on error
   * Todo: validate data before putting
   *
   * @param {String} domainName
   * @param {Object} data
   */
  @action createDoc(domainName, data) {
    this.operationInFlight = true;

    const singularName = pluralize(domainName, 1);

    const dbName = config[KEYS.pouchDbName];
    const db = new PouchDB(dbName);

    const doc = {
      _id: uuid(),
      domainName: singularName,
      ...data
    };

    return new Promise((resolve, reject) => {
      db.put(doc)
      .then((res) => {
        this.operationInFlight = false;
        resolve(res);
      }).catch((err) => {
        this.operationInFlight = false;
        reject(err);
      });
    });
  }

  /**
   * Removes a document from pouchdb,
   * returning a promise that resolves on success and rejects on error
   *
   * @param {String} _id
   * @param {String} _rev
   */
  @action deleteDoc(id, rev) {
    // Flag operation in flight
    this.operationInFlight = true;

    console.log(id, rev);

    const dbName = config[KEYS.pouchDbName];
    const db = new PouchDB(dbName);

    return new Promise((resolve, reject) => {
      db.remove(id, rev)
      .then((res) => {
        this.operationInFlight = false;
        resolve(res);
      }).catch((err) => {
        this.operationInFlight = false;
        reject(err);
      });
    });
  }

  // Clear status message generated from last operation.
  @action clearStatusMessage() {
    this.statusMessage = null;
  }

    /**
   * Load our schema definitions.
   *
   */

  @action loadSchemas() {
    // Load categories:
    const result = schemaLoader.load(schemas.categories, schemas.models);
    this.schemasDebug.categories = [...result.categories.slice()];
    this.schemasDebug.models = [...result.models.slice()];

    //--------------------

    // Filter valid categories and contruct CategorySchema from plain javascript object
    const validCategories = result.categories.filter(cat => cat.validation.error === null);

    const categorySchemas = validCategories.map((cat) => {
      const name = cat.name;
      return new CategorySchema(name);
    });

    console.log(categorySchemas);

    //--------------------

    // Filter valid models and contruct CategorySchema from plain javascript object
    const validModels = result.models.filter(model => model.validation.error === null);

    const categoryNames = validCategories.map(cat => cat.name);
    const modelNames = validModels.map(model => model.name);

    const modelSchemas = validModels.slice().map((model) => {
      const name = model.name;
      const fields = model.validation.value.fields;
      const displayField = model.validation.value.displayField;
      return new ModelSchema(name, fields, displayField, {
        categoryNames, modelNames
      });
    });

    console.log(modelSchemas);

    //--------------------
    // Assign schemas to our observable object this.schemas
    this.schemas.models = [...modelSchemas];
    this.schemas.categories = [...categorySchemas];

    // Setup observable array entries for each valid schema
    result.models.forEach((model) => {
      const singularName = model.name;
      this.setData(pluralize(singularName), []);
    });
  }

  // Set data input field.
  // Path is a path into our observable fields map (this.fields)
  @action setField(path, value) {
    // console.log('DataStore::setField', path, value);
    if (path.length < 2) {
      throw new Error('Trying to set field without a valid path. Requires at least 2 path components, the action (e.g. new or edit, and the domain)');
    }

    // First component is the key into our observable map
    const mapKey = path[0];

    // Remaining path components are the update path
    const updatePath = path.slice(1);

    // Get current value or return a default empty object
    const treeRoot = this.fields.get(mapKey) || {};

    // Compute new value:
    const newValue = R.assocPath(updatePath, value, treeRoot);

    // Save to observable map:
    this.fields.set(mapKey, newValue);

    // console.log('New fields tree:', toJS(this.fields));
  }

  // Todo: validate object
  @action saveFieldsAtPath(path) {
    this.operationInFlight = true;

    if (path.length < 2) {
      this.operationInFlight = false;
      return Promise.reject(new Error('Trying to save fields at invalid path. Requires at least 2 path components, the action (e.g. new or edit, and the domain)'));
    }

    // First component is the key into our observable map
    const mapKey = path[0];

    // Get tree root from map
    const treeRoot = this.fields.get(mapKey);

    // Get domain
    const domainName = path[1];

    if (!treeRoot) {
      this.operationInFlight = false;
      return Promise.reject(new Error(`Aborting save. No data exists at path: ${path}`));
    }

    const data = R.path([domainName], treeRoot);

    if (!data || R.valuesIn(data).length < 1) {
      this.operationInFlight = false;
      return Promise.reject(new Error(`Aborting save. No data exists at path: ${path}`));
    }

    // Valid path and data, save document!
    return this.createDoc(domainName, data);
  }

  @action updateDoc(id, path) {
    this.operationInFlight = true;

    if (path.length < 2) {
      this.operationInFlight = false;
      return Promise.reject(new Error('Trying to update fields at invalid path. Requires at least 2 path components, the action (e.g. new or edit, and the domain)'));
    }

    // DRY this up.
    // First component is the key into our observable map
    const mapKey = path[0];

    // Get tree root from map
    const treeRoot = this.fields.get(mapKey);

    // Get domain
    const domainName = path[1];

    if (!treeRoot) {
      this.operationInFlight = false;
      return Promise.reject(new Error(`Aborting save. No data exists at path: ${path}`));
    }

    const data = R.path([domainName], treeRoot);

    if (!data || R.valuesIn(data).length < 1) {
      this.operationInFlight = false;
      Promise.resolve({});
      // return Promise.reject(new Error(`Aborting save. No data exists at path: ${path}`));
    }

    const dbName = config[KEYS.pouchDbName];
    const db = new PouchDB(dbName);

    // Pouch is our source of truth. Get document and merge new fields.
    return db.get(id)
    .then((doc) => {
      const newDoc = { ...doc, ...data };
      console.log('New doc is:', newDoc);
      return db.put(newDoc);
    })
    .then((response) => {
      // console.log('Updated doc:', response);
      this.operationInFlight = false;
      // this.statusMessage = 'Document updated!';
      return response;
    })
    .catch((err) => {
      this.operationInFlight = false;
      this.statusMessage = 'Error updating doc!';
      throw new Error(err);
    });
  }

  @action resetFieldsAtPath(path) {
    if (path.length < 2) {
      throw new Error('Trying to get field without a valid path. Requires at least 2 path components, the action (e.g. new or edit, and the domain)');
    }

    // First component is the key into our observable map
    const mapKey = path[0];

    // Get domain
    const domainName = path[1];

    this.fields.set(mapKey, { [domainName]: null });
  }

  // Get data for a domain name (category or model) from memory (this.data[domainName])
  getData(domainName) {
    const collectionName = pluralize(_.camelCase(domainName));
    return this.data.get(collectionName);
  }

  // Get data for a field @path
  getField(path) {
    if (path.length < 2) {
      throw new Error('Trying to get field without a valid path. Requires at least 2 path components, the action (e.g. new or edit, and the domain)');
    }

    // First component is the key into our observable map
    const mapKey = path[0];

    const treeRoot = this.fields.get(mapKey);

    // Remaining path components are the update path
    const valuePath = path.slice(1);

    return R.path(valuePath, treeRoot);
  }

  // Get debug schema with validation information
  getDebugSchema(name) {
    const allSchemas = [...this.schemasDebug.categories, ...this.schemasDebug.models];
    return allSchemas.find(element => element.name === name);
  }

  // Get schema
  getSchema(name) {
    const allSchemas = [...this.schemas.categories, ...this.schemas.models];
    return allSchemas.find(element => element.name === name);
  }
}
