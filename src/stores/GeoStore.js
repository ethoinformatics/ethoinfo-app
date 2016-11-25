import { action, computed, observable } from 'mobx';
import moment from 'moment';
import Geolocator from '../utilities/Geolocator';
import Timer from '../utilities/Timer';


const TIMER_INTERVAL = 1000;

// cordova.plugins.backgroundMode
// ignore duplicate records

export default class GeoStore {
  @observable geolocator; // Geolocator object which wraps Geolocation API
  @observable isAvailable; // Is geolocation available?
  @observable isWatching; // Are we watching for geo data?
  @observable geolocation; // Current geo data.
  @observable elapsed; // Time between geo updates.

  // Human friendly elapsed time
  @computed get friendlyElapsed() {
    return moment.duration(-this.elapsed).humanize(true);
  }

  constructor() {
    this.geolocator = new Geolocator();
    this.elapsed = 0;
    this.timer = new Timer(time => (this.elapsed = time));
    this.isAvailable = this.geolocator.isAvailable;
    this.isWatching = false;
    this.geolocation = null;
  }

  // Watch geolocation updates, copying Geolocation
  // properties to our observable.
  // Flatten by combining timestamp and coordinate data.
  @action watchPosition() {
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

    // Run timer if we are watching
    if (isWatching) this.timer.run(TIMER_INTERVAL);
  }

  @action clearWatch() {
    this.geolocator.clearWatch();
    this.isWatching = false;
    this.timer.stop();
  }

}
