import store from 'store';
import config from '../config';
import { KEYS } from '../constants';

/**
 * Simple wrapper around localStorage operations.
 *
 * Getters pull from localStorage if set, otherwise from config.js
 * Setters persist values to localStorage if available otherwise noop.
 */
export default {
  getCouchUsername() {
    return (store.enabled && store.get(KEYS.couchUsername))
      || config.couchUsername || '';
  },

  getCouchUrlBase() {
    return (store.enabled && store.get(KEYS.couchUrlBase))
      || config.couchUrlBase || '';
  },

  getCouchPassword() {
    return (store.enabled && store.get(KEYS.couchPassword))
      || '';
  },

  setCouchPassword(password) {
    // Persist to localStorage if available
    if (store.enabled) {
      store.set(KEYS.couchPassword, password);
    }
  },

  setCouchUrl(url) {
    // Persist to localStorage if available
    if (store.enabled) {
      store.set(KEYS.couchUrl, url);
    }
  },

  setCouchUsername(username) {
    // Persist to localStorage if available
    if (store.enabled) {
      store.set(KEYS.couchUsername, username);
    }
  }
};
