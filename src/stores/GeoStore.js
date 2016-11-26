import { action, computed, observable, reaction } from 'mobx';
import moment from 'moment';
import Geolocator from '../utilities/Geolocator';
import Timer from '../utilities/Timer';
import localStorage from '../utilities/localStorage';

const TIMER_INTERVAL = 1000;

export default class GeoStore {
  @observable geolocator;   // Wraps Geolocation API
  @observable isAvailable;  // Is geolocation available?
  @observable shouldWatch;  // Should we watch geo data?
  @observable isWatching;   // Are we watching geo data?
  @observable geolocation;  // Current geo data
  @observable elapsed;      // Time between geo updates

  // Human friendly elapsed time since last geo update
  @computed get friendlyElapsed() {
    return moment.duration(-this.elapsed).humanize(true);
  }

  constructor() {
    this.geolocator = new Geolocator();
    this.elapsed = 0;
    this.timer = new Timer(time => (this.elapsed = time));
    this.isAvailable = this.geolocator.isAvailable;
    this.shouldWatch = localStorage.getShouldWatchGeolocation();
    this.geolocation = null;
    this.connectStoreToGeolocator();
  }

  // Toggle shouldWatch true and persist setting to local storage
  @action watchPosition() {
    localStorage.setShouldWatchGeolocation(true);
    this.shouldWatch = true;
  }

  // Toggle shouldWatch false and persist setting to local storage
  @action cancelWatchPosition() {
    localStorage.setShouldWatchGeolocation(false);
    this.shouldWatch = false;
  }

  // Watch geolocation updates, copying Geolocation
  // properties to our observable.
  // Flatten by combining timestamp and coordinate data.
  @action watch() {
    const isWatching = this.geolocator.watchPosition((data) => {
      console.log('🌎 Geolocation updated:', data);

      // Stop timer when an update comes in
      this.timer.stop();

      const { coords, timestamp } = data;
      const {
        accuracy,
        altitude,
        altitudeAccuracy,
        heading,
        latitude,
        longitude,
        speed
      } = coords;

      this.geolocation = {
        accuracy,
        altitude,
        altitudeAccuracy,
        heading,
        latitude,
        longitude,
        speed,
        timestamp
      };

      // Restart timer to track gap between updates
      this.timer.run(TIMER_INTERVAL);
    });

    this.isWatching = isWatching;

    // Start timer if we are watching
    if (isWatching) this.timer.run(TIMER_INTERVAL);
  }

  @action clearWatch() {
    this.geolocator.clearWatch();
    this.isWatching = false;
    this.timer.stop();
  }

  // Reacts to "shouldWatch" changes.
  connectStoreToGeolocator() {
    reaction(
      () => this.shouldWatch,
      (shouldWatch) => {
        console.log('Should watch:', shouldWatch);
        if (shouldWatch) {
          this.watch();
        } else {
          this.clearWatch();
        }
      },
      true // fire immediately.
    );
  }



}
