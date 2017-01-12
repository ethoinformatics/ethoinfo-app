/* eslint-disable no-constant-condition */
/* eslint-disable import/prefer-default-export */

import { take, put, call } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import history from '../../history';
import { MENU_CLOSE } from '../actions/menu';
import { UPDATE_HISTORY } from '../actions/history';

const createHistoryChannel = () => {
  // `eventChannel` takes a subscriber function
  // the subscriber function takes an `emit` argument to put messages onto the channel
  return eventChannel((emit) => {
    const unlisten = history.listen((location) => {
      // puts event payload into the channel
      // this allows a Saga to take this payload from the returned channel
      emit(location);
    });

    const unsubscribe = () => {
      unlisten();
    };

    return unsubscribe;
  });
};

export function* watchOnHistoryChange() {
  const historyChannel = yield call(createHistoryChannel);

  while (true) {
    const location = yield take(historyChannel);
    yield put({ type: MENU_CLOSE });
    yield put({ type: UPDATE_HISTORY, payload: location });
  }
}
