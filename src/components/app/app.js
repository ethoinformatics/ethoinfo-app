import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { observer } from 'mobx-react';
import 'normalize.css/normalize.css';
import 'onsenui/css/onsenui.css';
import 'onsenui/css/onsen-css-components.css';
import { Page, Splitter, SplitterContent } from 'react-onsenui';

import config from '../../config/index';

import './app.styl';
import Menu from '../menu/menu';
import Navbar from '../navbar/navbar';

import { open as openMenu, close as closeMenu } from '../../redux/actions/menu';
import { fetchAll as fetchAllDocuments } from '../../redux/actions/documents';
import { getAllModals } from '../../redux/reducers';

import Modal from '../modal/modal';

// import AllDocs from '../documents/allDocuments';
import CategoryList from '../categoryList/categoryList';
import CodeList from '../codeList/codeList';
import DebugDetail from '../debug/debugDetail';
import DebugView from '../debug/debugView';
import DocumentList from '../documents/documentList';
import EditDocument from '../documents/editDocument';
import Geo from '../geoViewer/geoViewer';
import ModelList from '../models/modelList';
import NewCode from '../newCode/newCode';
import NewDocument from '../documents/newDocument';
import Settings from '../settings/settings';
import Sync from '../sync/sync';

import { models } from '../../schemas/main';

// Renders currentView, passing in appropriate state as props.
function renderCurrentView(stores) {
  const { dataStore, geoStore, viewStore } = stores;
  const view = viewStore.currentView;

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
      return <DocumentList domain={view.params.id} />;
    case 'newDocument':
      return (
        <NewDocument
          domain={view.params.id}
          actions={{
            onCreate: () =>
              viewStore.navigateTo(`/documents/${view.params.id}/`)
          }}
        />
      );
    case 'viewDocument':
      // Reset form state.
      // dataStore.resetFieldsAtPath(['edit', view.params.docId]);
      return (<EditDocument
        id={view.params.docId}
        domain={view.params.id}
        actions={{
          onUpdate: () => viewStore.navigateTo(`/documents/${view.params.id}/`)
        }}
      />);
    case 'geoViewer':
      return <Geo store={geoStore} />;
    case 'overview':
      return <ModelList schemas={models} visibleItems={config.views.models.visibleItems} />;
    case 'settings':
      return <Settings />;
    case 'sync':
      return <Sync store={dataStore} />;
    default:
      return <div>View not found</div>;
  }
}

@observer
class App extends Component {

  componentDidMount() {
    this.props.fetchAllDocuments();
  }

  render() {
    const { stores, onOpenMenu, onCloseMenu, views, modals } = this.props;
    const { viewStore } = stores;
    const { currentView } = viewStore;

    const menuProps = {
      items: config.views.menu.items,
      isOpen: views.menu.isOpen,
      onClose: onCloseMenu
    };

    return (
      <div className="app">
        <Splitter>
          <Menu {...menuProps} />
          <SplitterContent>
            {
              modals.map(modal =>
                <Modal key={modal.id} id={modal.id} {...modal.props} />
              )
            }

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
  }
}

App.propTypes = {
  onOpenMenu: PropTypes.func,
  onCloseMenu: PropTypes.func,
  fetchAllDocuments: PropTypes.func
};

function mapStateToProps(state) {
  return {
    docs: state.docs,
    views: state.views,
    modals: getAllModals(state)
  };
}

const mapDispatchToProps = dispatch => ({
  onOpenMenu: () => {
    dispatch(openMenu());
  },
  onCloseMenu: () => {
    dispatch(closeMenu());
  },
  fetchAllDocuments: () => {
    dispatch(fetchAllDocuments());
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
