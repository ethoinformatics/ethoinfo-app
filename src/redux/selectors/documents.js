import { createSelector } from 'reselect';

export default {};

export const getAllDocs = createSelector(
  state => state.docs.byId,
  docs => docs
);
