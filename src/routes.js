import _ from 'lodash';

export default [
  {
    path: '/',
    name: 'overview',
    title: () => 'Overview',
    prevPath: () => null,
    nextPath: () => null
  },
  {
    path: '/categories/:id/new',
    name: 'newCode',
    title: params => `${_.startCase(params.id)} | New code`,
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
