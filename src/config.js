import { KEYS } from './constants';

const config = {};

// Default couch/pouch settings.
// These can be overwritten at runtime and will be persisted to localStorage.
// App will prioritize value in localStorage > the config values here.
config[KEYS.couchUrlBase] = 'http://demo.ethoinformatics.org:5984/tonytest2';
config[KEYS.couchUsername] = 'supermonkey';
config[KEYS.pouchDbName] = 'etho-pouch';

export default config;
