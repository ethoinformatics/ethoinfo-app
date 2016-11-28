import { action, computed, observable } from 'mobx';

// import schemas from '../schemas';
// const { Diary } = schemas;
// console.log(schemas);
// console.log(Contact);
// console.log(Diary);

/**
 * A high level store that encapsulates top-level app state
 * and business logic, including:
 *
 * State that affects the UI globally,
 * such as visibility of the menu (menuIsOpen => Bool)
 * and the current view / route (currentView => Object).
 *
 * AppStore decorates state properties with @observable from MobX,
 * which allows us to automatically respond when state changes,
 * for example => in the view layer, we can automatically
 * re-render a component when a state dependency changes.
 *
 * The store also exposes actions that allow us to modify global state
 * from a single touch point:
 * @action showMenu()
 * @action hideMenu()
 *
 * We may opt to force all state changes from that touchpoint by using
 * MobX strictMode (see: https://mobxjs.github.io/mobx/refguide/action.html)
 *
 * Finally, AppStore connects to our router,
 * automatically updating view state (currentView)
 * in response to url changes. Likewise, our router reacts
 * when currentView changes by updating the browser url.
 *
 * AppStore should be treated like a singleton and instantiated only once
 * during the app's lifetime.
 *
 * AppStore is instantiated with domain specific stores passed as an argument
 * e.g.
 * {
 *  fooStore: fooStoreInstance,
 *  barStore: barStoreInstance
 * }
 *
 * This allows us to pass the stores through the component tree
 * as currentView changes.
 *
 * For more information about these design decisions, see:
 * https://mobxjs.github.io/mobx/best/store.html
 *
 * @class AppStore
 */

export default class AppStore {
  dataStore = null;

  constructor(stores) {
    const { dataStore, geoStore } = stores;

    this.dataStore = dataStore;
    this.geoStore = geoStore;
  }

  routes = [
    {
      iconClass: 'md-home',
      name: 'Overview',
      action: () => {
        this.showStaticView('overview');
      }
    },
    {
      iconClass: 'md-settings',
      name: 'Settings',
      action: () => {
        this.showStaticView('settings');
      }
    },
    {
      iconClass: 'md-refresh-sync',
      name: 'Data sync',
      action: () => this.showStaticView('sync')
    },
    {
      iconClass: 'md-search',
      name: 'Coded fields',
      action: () => this.showStaticView('codeManager')
    },
    {
      iconClass: 'ion-map',
      name: 'Geolocation viewer',
      action: () => this.showStaticView('geoViewer')
    }
  ];

  @observable menuIsOpen = false;
  @observable currentView = null;

  @computed get currentViewDisplayName() {
    switch (this.currentView.name) {
      case 'codeManager':
        return 'Code Manager';
      case 'geoViewer':
        return 'Geolocation Viewer';
      case 'overview':
        return 'Overview';
      case 'settings':
        return 'Settings';
      case 'sync':
        return 'Data Sync';
      default:
        return '';
    }
  }

  @action showMenu() {
    this.menuIsOpen = true;
  }

  @action hideMenu() {
    this.menuIsOpen = false;
  }

  @action showStaticView(name) {
    // Temporary implementation. Todo: Load dynamically for each domain route.
    if (name === 'overview') {
      setTimeout(() => {
        this.dataStore.loadDomain('diary');
      }, 400);
    }

    this.currentView = {
      name
    };
    this.menuIsOpen = false;
  }

}
