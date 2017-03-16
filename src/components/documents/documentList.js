import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { List, ListItem, Page, ListHeader, Icon } from 'react-onsenui';
import './documentList.styl';
import history from '../../history';
import Breadcrumbs from '../breadcrumbs/breadcrumbs';

import {
  fetchAll as fetchAllDocuments,
  deleteDoc as _deleteDoc
} from '../../redux/actions/documents';

import { getDocsByDomain } from '../../redux/reducers';
import { getSchema } from '../../schemas/main';

// Map state to props
const mapStateToProps = (state, { domain }) =>
  ({
    docs: getDocsByDomain(state, domain),
    schema: getSchema(domain)
  });

// Map dispatch to props
const mapDispatchToProps = dispatch => ({
  fetchAllDocuments: () => {
    dispatch(fetchAllDocuments());
  },
  deleteDoc: (id, rev) => dispatch(_deleteDoc(id, rev)),
});

/* class DocumentListItem extends Component {
  constructor() {
    super();
    this.state = {
      shouldShowAlert: false
    };
  }

  render() {
    const { doc, domain, onDelete } = this.props;
    const { _id, _rev } = doc;
    return (
      <ListItem key={index} onClick={() => history.push(path, {})}>
        { displayValue }
        <button
          className="delete"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(_id, _rev);
          }}
        >
          <Icon icon="md-close" />
        </button>
      </ListItem>
    );
  }
}

DocumentListItem.propTypes = {
  doc: React.PropTypes.object.isRequired,
  onDelete: React.PropTypes.func.isRequired
}; */

class DocumentList extends Component {
  componentDidMount() {
    // Async thunk call goes here
    this.props.fetchAllDocuments();
  }

  renderDocumentListItem(doc, index) {
    const { _id, _rev } = doc;
    const { domain, schema, deleteDoc } = this.props;
    const path = `/documents/${domain}/${_id}`;

    const displayValue = schema.getFriendlyString(doc);

    return (
      <ListItem key={index} onClick={() => history.push(path, {})}>
        { displayValue }
        <button
          className="delete"
          onClick={(e) => {
            e.stopPropagation();
            deleteDoc(_id, _rev);
          }}
        >
          <Icon icon="md-close" />
        </button>
      </ListItem>
    );
  }

  render() {
    const { docs } = this.props;
    const { domain } = this.props;
    const path = ['documents', '', domain, ''];

    return (<Page className="documentList">
      { /* Breadcrumb logic is now handled in app.js and modal.js */ }
      { /* <Breadcrumbs path={path} /> */ }
      <List
        dataSource={docs}
        // renderHeader={() => <ListHeader>Documents</ListHeader>}
        renderRow={(doc, index) => this.renderDocumentListItem(doc, index)}
      />
    </Page>);
  }
}

/* eslint-disable react/no-unused-prop-types */
DocumentList.propTypes = {
  domain: PropTypes.string.isRequired,
  docs: PropTypes.arrayOf(
    PropTypes.object
  ).isRequired,
  fetchAllDocuments: PropTypes.func.isRequired,
  schema: PropTypes.object.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DocumentList);
