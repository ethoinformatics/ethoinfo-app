import React from 'react';
import { observer } from 'mobx-react';
import 'normalize.css/normalize.css';
import 'onsenui/css/onsenui.css';
import 'onsenui/css/onsen-css-components.css';
import { Page, Splitter, SplitterContent } from 'react-onsenui';

import './app.styl';
// import DummyParagraphs from '../debug/dummyParagraphs';
import Menu from '../menu/menu';
import Navbar from '../navbar/navbar';

import CodeManagerView from '../codeManager/codeManager';
import GeoView from '../geoViewer/geoViewer';
import SettingsView from '../settings/settings';
import SyncView from '../sync/sync';
import Overview from '../overview/overview';

// Renders store.currentView
function renderCurrentView(store, dataStore) {
  const view = store.currentView;
  switch (view.name) {
    case 'codeManager':
      return <CodeManagerView />;
    case 'geoViewer':
      return <GeoView />;
    case 'overview':
      return <Overview diaries={dataStore.data.diaries} />;
    case 'settings':
      return <SettingsView />;
    case 'sync':
      return <SyncView store={dataStore} />;
    default:
      return <div>Default</div>;
  }
}

const App = observer(({ store, dataStore }) => (
  <div className="app">
    <Splitter>
      <Menu store={store} />
      <SplitterContent>
        <Page
          renderToolbar={() =>
            <Navbar title={store.currentViewDisplayName} menuAction={() => store.showMenu()} />}
        >
          { renderCurrentView(store, dataStore) }
        </Page>
      </SplitterContent>
    </Splitter>
  </div>
));

export default App;
