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
    const defaultValue = config[KEYS.couchUsername];

    if (!store.enabled) return defaultValue;

    return store.get(KEYS.couchUsername) || defaultValue;
  },

  getCouchUrlBase() {
    const defaultValue = config[KEYS.couchUrlBase];

    if (!store.enabled) return defaultValue;

    return store.get(KEYS.couchUrlBase) || defaultValue;
  },

  getCouchPassword() {
    const defaultValue = '';

    if (!store.enabled) return defaultValue;

    return store.get(KEYS.couchPassword) || '';
  },

  getShouldWatchGeolocation() {
    const defaultValue = config[KEYS.shouldWatchGeolocation];

    if (!store.enabled) return defaultValue;

    return store.get(KEYS.shouldWatchGeolocation) || defaultValue;
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
  },

  setShouldWatchGeolocation(boolValue) {
    // Persist to localStorage if available
    if (store.enabled) {
      store.set(KEYS.shouldWatchGeolocation, boolValue);
    }
  }
};
