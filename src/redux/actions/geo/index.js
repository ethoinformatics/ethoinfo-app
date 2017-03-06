export const GEOLOCATION_LOAD_CACHE =
  'GEOLOCATION_LOAD_CACHE';

export const GEOLOCATION_LOAD_CACHE_SUCCESS =
  'GEOLOCATION_LOAD_CACHE_SUCCESS';

export const GEOLOCATION_LOAD_CACHE_ERROR =
  'GEOLOCATION_LOAD_CACHE_ERROR';

export const GEOLOCATION_WATCH = 'GEOLOCATION_WATCH';
export const GEOLOCATION_UNWATCH = 'GEOLOCATION_UNWATCH';
export const GEOLOCATION_RECEIVED = 'GEOLOCATION_RECEIVED';
export const GEOLOCATION_SAVED = 'GEOLOCATION_SAVED';
export const GEOLOCATION_ERROR = 'GEOLOCATION_ERROR';

// Load geolocation from localForage cache
export function loadCache() {
  return { type: GEOLOCATION_LOAD_CACHE };
}

// Success loading geolocation from localForage cache
export function loadCacheSuccess(payload) {
  return { type: GEOLOCATION_LOAD_CACHE_SUCCESS, payload };
}

// Error loading geolocation from localForage cache
export function loadCacheError(err) {
  return { type: GEOLOCATION_LOAD_CACHE_ERROR, err };
}

// Geolocation received via watch
export function received(payload) {
  return { type: GEOLOCATION_RECEIVED, payload };
}

// Geolocation persisted to localForage
export function saved(payload) {
  return { type: GEOLOCATION_SAVED, payload };
}

// Geolocation error
export function errored(err) {
  return { type: GEOLOCATION_ERROR, err };
}

// Watch geolocation
export function watch() {
  return { type: GEOLOCATION_WATCH };
}

// Stop watching geolocation
export function unwatch() {
  return { type: GEOLOCATION_UNWATCH };
}
