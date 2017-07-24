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
    // CORDOVA SPECIFIC USAGE VIA CORDOVA BACKGROUND GEOLOCATION PLUGIN
    // https://github.com/transistorsoft/cordova-background-geolocation-lt

    const bgGeo = window.BackgroundGeolocation;

    if (bgGeo) {
      // alert('Using background geolocation!');

      bgGeo.on('location', (loc, taskId) => {
        // const { coords } = location;
        // const { latitude, longitude } = coords;
        observer.next(loc);
        bgGeo.finish(taskId);
      });

      // Force retrieve geolocation
      bgGeo.on('heartbeat', () => { // params
        // const lastKnownLocation = params.location;
        // console.log('- heartbeat: ', lastKnownLocation);
        // Request a new location
        bgGeo.getCurrentPosition((loc, taskId) => {
          // console.log('- current position: ', location);
          observer.next(loc);
          bgGeo.finish(taskId);
        });
      });

      bgGeo.configure({
        // Geolocation config
        desiredAccuracy: 0, // HIGHEST POWER, HIGHEST ACCURACY
        distanceFilter: 0.5,
        // The minimum distance (measured in meters) a device must move
        // horizontally before an update event is generated.
        stationaryRadius: 25, // 25 is minimum on ios
        // When stopped, the minimum distance the device
        // must move beyond the stationary location for aggressive background-tracking to engage.
        // Activity Recognition config
        activityRecognitionInterval: 0,
        stopDetectionDelay: 5,
        // Allows the stop-detection system to be delayed from activating.
        stopTimeout: 15,
        // The number of minutes to wait before turning off location-services
        // after the ActivityRecognition System (ARS) detects the device is STILL
        // Application config
        logLevel: bgGeo.LOG_LEVEL_VERBOSE,
        debug: true,  // <-- Debug sounds & notifications.
        stopOnTerminate: true,
        startOnBoot: false,
        preventSuspend: true,
        heartbeatInterval: 30,
        // disableMotionActivityUpdates: false,
      }, (state) => {
        // alert('Background geolocation ready');

        if (!state.enabled) {
          // alert('Starting Background geolocation');
          bgGeo.start(() => {
            // alert('Background geolocation started');
          });
        } else {
          // alert('Background geolocation enabled');
        }
      });

      return () => bgGeo.stop();
    }

    // Normal watch
    // alert('Using navigator.geolocation');
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

  // https://developer.mozilla.org/en-US/docs/Web/API/PositionOptions
  const watchOptions = {
    enableHighAccuracy: true,
    maximumAge: 0 // Don't cache
  };

  return watch$.mergeMap(
    () => watchPosition(watchOptions)
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

  // console.log('Loading geolocation from cache');

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
