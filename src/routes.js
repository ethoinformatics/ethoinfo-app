import _ from 'lodash';
import pluralize from 'pluralize';

export default [
  {
    path: '/',
    name: 'overview',
    title: () => 'Overview',
    prevPath: () => null,
    nextPath: () => null
  },
  {
    path: '/documents/:id',
    name: 'documents',
    title: params => `${_.startCase(pluralize(params.id))}`,
    prevPath: () => '/',
    nextPath: params => `/documents/${params.id}/new`
  },
  {
    path: '/documents/:id/new',
    name: 'newDocument',
    title: params => `New ${_.startCase(params.id)}`,
    prevPath: params => `/documents/${params.id}`,
    nextPath: () => null
  },
  {
    path: '/overview/:id',
    name: 'overviewDetail',
    title: params => `Overview: ${_.startCase(params.id)}`,
    prevPath: () => '/',
    nextPath: () => null
  },
  {
    path: '/debug',
    name: 'debug',
    title: () => 'Schema Viewer',
    prevPath: () => null,
    nextPath: () => null
  },
  {
    path: '/debug/:id',
    name: 'debugDetail',
    title: params => `${_.startCase(params.id)}`,
    prevPath: () => '/',
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
    title: () => 'Code Manager',
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
