import React from 'react';
import { observer } from 'mobx-react';
import 'normalize.css/normalize.css';
import 'onsenui/css/onsenui.css';
import 'onsenui/css/onsen-css-components.css';
// import DevTools from 'mobx-react-devtools';
import { Page, Splitter, SplitterContent } from 'react-onsenui';

import './app.styl';
import Menu from '../menu/menu';
import Navbar from '../navbar/navbar';

import CategoryList from '../categoryList/categoryList';
import CodeList from '../codeList/codeList';
import NewCode from '../newCode/newCode';
import Geo from '../geoViewer/geoViewer';
import Settings from '../settings/settings';
import Sync from '../sync/sync';
import Overview from '../overview/overview';
import OverviewDetail from '../overview/overviewDetail';

// Renders currentView, passing in appropriate state as props.
function renderCurrentView(stores) {
  const { dataStore, geoStore, viewStore } = stores;
  const view = viewStore.currentView;
  // console.log('App::renderCurrentView', viewStore.currentView);

  switch (view.name) {
    case 'categories':
      return <CategoryList categories={dataStore.schemas.categories} />;
    case 'codes':
      return (
        <CodeList
          codes={dataStore.getData(view.params.id)}
          newAction={() => viewStore.navigateTo(`/categories/${view.params.id}/new`)}
          deleteAction={(id, rev) => dataStore.deleteDoc(id, rev)}
          deleteSuccessAction={() => {
            dataStore.loadDomain(view.params.id);
          }}
        />);
    case 'newCode':
      return (
        <NewCode
          createAction={data => dataStore.createDoc(view.params.id, data)}
          createSuccessAction={() => viewStore.navigateTo(`/categories/${view.params.id}`)}
        />);
    case 'geoViewer':
      return <Geo store={geoStore} />;
    case 'overview':
      return <Overview schemas={dataStore.schemasDebug} />;
    case 'overviewDetail':
      return <OverviewDetail schema={dataStore.getDebugSchema(view.params.id)} />;
    case 'settings':
      return <Settings />;
    case 'sync':
      return <Sync store={dataStore} />;
    default:
      return <div>View not found</div>;
  }
}

const App = observer(({ stores }) => {
  const { viewStore } = stores;
  const { currentView } = viewStore;
  return (
    <div className="app">
      <Splitter>
        <Menu store={viewStore} />
        <SplitterContent>
          <Page
            renderToolbar={() =>
              <Navbar
                leftItem={currentView.prevPath ? {
                  icon: 'md-chevron-left',
                  action: () => viewStore.navigateTo(currentView.prevPath)
                } : {
                  icon: 'md-menu',
                  action: () => viewStore.showMenu()
                }}
                rightItem={currentView.nextPath ? {
                  icon: 'md-plus',
                  action: () => viewStore.navigateTo(currentView.nextPath)
                } : null}
                title={currentView.title}
              />}
          >
            { renderCurrentView(stores) }
          </Page>
        </SplitterContent>
      </Splitter>
    </div>
  );
});

export default App;
