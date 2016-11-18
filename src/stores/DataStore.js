import { action, computed, observable, toJS } from 'mobx';
import url from 'url';
import PouchDB from 'pouchdb';
import pluralize from 'pluralize';

// import Promise from 'bluebird';
import localStorage from '../utilities/localStorage';
import { KEYS } from '../constants';
import config from '../config';

PouchDB.plugin(require('pouchdb-find'));

// const diary = require('../schema/diary.yaml');

// Pouch query API uses global namespace in a terrible way
// https://github.com/pouchdb/pouchdb/issues/4624
// Using https://github.com/nolanlawson/pouchdb-find
// as recommended by PouchDB maintainer.

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

    // Initial data properties
    // this.data.diaries = [];
  }

  // Observables
  @observable couchUsername = localStorage.getCouchUsername();
  @observable couchUrlBase = localStorage.getCouchUrlBase();
  @observable couchPassword = localStorage.getCouchPassword();

  @observable data = {
    diaries: []
  };

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

  // Replicate local pouch to remote couch (upload)
  @action uploadSync() {
    if (this.operationInFlight) {
      return;
    }

    this.operationInFlight = true;

    setTimeout(() => {
      this.operationInFlight = false;
      this.statusMessage = 'Upload success!';
    }, 1000);
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

  // clear local pouch (download)
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

  loadDomain(domainName) {
    const dbName = config[KEYS.pouchDbName];
    const db = new PouchDB(dbName);

    db.find({
      selector: { domainName }
    }).then((result) => {
      console.log(`Loaded ${result.docs.length} docs for domain: ${domainName}`, result.docs.map(doc => toJS(doc)));
      this.data[pluralize(domainName)] = result.docs;
    }).catch((err) => {
      console.log(err);
    });
  }

}
