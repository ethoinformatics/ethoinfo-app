import { action, computed, observable, toJS, map } from 'mobx';
import _ from 'lodash';
import url from 'url';
import PouchDB from 'pouchdb';
import pluralize from 'pluralize';
import localStorage from '../utilities/localStorage';
import { KEYS } from '../constants';
import config from '../config';
import schemas from '../schemas';
import Promise from 'bluebird';
import uuid from 'uuid/v4';

import validateCategory from '../schemas/categories/validate';

const log = console.log;

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
 * All domain state is contained within the @observable property "data",
 * and keyed by the name of the domain, eg:
 * data {
 *  widgets: widgetData,
 *  todos: todosData
 * }
 *
 * DataStore syncs our local (localStore, pouchDB)
 * and remote (couchDB)persistence layers
 * with our in-memory state.
 *
 * For more detailed information about general Store design, see
 * comments in AppStore
 *
 * @export
 * @class DataStore
 */

/**
 * Load our schema definitions.
 *
 */

export default class DataStore {
  loadSchemas() {
    const categories = schemas.categories.map(key => _.camelCase(key));
    // Validate category definitions and add them to store if valid
    Object.keys(categories)
    .forEach((key) => {
      const category = categories[key];
      validateCategory(category)
      .then((value) => {
        console.log(`Loaded category definition => ${key}:`, value);
        this.schemas.categories.push({
          name: value
        });
        this.setData(value, []);
      })
      .catch((err) => {
        console.error(`Bad category definition: "${key}" => ${err}`);
      });
    });

    // Load models
    // log('Load models:');

    Object.keys(schemas.models).forEach((key) => {
      const model = schemas.models[key];
      // log(model);
    });
  }

  constructor() {
    const dbName = config[KEYS.pouchDbName];
    const db = new PouchDB(dbName);

    db.createIndex({
      index: {
        fields: ['domainName']
      }
    }).then((result) => {
      log('Created index on "domainName"', result);
    }).catch((err) => {
      log('Error creating index on "domainName"', err);
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

  // Update remote couch URL and persist to local storage
  @action updateCouchUrlBase(theUrl) {
    this.couchUrlBase = theUrl;
    localStorage.setCouchUrlBase(theUrl);
  }

  // Update remote couch username and persist to local storage
  @action updateCouchUsername(username) {
    this.couchUsername = username;
    localStorage.setCouchUsername(username);
  }

  @action setData(key, value) {
    const pluralizedAndCasedName = pluralize(_.camelCase(key));
    this.data.set(pluralizedAndCasedName, value);
  }

  // Replicate local pouch to remote couch (upload)
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
      console.log(err);
      this.operationInFlight = false;
      this.statusMessage = `Upload error: ${err.message}`;
    });
  }

  // Replicate remote couch to local pouch (download)
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

  // Clear local pouch data
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

  // Clear status message generated from last operation
  @action clearStatusMessage() {
    this.statusMessage = null;
  }

  getData(domainName) {
    const collectionName = pluralize(_.camelCase(domainName));
    return this.data.get(collectionName);
  }

  loadDomain(domainName) {
    const singularName = pluralize(_.camelCase(domainName), 1);

    const dbName = config[KEYS.pouchDbName];
    const db = new PouchDB(dbName);

    db.find({
      selector: { domainName: singularName }
    }).then((result) => {
      log(`Loaded ${result.docs.length} docs for domain: ${singularName}`, result.docs.map(doc => doc));
      this.setData(pluralize(singularName), result.docs.slice());
    }).catch((err) => {
      console.log(err);
    });
  }

  // Todo: validate data before putting
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
      .then((response) => {
        this.operationInFlight = false;
        console.log(response);
        resolve(true);
      }).catch((err) => {
        this.operationInFlight = false;
        console.log(err);
        reject(false);
      });
    });
  }

  @action deleteDoc(id, rev) {
    this.operationInFlight = true;

    const dbName = config[KEYS.pouchDbName];
    const db = new PouchDB(dbName);

    return new Promise((resolve, reject) => {
      db.remove(id, rev)
      .then((response) => {
        this.operationInFlight = false;
        console.log(response);
        resolve(true);
      }).catch((err) => {
        this.operationInFlight = false;
        console.log(err);
        reject(false);
      });
    });
  }

}
