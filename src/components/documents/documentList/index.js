import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { List, ListItem, Page, Icon } from 'react-onsenui';
import { notification } from 'onsenui';
import './documentList.styl';
import history from '../../../history';

import {
  fetchAll as fetchAllDocuments,
  deleteDoc as _deleteDoc
} from '../../../redux/actions/documents';

// import { getDocsByDomain } from '../../redux/reducers';

import { makeGetByDomain } from '../../../redux/selectors/documents';
import { getSchema } from '../../../schemas/main';

const getDocsByDomain = makeGetByDomain();

// Map state to props
const mapStateToProps = (state, props) =>
  ({
    docs: getDocsByDomain(state, props),
    // docs: getDocsByDomain(state, domain),
    schema: getSchema(props.domain)
  });

// Map dispatch to props
const mapDispatchToProps = dispatch => ({
  fetchAllDocuments: () => {
    dispatch(fetchAllDocuments());
  },
  deleteDoc: (id, rev) => {
    notification.confirm('Remove?')
    .then((response) => {
      if (response) {
        dispatch(_deleteDoc(id, rev));
      }
    });
  },
});

class DocumentList extends Component {
  componentDidMount() {
    // Async thunk call goes here
    this.props.fetchAllDocuments();
  }

  renderDocumentListItem(doc, index) {
    const { _id, _rev, isLocked } = doc;
    const { domain, schema, deleteDoc } = this.props;
    const path = `/documents/${domain}/${_id}`;
    const displayValue = schema.getFriendlyString(doc);
    /* const statusIcon = isLocked ?
      <Icon className="lockedDocIcon" icon="ion-ios-locked-outline" /> : null; */
    return (
      <ListItem key={index} onClick={() => history.push(path, {})}>
        <div className={`displayValue ${isLocked ? 'locked' : ''}`}>
          { displayValue }
        </div>
        { /* statusIcon */ }
        <button
          className="delete"
          disabled={isLocked}
          onClick={(e) => {
            e.stopPropagation();
            deleteDoc(_id, _rev);
          }}
        >
          {
            !isLocked &&
              <Icon icon="md-close" />
          }
          {
            isLocked &&
              <Icon style={{ color: 'black' }} icon="ion-ios-locked-outline" />
          }

        </button>
      </ListItem>
    );
  }

  render() {
    const { docs, schema } = this.props;

    return (
      <Page className="documentList">
        <List
          dataSource={docs.sort((l, r) =>
            schema.getFriendlyString(l) < schema.getFriendlyString(r))}
          renderRow={(doc, index) => this.renderDocumentListItem(doc, index)}
        />
      </Page>
    );
  }
}

DocumentList.propTypes = {
  deleteDoc: PropTypes.func.isRequired,
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
