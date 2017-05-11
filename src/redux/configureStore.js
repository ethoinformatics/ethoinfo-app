import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { createEpicMiddleware } from 'redux-observable';
import thunk from 'redux-thunk';
import rootEpic from './epics';
import { watchOnHistoryChange } from './sagas';
import reducer from './reducers';

const epicMiddleware = createEpicMiddleware(rootEpic);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// https://github.com/zalmoxisus/redux-devtools-extension#12-advanced-store-setup

function configureStore(initialState) {
  // create the saga middleware
  const sagaMiddleware = createSagaMiddleware();

  const enhancers = composeEnhancers(
    // Middleware store enhancer.
    applyMiddleware(
      thunk.withExtraArgument({}),
      sagaMiddleware,
      epicMiddleware,
    )
  );

  const store = initialState
    ? createStore(reducer, initialState, enhancers)
    : createStore(reducer, enhancers);

  if (process.env.NODE_ENV === 'development' && module.hot) {
    // Enable Webpack hot module replacement for reducers. This is so that we
    // don't lose all of our current application state during hot reloading.
    module.hot.accept('./reducers', () => {
      const nextRootReducer = require('./reducers').default; // eslint-disable-line global-require

      store.replaceReducer(nextRootReducer);
    });
  }

  // Run history saga
  sagaMiddleware.run(watchOnHistoryChange);

  return store;
}

export default configureStore;
