import { createSelector } from 'reselect';

import * as FromAll from '../reducers/documents/all';
import * as FromById from '../reducers/documents/byId';


import { mapGeoFromCache } from '../../utilities/geoUtils';
import { getSchema } from '../../schemas/main';

const getDocuments = state => state.docs;
const getDomainFromProps = (_, props) => props.domain;
const getIdFromProps = (_, props) => props.id;

const getGeoCache = state => state.geo.entries;

export const getAll = createSelector(
  getDocuments,
  docs => FromAll
    .getAll(docs.all)
    .map(id => FromById.getById(docs.byId, id))
);

export const makeGetById = () =>
  createSelector(
    getDocuments, getIdFromProps, getGeoCache,
    (docs, id, geoCache) => {
      const doc = FromById.getById(docs.byId, id);

      if (!doc) { return null; }

      // const { domainName } = doc;
      // const schema = getSchema(domainName);
      // const geoData = mapGeoFromCache(doc, schema, geoCache);
      return { ...doc };
    }
  );

export const makeGetByDomain = () =>
  createSelector(
   getAll, getDomainFromProps,
   (docs, domain) => docs.filter(doc => doc.domainName === domain)
  );

// Get minimum timestamp for all documents tracking geolocation
/* export const makeGetMinGeoTimestamp = () =>
  createSelector(
    getAll,
    docs => docs.reduce((acc, curr) => Math.min(acc, curr), Infinity)
  );
*/
