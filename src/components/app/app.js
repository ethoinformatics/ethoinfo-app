import React from 'react';
import { connect } from 'react-redux';
import { observer } from 'mobx-react';
import 'normalize.css/normalize.css';
import 'onsenui/css/onsenui.css';
import 'onsenui/css/onsen-css-components.css';
import { Page, Splitter, SplitterContent } from 'react-onsenui';

import './app.styl';
import Menu from '../menu/menu';
import Navbar from '../navbar/navbar';

import { open as openMenu, close as closeMenu } from '../../redux/actions/menu';

import CategoryList from '../categoryList/categoryList';
import CodeList from '../codeList/codeList';
import DebugView from '../debug/debugView';
import DebugDetail from '../debug/debugDetail';
import DocumentList from '../documents/documentList';
import EditDocument from '../documents/editDocument';
import NewDocument from '../documents/newDocument';
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
          actions={{
            new: () => viewStore.navigateTo(`/categories/${view.params.id}/new`),
            destroy: (id, rev) => dataStore.deleteDoc(id, rev),
            onDestroy: () => dataStore.loadDomain(view.params.id)
          }}
        />);
    case 'newCode':
      return (
        <NewCode
          createAction={data => dataStore.createDoc(view.params.id, data)}
          createSuccessAction={() => viewStore.navigateTo(`/categories/${view.params.id}`)}
        />);
    case 'debug':
      return <DebugView schemas={dataStore.schemasDebug} />;
    case 'debugDetail':
      return <DebugDetail schema={dataStore.getDebugSchema(view.params.id)} />;
    case 'documents':
      return (<DocumentList
        domain={view.params.id}
        documents={dataStore.getData(view.params.id)}
        schema={dataStore.getSchema(view.params.id)}
      />);
    case 'newDocument':
      return (<NewDocument
        dataStore={dataStore}
        domain={view.params.id}
        schema={dataStore.getSchema(view.params.id)}
        actions={{
          onCreate: () => viewStore.navigateTo(`/documents/${view.params.id}/`)
        }}
      />);
    case 'viewDocument':
      // Reset form state.
      dataStore.resetFieldsAtPath(['edit', view.params.id]);
      return (<EditDocument
        dataStore={dataStore}
        domain={view.params.id}
        schema={dataStore.getSchema(view.params.id)}
        doc={dataStore.getData(view.params.id).find(doc => doc._id === view.params.docId)}
        actions={{
          onUpdate: () => viewStore.navigateTo(`/documents/${view.params.id}/`)
        }}
      />);
    case 'geoViewer':
      return <Geo store={geoStore} />;
    case 'overview':
      return <Overview schemas={dataStore.schemas} />;
    case 'overviewDetail':
      return <OverviewDetail schema={dataStore.getSchema(view.params.id)} />;
    case 'settings':
      return <Settings />;
    case 'sync':
      return <Sync store={dataStore} />;
    default:
      return <div>View not found</div>;
  }
}

const App = observer(({ stores, onOpenMenu, onCloseMenu, views }) => {
  const { viewStore } = stores;
  const { currentView } = viewStore;

  const menuProps = {
    store: viewStore,
    isOpen: views.menu.isOpen,
    onClose: onCloseMenu
  };

  return (
    <div className="app">
      <Splitter>
        <Menu {...menuProps} />
        <SplitterContent>
          <Page
            renderToolbar={() =>
              <Navbar
                leftItem={currentView.prevPath ? {
                  icon: 'md-chevron-left',
                  action: () => viewStore.navigateTo(currentView.prevPath)
                } : {
                  icon: 'md-menu',
                  action: () => onOpenMenu()
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

function mapStateToProps(state) {
  return {
    docs: state.docs,
    views: state.views,
  };
}

const mapDispatchToProps = dispatch => ({
  onOpenMenu: () => {
    dispatch(openMenu());
  },
  onCloseMenu: () => {
    dispatch(closeMenu());
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
