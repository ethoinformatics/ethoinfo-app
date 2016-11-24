import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app/app';
import AppStore from './stores/AppStore';
import DataStore from './stores/DataStore';
import GeoStore from './stores/GeoStore';
import startRouter from './router';

const dataStore = new DataStore();
const geoStore = new GeoStore();
const appStore = new AppStore(dataStore, geoStore);

/* geolocator.getCurrentPosition()
  .then(position => console.log('geolocation:', position))
  .catch(err => console.log('Error geolocating:', err)); */

geoStore.watchPosition();

startRouter(appStore);

ReactDOM.render(
  <App store={appStore} dataStore={dataStore} geoStore={geoStore} />,
  document.getElementById('root')
);
