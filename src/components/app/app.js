import React, { Component, PropTypes } from 'react';
import R from 'ramda';
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
import { create as createDoc, fetchAll as fetchAllDocuments } from '../../redux/actions/documents';

import {
  watch as watchGeolocation,
  loadCache as loadGeolocationCache
} from '../../redux/actions/geo';

import { open as openMenu, close as closeMenu } from '../../redux/actions/menu';

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
// import NewDocument from '../documents/newDocument';
import Settings from '../settings/settings';
import Sync from '../sync/sync';

import history from '../../history';

import Breadcrumbs from '../breadcrumbs/breadcrumbs';

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
    const { currentView, historyPath, onOpenMenu } = this.props;

    /* const pathToComponents = R.split('/');
    const padComponents = R.map(p => [p, '']);
    const makeComponents = R.pipe(pathToComponents, R.tail, padComponents, R.flatten);
    const components = makeComponents(historyPath); */

    console.log('^^^ HISTORY PATH:', historyPath);

    const newDocumentAction = () => {
      const domainName = currentView.params.id;
      // history.push(currentView.nextPath, {}
      // console.log('Create new:', domainName);
      this.props.createDoc(domainName)
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
  renderCurrentView(stores) {
    const { dataStore } = stores;
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

      /* case 'newDocument':
        return (
          <NewDocument
            domain={id}
            fieldsPath={['new', id]}
            actions={{
              onCreate: () =>
                history.push(`/documents/${id}/`, {})
            }}
          />
        ); */

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
            { modals.map((modal, index) =>
              <Modal key={modal.id} id={modal.id} {...modal.props} style={{ zIndex: index }} />
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
  createDoc: PropTypes.func,
  currentView: PropTypes.object,
  historyPath: PropTypes.string,
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
    currentView: getCurrentView(state.views),
    historyPath: state.views.history.path // Todo: make a selector
  };
}

const mapDispatchToProps = dispatch => ({
  createDoc: domainName => dispatch(createDoc({}, domainName)),
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
