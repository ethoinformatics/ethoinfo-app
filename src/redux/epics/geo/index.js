import { Observable } from 'rxjs';
// import moment from 'moment';
import localforage from 'localforage';

import {
  GEOLOCATION_LOAD_CACHE,
  GEOLOCATION_WATCH,
  GEOLOCATION_UNWATCH,
  GEOLOCATION_RECEIVED,
  received,
  saved,
  errored,
  loadCacheSuccess,
  loadCacheError,
} from '../../actions/geo';

// Amount to throttle geolocation.watch
// This keeps us from being spammed
const THROTTLE_TIME = 10000; // ms

// Geolocation Observable wraps geolocation API
const watchPosition = options =>
  Observable.create((observer) => {
    const watchId = window.navigator.geolocation.watchPosition(
      loc => observer.next(loc),
      err => observer.error(err),
      options
    );

    return () => window.navigator.geolocation.clearWatch(watchId);
  }).publish().refCount();


// -----------------------------------------------------------------------------
// WATCH GEOLOCATION EPIC

const watchEpic = (action$) => {
  const watch$ = action$.ofType(GEOLOCATION_WATCH);
  const unWatch$ = action$.ofType(GEOLOCATION_UNWATCH);

  return watch$.mergeMap(
    () => watchPosition()
      .debounceTime(THROTTLE_TIME)
      .map(geoposition => received({
        coords: {
          latitude: geoposition.coords.latitude,
          longitude: geoposition.coords.longitude
        },
        timestamp: geoposition.timestamp
      }))
      .takeUntil(unWatch$)
    );
};


// -----------------------------------------------------------------------------
// SAVE GEOLOCATION EPIC

const saveEpic = (action$) => {
  const received$ = action$.ofType(GEOLOCATION_RECEIVED);

  return received$.switchMap(
    action =>
      localforage
        .getItem('geo')
        .then((geo) => { // eslint-disable-line arrow-body-style
          return localforage.setItem('geo', [...(geo || []), action.payload]);
        })
        .then(() => saved(action.payload))
        .catch((err) => { console.log(err); return errored(err); })
  );
};

// moment(loc.timestamp).format('dddd, MMMM Do YYYY, h:mm:ss a')


// -----------------------------------------------------------------------------
// LOAD GEOLOCATION EPIC
const loadCacheEpic = (action$) => {
  const load$ = action$.ofType(GEOLOCATION_LOAD_CACHE);

  console.log('Loading geolocation from cache');

  return load$.switchMap(
    () =>
      localforage
        .getItem('geo')
        .then(geo => loadCacheSuccess(geo || []))
        .catch(err => loadCacheError(err))
  );
};

export default [
  watchEpic,
  saveEpic,
  loadCacheEpic
];
