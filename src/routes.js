import _ from 'lodash';
import pluralize from 'pluralize';

export default [
  {
    path: '/',
    name: 'overview',
    title: () => 'Documents',
    prevPath: () => null,
    nextPath: () => null
  },
  {
    path: '/documents',
    name: 'overview',
    title: () => 'Documents',
    prevPath: () => null,
    nextPath: () => null
  },
  {
    path: '/documents/:id',
    name: 'documents',
    title: params => `${_.startCase(pluralize(params.id))}`,
    prevPath: () => '/documents',
    nextPath: params => `/documents/${params.id}/new`
  },
  {
    path: '/documents/:id/:docId',
    name: 'viewDocument',
    title: params => `${_.startCase(params.id)}`,
    prevPath: params => `/documents/${params.id}`,
    nextPath: () => null
  },
  {
    path: '/categories/:id/new',
    name: 'newCode',
    title: params => `${_.startCase(params.id)}`,
    prevPath: params => `/categories/${params.id}`,
    nextPath: () => null
  },
  {
    path: '/categories/:id',
    name: 'codes',
    title: params => `${_.startCase(params.id)}`,
    prevPath: () => '/categories',
    nextPath: params => `/categories/${params.id}/new`
  },
  {
    path: '/categories',
    name: 'categories',
    title: () => 'Code categories',
    prevPath: () => null,
    nextPath: () => null
  },
  {
    path: '/geoViewer',
    name: 'geoViewer',
    title: () => 'Geolocation Viewer',
    prevPath: () => null,
    nextPath: () => null
  },
  {
    path: '/settings',
    name: 'settings',
    title: () => 'Settings',
    prevPath: () => null,
    nextPath: () => null
  },
  {
    path: '/sync',
    name: 'sync',
    title: () => 'Data sync',
    prevPath: () => null,
    nextPath: () => null
  }
];
