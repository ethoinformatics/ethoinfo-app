import { createSelector } from 'reselect';

import * as FromAll from '../reducers/documents/all';
import * as FromById from '../reducers/documents/byId';

const getDocuments = state => state.docs;
const getDomainFromProps = (_, props) => props.domain;
const getIdFromProps = (_, props) => props.id;

export const getAll = createSelector(
  getDocuments,
  docs => FromAll
    .getAll(docs.all)
    .map(id => FromById.getById(docs.byId, id))
);

export const makeGetById = () =>
  createSelector(
    getDocuments, getIdFromProps,
    (docs, id) => FromById.getById(docs.byId, id)
  );

export const makeGetByDomain = () =>
  createSelector(
   getAll, getDomainFromProps,
   (docs, domain) => docs.filter(doc => doc.domainName === domain)
  );
