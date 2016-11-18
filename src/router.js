import { Router } from 'director';
import { autorun } from 'mobx';

export default function (store) {
  // update state on url change
  const router = new Router({ // eslint-disable-line no-unused-vars
    '/sync/': () => store.showStaticView('sync')
  }).configure({
    notfound: () => store.showStaticView('overview'),
    html5history: true
  }).init();

  // update url on state changes
  autorun(() => {
    const path = store.currentPath;
    if (path !== window.location.pathname) {
      window.history.pushState(null, null, path);
    }
  });
}
