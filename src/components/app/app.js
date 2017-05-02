import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import 'normalize.css/normalize.css';
import 'onsenui/css/onsenui.css';
import 'onsenui/css/onsen-css-components.css';
import { Page, Splitter, SplitterContent } from 'react-onsenui';

import config from '../../config/index';

import './app.styl';
import Menu from '../menu/menu';
import Navbar from '../navbar/navbar';

// Actions
import { create as createDoc, fetchAll as fetchAllDocuments } from '../../redux/actions/documents';

import {
  watch as watchGeolocation,
  loadCache as loadGeolocationCache
} from '../../redux/actions/geo';

import { loadConfig } from '../../redux/actions/config';

import { open as openMenu, close as closeMenu } from '../../redux/actions/menu';

// Selectors
import { getAllModals } from '../../redux/reducers';
import { getCurrentView } from '../../redux/reducers/views';

// Components
import Breadcrumbs from '../breadcrumbs/breadcrumbs';
import CategoryList from '../categoryList/categoryList';
import CodeList from '../codeList/codeList';
import DocumentList from '../documents/documentList';
import EditDocument from '../documents/editDocument';
import Geo from '../geoViewer/geoViewer';
import Modal from '../modal/modal';
import ModelList from '../models/modelList';
import NewCode from '../newCode/newCode';
import Settings from '../settings/settings';
import Sync from '../sync/sync';

import history from '../../history';
import { models, categories } from '../../schemas/main';

class App extends Component {
  constructor() {
    super();
    // Bind context
    this.renderNavbar = this.renderNavbar.bind(this);
  }

  componentDidMount() {
    this.props.fetchAllDocuments();
    this.props.loadConfig();
    this.props.loadGeolocationCache();
    this.props.watchGeolocation();
  }

  /**
   * Render top navbar.
   * This element will always be topmost except when
   * a modal component is presented.
   */
  renderNavbar() {
    const { currentView, historyPath, onOpenMenu } = this.props;

    const newDocumentAction = () => {
      const domainName = currentView.params.id;

      this.props.createDoc(null, domainName)
        .then((result) => {
          console.log('Created a new doc:', result);
          const { id: newId } = result;
          const pathToNewDoc = `/documents/${domainName}/${newId}`;

          history.push(pathToNewDoc);
        }).catch((err) => {
          console.log('Error creating new document:', err);
        });
    };

    const newCategoryAction = () => {
      const domainName = currentView.params.id;
      const newPath = `/categories/${domainName}/new`;
      history.push(newPath, {});
    };

    let action = null;

    if (currentView.name === 'documents') {
      action = newDocumentAction;
    }

    if (currentView.name === 'codes') {
      action = newCategoryAction;
    }

    return (
      <Navbar
        leftItem={currentView.prevPath ? {
          icon: 'md-chevron-left',
          action: () => history.push(currentView.prevPath, {})
        } : {
          icon: 'md-menu',
          action: () => onOpenMenu()
        }}
        rightItem={action ? {
          icon: 'md-plus',
          action
        } : null}
        title={currentView.title}
      >
        <Breadcrumbs path={historyPath} />
      </Navbar>
    );
  }

  // Renders currentView, passing in appropriate state as props.
  renderCurrentView() {
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
            createAction={data => this.props.createDoc(data, id)}
            createSuccessAction={() => history.push(`/categories/${id}`, {})}
          />
        );

      case 'documents':
        return <DocumentList domain={id} />;

      case 'viewDocument':
        return (
          <EditDocument
            id={docId}
            fieldsPath={[docId]} // ['edit', id]
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
        return <Sync />;

      default:
        return <div>View not found</div>;
    }
  }

  render() {
    const { modals, onCloseMenu, views } = this.props;

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
            { modals.map((modal, index) =>
              <Modal key={modal.id} id={modal.id} {...modal.props} style={{ zIndex: index }} />
            )}

            {/* Main page */}
            <Page renderToolbar={this.renderNavbar}>
              { this.renderCurrentView() }
            </Page>
          </SplitterContent>
        </Splitter>
      </div>
    );
  }
}

App.propTypes = {
  createDoc: PropTypes.func,
  currentView: PropTypes.object,
  fetchAllDocuments: PropTypes.func.isRequired,
  historyPath: PropTypes.string,
  loadConfig: PropTypes.func.isRequired,
  loadGeolocationCache: PropTypes.func.isRequired,
  modals: PropTypes.array, // Todo: shape
  onOpenMenu: PropTypes.func,
  onCloseMenu: PropTypes.func,
  views: PropTypes.object, // Todo: shape
  watchGeolocation: PropTypes.func,
};

function mapStateToProps(state) {
  return {
    currentView: getCurrentView(state.views),
    docs: state.docs,
    historyPath: state.views.history.path,
    modals: getAllModals(state),
    views: state.views,
  };
}

const mapDispatchToProps = dispatch => ({
  createDoc: (data = {}, domainName) => dispatch(createDoc(data, domainName)),
  fetchAllDocuments: () => {
    dispatch(fetchAllDocuments());
  },
  loadConfig: () => {
    dispatch(loadConfig());
  },
  loadGeolocationCache: () => {
    dispatch(loadGeolocationCache());
  },
  onCloseMenu: () => {
    dispatch(closeMenu());
  },
  onOpenMenu: () => {
    dispatch(openMenu());
  },
  watchGeolocation: () => {
    dispatch(watchGeolocation());
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
