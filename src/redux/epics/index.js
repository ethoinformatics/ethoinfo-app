import { combineEpics } from 'redux-observable';

import fieldsEpics from './fields';
import geoEpics from './geo';

const epics = [
  ...fieldsEpics,
  ...geoEpics
];

export default combineEpics(...epics);
