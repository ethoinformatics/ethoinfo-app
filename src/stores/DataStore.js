import { action, computed, observable, map } from 'mobx';
import _ from 'lodash';
import url from 'url';
import PouchDB from 'pouchdb';
import pluralize from 'pluralize';
import Promise from 'bluebird';
import uuid from 'uuid/v4';
import localStorage from '../utilities/localStorage';
import { KEYS } from '../constants';
import config from '../config';
import schemas from '../schemas';
import schemaLoader from '../schemas/loader';

// Pouch query API uses global namespace in a terrible way
// https://github.com/pouchdb/pouchdb/issues/4624
// We are using https://github.com/nolanlawson/pouchdb-find
// as recommended by PouchDB maintainer.
PouchDB.plugin(require('pouchdb-find'));

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

  @observable data = map();

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

  /**
   * Load data for a given domain name from pouchDB
   * @param {String} domainName
   */
  @action loadDomain(domainName) {
    const singularName = pluralize(_.camelCase(domainName), 1);

    const dbName = config[KEYS.pouchDbName];
    const db = new PouchDB(dbName);

    db.find({
      selector: { domainName: singularName }
    }).then((result) => {
      console.log(`Loaded ${result.docs.length} docs for domain: ${singularName}`, result.docs.map(doc => doc));
      this.setData(pluralize(singularName), result.docs.slice());
    }).catch((err) => {
      console.log(err);
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

    const singularName = pluralize(_.camelCase(domainName), 1);

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
    this.operationInFlight = true;

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

  // Clear status message generated from last operation
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
    this.schemasDebug.categories = [...result.categories];
    this.schemasDebug.models = [...result.models];

    const validCategories = result.categories.filter(cat => cat.validation.error === null);
    this.schemas.categories = [...validCategories];
    console.log(result);
  }

  // Get data for a domain name from memory (this.data[domainName])
  getData(domainName) {
    const collectionName = pluralize(_.camelCase(domainName));
    return this.data.get(collectionName);
  }

  // Get debug schema with validation information
  getDebugSchema(id) {
    let allSchemas = [...this.schemasDebug.categories, ...this.schemasDebug.models];
    return allSchemas.find(element => element.name === id);
  }

}
