import { combineEpics } from 'redux-observable';

import configEpics from './config';
import fieldsEpics from './fields';
import geoEpics from './geo';

const epics = [
  ...configEpics,
  ...fieldsEpics,
  ...geoEpics
];

export default combineEpics(...epics);
