import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app/app';
import AppStore from './stores/AppStore';
import DataStore from './stores/DataStore';
import GeoStore from './stores/GeoStore';
import startRouter from './router';

/**
 * Entrypoint for our app.
 *
 * One of the few places where we mix Cordova logic with generic web app logic.
 * This is for simplicity of setup since a primary use-case for our app is deploying
 * to mobile devices via Cordova.
 *
 * If window.cordova is defined, we wait until the "deviceready" event is fired
 * before starting our app. Otherwise we start the app immediately.
 *
 * start() instantiates our app's stores,
 * connects AppStore to a Director router,
 * and renders our top-level <App /> React component.
 */

function start() {
  // Initialize our stores
  const dataStore = new DataStore();
  const geoStore = new GeoStore();

  // Pass our domain stores to AppStore so that they can be passed
  // along the component tree as necessary.
  const appStore = new AppStore({
    dataStore, geoStore
  });

  // Start URL routing.
  startRouter(appStore);

  // Render our app into the DOM at the node with id 'root'
  ReactDOM.render(
    <App store={appStore} dataStore={dataStore} geoStore={geoStore} />,
    document.getElementById('root')
  );
}

// We should try to keep cordova specific logic compartmentalized,
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




