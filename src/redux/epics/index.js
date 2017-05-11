import { combineEpics } from 'redux-observable';

import configEpics from './config';
import fieldsEpics from './fields';
import geoEpics from './geo';
import globalEpics from './global';

const epics = [
  ...configEpics,
  ...fieldsEpics,
  ...geoEpics,
  ...globalEpics
];

export default combineEpics(...epics);
