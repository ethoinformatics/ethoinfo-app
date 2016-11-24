import { action, computed, observable } from 'mobx';

// import schemas from '../schemas';
// const { Diary } = schemas;
// console.log(schemas);
// console.log(Contact);
// console.log(Diary);

export default class AppStore {
  dataStore = null;

  constructor(dataStore, geoStore) {
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
      iconClass: 'md-my-location',
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
