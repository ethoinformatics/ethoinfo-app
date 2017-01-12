import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import { watchOnHistoryChange } from './sagas';
import reducer from './reducers';

function configureStore(initialState) {
  // create the saga middleware
  const sagaMiddleware = createSagaMiddleware();

  const enhancers = compose(
    // Middleware store enhancer.
    applyMiddleware(
      // Initialising redux-thunk with extra arguments will pass the below
      // arguments to all the redux-thunk actions.

      // Todo: pass a preconfigured pouchdb instance which can be used to fetch data
      // @see https://github.com/gaearon/redux-thunk

      /* thunk.withExtraArgument({
        pouchdb
      }), */

      thunk.withExtraArgument({}),
      sagaMiddleware
    ),
    // Redux Dev Tools store enhancer.
    // @see https://github.com/zalmoxisus/redux-devtools-extension
    // We only want this enhancer enabled for development and when in a browser
    // with the extension installed.
    process.env.NODE_ENV === 'development'
      && typeof window !== 'undefined'
      && typeof window.devToolsExtension !== 'undefined'
      // Call the brower extension function to create the enhancer.
      ? window.devToolsExtension()
      // Else we return a no-op function.
      : f => f,
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
