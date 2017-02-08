import { action, computed, observable, reaction } from 'mobx';
import router from '../router';
import routes from '../routes';
import history from '../history';

/**
 * A high level store that encapsulates top-level view state, including:
 *
 * State that affects the UI globally,
 * such as visibility of the menu (menuIsOpen => Bool)
 * and the current view / route (currentView => Object).
 *
 * ViewStore decorates state properties with @observable from MobX,
 * which allows us to automatically respond when state changes,
 * for example => in the view layer, we can automatically
 * re-render a component when a state dependency changes.
 *
 * The store also exposes actions that allow us to modify global viewe state
 * from a single touch point:
 * @action showMenu()
 * @action hideMenu()
 *
 * We may opt to force all state changes from that touchpoint by using
 * MobX strictMode (see: https://mobxjs.github.io/mobx/refguide/action.html)
 *
 * Finally, ViewStore connects to our app history,
 * allowing us to automatically updating view state (currentView)
 * in response to routing changes
 *
 * ViewStore should be treated like a singleton and instantiated only once
 * during the app's lifetime.
 *
 * For more information about these design decisions, see:
 * https://mobxjs.github.io/mobx/best/store.html
 *
 * @class ViewStore
 */

export default class ViewStore {

  constructor(dataStore) {
    this.dataStore = dataStore;

    history.listen((location) => {
      // Menu should close when we navigate
      this.menuIsOpen = false;
      this.navigateTo(location.pathname);
    });

    this.connectToDataStore();
  }

  routes = [
    {
      iconClass: 'md-home',
      name: 'Overview',
      action: () => {
        // this.showStaticView('overview');
        history.push('/', {});
      }
    },
    {
      iconClass: 'md-settings',
      name: 'Settings',
      action: () => {
        // this.showStaticView('settings');
        history.push('/settings', {});
      }
    },
    {
      iconClass: 'md-refresh-sync',
      name: 'Data sync',
      action: () => history.push('/sync', {})
    },
    {
      iconClass: 'md-search',
      name: 'Code manager',
      action: () => history.push('/categories', {})
    },
    {
      iconClass: 'md-code',
      name: 'Schema Viewer',
      action: () => history.push('/debug', {})
    },
    {
      iconClass: 'ion-map',
      name: 'Geolocation viewer',
      action: () => history.push('/geoViewer', {})
    }
  ];

  @observable menuIsOpen = false;
  @observable path = '/';

  // CurrentView can be derived from path:
  // Todo: refactor with router:
  @computed get currentView() {
    // console.log(this.path);
    const view = router.resolve(routes, this.path);

    return view || {
      name: 'notFound',
      title: 'Not Found',
      params: null
    };
  }

  @action showMenu() {
    this.menuIsOpen = true;
  }

  @action hideMenu() {
    this.menuIsOpen = false;
  }

  @action navigateTo(path) {
    this.path = path;
  }

  // React to route changes, loading necessary data
  connectToDataStore() {
    /* reaction(
      () => this.currentView,
      (currentView) => {
        // Load data for the current view
        if (currentView.params && currentView.params.id) {
          this.dataStore.loadDomain(currentView.params.id);
        }

        // Load all domains
        this.dataStore.loadAllDomains();
      },
      true // Fire immediately.
    ); */
  }

}
