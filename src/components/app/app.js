import React, { Component } from 'react';
import PropTypes from 'prop-types';
import R from 'ramda';
import { connect } from 'react-redux';
import 'onsenui/css/onsenui.css';
import 'onsenui/css/onsen-css-components.css';
import 'normalize.css/normalize.css';
import { AlertDialog, Page, Splitter, SplitterContent } from 'react-onsenui';

// ------------------------------------------------------------
// Import actions
//
import { create as createDoc,
  fetchAll as fetchAllDocuments
} from '../../redux/actions/documents';

import {
  watch as watchGeolocation,
  loadCache as loadGeolocationCache
} from '../../redux/actions/geo';

import {
  markMessageAsRead
} from '../../redux/actions/global';

import { loadConfig } from '../../redux/actions/config';

import { open as openMenu, close as closeMenu } from '../../redux/actions/menu';

// ------------------------------------------------------------
// Import selectors
//
import { getAllModals } from '../../redux/reducers';
import { getCurrentView } from '../../redux/reducers/views';

// ------------------------------------------------------------
// Import components
//
import Breadcrumbs from '../breadcrumbs/breadcrumbs';
import CategoryList from '../categoryList/categoryList';
import CodeList from '../codeList/codeList';
import DocumentList from '../documents/documentList';
import EditDocument from '../documents/editDocument';
import Geo from '../geoViewer/geoViewer';
import Menu from '../menu/menu';
import Modal from '../modal/modal';
import ModelList from '../models/modelList';
import Navbar from '../navbar/navbar';
import NewCode from '../newCode/newCode';
import Settings from '../settings/settings';
import Sync from '../sync/sync';

// ------------------------------------------------------------
// Import styles
//
import './app.styl';

// ------------------------------------------------------------
// Import helpers
//
import history from '../../history';
import { models, categories } from '../../schemas/main';
import config from '../../config/index';


// ------------------------------------------------------------
// APP COMPONENT
//
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

  /**
   * Render any global app messages one at a time in LIFO order.
   *
   */
  renderMessages() {
    const { messages, readMessage } = this.props;
    const lastMessage = R.last(messages);

    return lastMessage ?
      <AlertDialog
        isOpen
        isCancelable={false}
      >
        <div className="alert-dialog-content">
          {lastMessage.text}
        </div>
        <div className="alert-dialog-footer">
          <button onClick={() => readMessage(lastMessage.id)} className="alert-dialog-button">
            Ok
          </button>
        </div>
      </AlertDialog>
    : null;
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
              { this.renderMessages() }
            </Page>
          </SplitterContent>
        </Splitter>
      </div>
    );
  }
}

App.propTypes = {
  createDoc: PropTypes.func.isRequired,
  currentView: PropTypes.object.isRequired,
  fetchAllDocuments: PropTypes.func.isRequired,
  historyPath: PropTypes.string.isRequired,
  loadConfig: PropTypes.func.isRequired,
  loadGeolocationCache: PropTypes.func.isRequired,
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      text: PropTypes.string,
    })
  ).isRequired,
  modals: PropTypes.array.isRequired,
  onOpenMenu: PropTypes.func.isRequired,
  onCloseMenu: PropTypes.func.isRequired,
  readMessage: PropTypes.func.isRequired,
  views: PropTypes.object.isRequired,
  watchGeolocation: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    currentView: getCurrentView(state.views),
    docs: state.docs,
    historyPath: state.views.history.path,
    messages: state.global.messages,
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
  readMessage: (id) => {
    dispatch(markMessageAsRead(id));
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
