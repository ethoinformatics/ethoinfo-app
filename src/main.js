import 'rxjs'; // Import all RxJS operators
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import ons from 'onsenui';
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

// https://onsen.io/v2/docs/js/util.html
// Disable onsen from adding extra margins for status bar
ons.disableAutoStatusBarFill();

ons.ready(() => {
  // Hide Cordova splash screen when Onsen UI is loaded completely
  // API reference: https://github.com/apache/cordova-plugin-splashscreen/blob/master/doc/index.md
  // navigator.splashscreen.hide();
  /* const { splashscreen } = navigator;
  if (splashscreen) {
    splashscreen.hide();
  } */
});

// Create redux store.
const store = configureStore();

function start() {
  // Some cordova logic:
  const { cordova, StatusBar } = window;

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

  /* if (StatusBar) {
    StatusBar.hide();
  } */

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
// but for the simplicity,
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
