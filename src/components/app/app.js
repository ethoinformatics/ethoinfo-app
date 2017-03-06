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

// Actions
import {
  watch as watchGeolocation,
  loadCache as loadGeolocationCache
} from '../../redux/actions/geo';

import { open as openMenu, close as closeMenu } from '../../redux/actions/menu';
import { fetchAll as fetchAllDocuments } from '../../redux/actions/documents';

// Selectors
import { getAllModals } from '../../redux/reducers';
import { getCurrentView } from '../../redux/reducers/views';

// Components
import CategoryList from '../categoryList/categoryList';
import CodeList from '../codeList/codeList';
import DocumentList from '../documents/documentList';
import EditDocument from '../documents/editDocument';
import Geo from '../geoViewer/geoViewer';
import Modal from '../modal/modal';
import ModelList from '../models/modelList';
import NewCode from '../newCode/newCode';
import NewDocument from '../documents/newDocument';
import Settings from '../settings/settings';
import Sync from '../sync/sync';

import history from '../../history';

import { models, categories } from '../../schemas/main';

@observer
class App extends Component {
  constructor() {
    super();
    // Bind context
    this.renderNavbar = this.renderNavbar.bind(this);
  }

  componentDidMount() {
    this.props.fetchAllDocuments();
    this.props.watchGeolocation();
    this.props.loadGeolocationCache();
  }

  renderNavbar() {
    const { currentView, onOpenMenu } = this.props;

    return (
      <Navbar
        leftItem={currentView.prevPath ? {
          icon: 'md-chevron-left',
          action: () => history.push(currentView.prevPath, {})
        } : {
          icon: 'md-menu',
          action: () => onOpenMenu()
        }}
        rightItem={currentView.nextPath ? {
          icon: 'md-plus',
          action: () => history.push(currentView.nextPath, {})
        } : null}
        title={currentView.title}
      />
    );
  }

  // Renders currentView, passing in appropriate state as props.
  renderCurrentView(stores) {
    const { dataStore, geoStore } = stores;
    const { currentView } = this.props;

    const id = currentView.params.id; // domain
    const docId = currentView.params.docId; // document id

    switch (currentView.name) {

      case 'categories':
        return <CategoryList categories={categories} />;

      case 'codes':
        return <CodeList domain={id} />;

      case 'newCode':
        return (
          <NewCode
            createAction={data => dataStore.createDoc(id, data)}
            createSuccessAction={() => history.push(`/categories/${id}`, {})}
          />
        );

      case 'documents':
        return <DocumentList domain={id} />;

      case 'newDocument':
        return (
          <NewDocument
            domain={id}
            fieldsPath={['new', id]}
            actions={{
              onCreate: () =>
                history.push(`/documents/${id}/`, {})
            }}
          />
        );

      case 'viewDocument':
        return (
          <EditDocument
            id={docId}
            fieldsPath={['documents', '', id, '', docId, '']} // ['edit', id]
            domain={id}
            actions={{
              onUpdate: () => history.push(`/documents/${id}/`, {})
            }}
          />
        );

      case 'geoViewer':
        return <Geo />;

      case 'overview':
        return (
          <ModelList
            schemas={models}
            visibleItems={config.views.models.visibleItems}
          />
        );

      case 'settings':
        return <Settings />;

      case 'sync':
        return <Sync store={dataStore} />;

      default:
        return <div>View not found</div>;
    }
  }

  render() {
    const { modals, onCloseMenu, stores, views } = this.props;

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
            {/* Modal components */}
            { modals.map(modal =>
              <Modal key={modal.id} id={modal.id} {...modal.props} />
            )}

            {/* Main page */}
            <Page renderToolbar={this.renderNavbar}>
              { this.renderCurrentView(stores) }
            </Page>
          </SplitterContent>
        </Splitter>
      </div>
    );
  }
}

App.propTypes = {
  currentView: PropTypes.object,
  onOpenMenu: PropTypes.func,
  onCloseMenu: PropTypes.func,
  fetchAllDocuments: PropTypes.func,
  watchGeolocation: PropTypes.func,
  loadGeolocationCache: PropTypes.func,
  views: PropTypes.object, // Todo: shape
  stores: PropTypes.object, // Todo: shape
  modals: PropTypes.array, // Todo: shape
};

function mapStateToProps(state) {
  return {
    docs: state.docs,
    views: state.views,
    modals: getAllModals(state),
    currentView: getCurrentView(state.views)
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
  },
  watchGeolocation: () => {
    dispatch(watchGeolocation());
  },
  loadGeolocationCache: () => {
    dispatch(loadGeolocationCache());
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
