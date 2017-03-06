import { combineEpics } from 'redux-observable';

import geoEpics from './geo';

const epics = [
  ...geoEpics
];

export default combineEpics(...epics);
