import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { List, ListItem, Page, ListHeader } from 'react-onsenui';
import './documentList.styl';
import history from '../../history';
import Breadcrumbs from '../breadcrumbs/breadcrumbs';

import { fetchAll as fetchAllDocuments } from '../../redux/actions/documents';
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
  }
});

class DocumentList extends Component {
  componentDidMount() {
    // Async thunk call goes here
    this.props.fetchAllDocuments();
  }

  renderDocumentListItem(doc, index) {
    const { _id } = doc;
    const { domain, schema } = this.props;
    const path = `/documents/${domain}/${_id}`;

    const displayValue = schema.getFriendlyString(doc);

    return (
      <ListItem key={index} onClick={() => history.push(path, {})}>
        { displayValue }
      </ListItem>
    );
  }

  render() {
    const { docs } = this.props;
    const { domain } = this.props;
    const path = ['documents', '', domain, ''];

    return (<Page className="documentList">
      {<Breadcrumbs path={path} />}
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
