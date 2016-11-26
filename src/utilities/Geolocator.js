import Promise from 'bluebird';
import _ from 'lodash';

/**
 * Simple wrapper around geolocation API
 * Constructor is noop if navigator or
 * navigator.geolocation are unavailable (e.g. non-browser environment)
 *
 * Geolocator promisifies the following geolocation API methods:
 * getCurrentPosition()
 *
 * More information on geolocation:
 * https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/Using_geolocation
 */
export default class Geolocator {
  constructor() {
    this.watchID = null; // Used to later cancel watch.

    // If navigator is undefined, return
    if (typeof navigator === 'undefined') {
      this.isAvailable = false;
      console.error('Error: navigator is undefined! Skipping Geolocator init.');
      return;
    }

    // If navigator.geolocation is undefined, return
    if (!navigator.geolocation) {
      this.isAvailable = false;
      console.error('Error: navigator.geolocation unavailable! Skipping Geolocator init.');
      return;
    }

    this.isAvailable = true;
  }

  getCurrentPosition() {
    return new Promise((resolve, reject) => {
      if (this.isAvailable === false) {
        reject(new Error('Geolocation unavailable'));
      }

      navigator.geolocation.getCurrentPosition(position => resolve(position));
    });
  }

  // The watchPosition() method returns an ID number
  // that can be used to uniquely identify the requested position watcher.
  // You use this value in tandem with the clearWatch() method
  // to stop watching the user's location.
  watchPosition(callback) {
    console.log('🌎 Geolocator.watchPosition()');
    if (this.isAvailable === false) {
      console.error('Error: Geolocation unavailable. Cannot watch position.');
      return false;
    }

    if (!_.isFunction(callback)) {
      throw new Error('You\'ve attempted to call watchPosition(callbackFn) without a callback function');
    }

    const options = {
      enableHighAccuracy: true,
      maximumAge: 30000,
      timeout: 27000
    };

    this.watchID = navigator.geolocation
      .watchPosition(position => callback(position), null, options);

    return true;
  }

  clearWatch() {
    console.log('🌎 Geolocator.clearWatch()');
    if (this.isAvailable === false || this.watchID === null) {
      return;
    }
    navigator.geolocation.clearWatch(this.watchID);
  }
}
