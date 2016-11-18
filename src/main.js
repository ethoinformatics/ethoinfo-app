import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app/app';
import AppStore from './stores/AppStore';
import DataStore from './stores/DataStore';
import startRouter from './router';

const dataStore = new DataStore();
const appStore = new AppStore(dataStore);

startRouter(appStore);

ReactDOM.render(
  <App store={appStore} dataStore={dataStore} />,
  document.getElementById('root')
);
