import { action, observable } from 'mobx';
// import _ from 'lodash';
import Geolocator from '../utilities/Geolocator';

// cordova.plugins.backgroundMode
// ignore duplicate records

export default class GeoStore {
  @observable geolocator;
  @observable isAvailable;
  @observable isWatching;
  @observable geolocation;

  constructor() {
    this.geolocator = new Geolocator();
    this.isAvailable = this.geolocator.isAvailable;
    this.isWatching = false;
    this.geolocation = null;
  }

  // Watch geolocation updates and copy Geolocation
  // properties to our geolcoation observable.
  // Flatten by combining timestamp and coordinate data.
  @action watchPosition() {
    const isWatching = this.geolocator.watchPosition((data) => {
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
    });
    this.isWatching = isWatching;
  }

  @action clearWatch() {
    this.geolocator.clearWatch();
    this.isWatching = false;
  }

}
