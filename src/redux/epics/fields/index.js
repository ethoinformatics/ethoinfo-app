// import { Observable } from 'rxjs';

import {
  FIELD_SET
} from '../../actions/fields';

import { update } from '../../actions/documents';

// updateDoc: (id, newValues) => dispatch(update(id, newValues)

// -----------------------------------------------------------------------------
// AUTOSAVE EPIC
// Save document whenever a field changes

const THROTTLE_TIME = 200; // ms

const autoSaveEpic = (action$, store) => {
  const setField$ = action$.ofType(FIELD_SET);

  return setField$
    .debounceTime(THROTTLE_TIME)
    .map(
    (action) => {
      const payload = action.payload;
      const { path } = payload;
      const id = path[0]; // id is always first component of path

      const state = store.getState();
      const fields = state.fields;
      const newValues = fields[id];

      // console.log('>>> Set field epic', path, newValues);

      return update(id, newValues);
    });
};

export default [
  autoSaveEpic,
];
