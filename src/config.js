import { KEYS } from './constants';

const config = {};

// Default settings.
// These can be overwritten at runtime and will be persisted to localStorage.
// App will prioritize value in localStorage > the config values here.

// config[KEYS.couchUrlBase] = 'http://demo.ethoinformatics.org:5984/tonytest2';
config[KEYS.couchUrlBase] = 'https://etho-dev.linebreakdev.com/test';
config[KEYS.couchUsername] = 'supermonkey';
config[KEYS.pouchDbName] = 'etho-pouch';
config[KEYS.shouldWatchGeolocation] = false;

export default config;
