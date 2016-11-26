import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app/app';
import AppStore from './stores/AppStore';
import DataStore from './stores/DataStore';
import GeoStore from './stores/GeoStore';
import startRouter from './router';

function start() {
  // Initialize our stores
  const dataStore = new DataStore();
  const geoStore = new GeoStore();
  const appStore = new AppStore(dataStore, geoStore);

  // Start URL routing
  startRouter(appStore);

  // Render our app into the DOM at the node with id 'root'
  ReactDOM.render(
    <App store={appStore} dataStore={dataStore} geoStore={geoStore} />,
    document.getElementById('root')
  );
}

// We'd should try to keep cordova specific logic compartmentalized,
// but for the simplicity of our initial use case,
// we hook into the Cordova device lifecycle events here.
// The 'deviceready' event signals that Cordova's device APIs
// have loaded and are ready to access.
// We wait for it before bootstrapping our application, otherwise
// certain features may not work
// (e.g. geolocation will use browser API vs. native capabilities)

// https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
if (window.cordova) {
  document.addEventListener('deviceready', start, false);
} else {
  start();
}




