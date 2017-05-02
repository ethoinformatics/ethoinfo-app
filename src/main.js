import 'rxjs'; // Import all RxJS operators
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from './components/app/app';
import history from './history';

import configureStore from './redux/configureStore';

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

// Create redux store.
const store = configureStore();

function start() {
  // Some cordova logic:
  const { cordova } = window;

  if (cordova) {
    // Enable background mode
    // https://github.com/katzer/cordova-plugin-background-mode
    cordova.plugins.backgroundMode.enable();

    // Addresses background mode quirks around GPS on android:
    cordova.plugins.backgroundMode.on('activate', () =>
      cordova.plugins.backgroundMode.disableWebViewOptimizations()
    );

    // Debug cordova presence:
    // alert('This is a cordova app');
  }

  // Initialize our stores
  /* const dataStore = new DataStore();
  const geoStore = new GeoStore();

  const stores = {
    dataStore, geoStore
  }; */

  // Kickoff history:
  history.replace('/documents', {});

  // Render our app into the DOM at the node with id 'root'
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
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

