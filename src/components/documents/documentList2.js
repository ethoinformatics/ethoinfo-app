import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { List, ListItem, Page, ListHeader } from 'react-onsenui';
import './documentList.styl';
import history from '../../history';

import { fetchAll as fetchAllDocuments } from '../../redux/actions/documents';
import { getDocsByDomain } from '../../redux/reducers';

// Map state to props
const mapStateToProps = (state, { domain }) =>
  ({
    docs: getDocsByDomain(state, domain)
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
    console.log('Rendering document list 2', this.props);
  }

  renderDocumentListItem(doc, index) {
    const { _id } = doc;
    const { domain } = this.props;
    const path = `/documents/${domain}/${_id}`;

    return (
      <ListItem key={index} onClick={() => history.push(path, {})}>
        { _id }
      </ListItem>
    );
  }

  render() {
    const { docs } = this.props;

    return (<Page className="documentList">
      <List
        dataSource={docs}
        renderHeader={() => <ListHeader>Documents</ListHeader>}
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
  fetchAllDocuments: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DocumentList);
