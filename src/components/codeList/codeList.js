import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { List, ListHeader, Page } from 'react-onsenui';
import CodeListItem from './codeListItem';
import './codeList.styl';

import { fetchAll as fetchAllDocuments } from '../../redux/actions/documents';
import { getDocsByDomain } from '../../redux/reducers';
import { getSchema } from '../../schemas/main';

// Function for sorting codes
const sortFn = (a, b) => {
  if (a.name.toLowerCase() > b.name.toLowerCase()) {
    return 1;
  }

  if (a.name.toLowerCase() < b.name.toLowerCase()) {
    return -1;
  }

  return 0;
};

// Map state to props
const mapStateToProps = (state, { domain }) =>
  ({
    codes: getDocsByDomain(state, domain),
    schema: getSchema(domain)
  });

// Map dispatch to props
const mapDispatchToProps = dispatch => ({
  fetchAllDocuments: () => {
    dispatch(fetchAllDocuments());
  }
});

class CodeList extends Component {
  componentDidMount() {
    // Async thunk call goes here
    this.props.fetchAllDocuments();
  }

  render() {
    const { actions, codes = [] } = this.props;
    console.log('>>>', codes);
    const dataSource = codes.sort(sortFn);

    // Todo: follow approach of document list
    const itemActions = {
    };

    return (
      <Page className="codeList">
        <div className="list-container">
          <List
            className="list"
            dataSource={dataSource}
            renderHeader={() => <ListHeader>Codes</ListHeader>}
            renderRow={(code, index) =>
              <CodeListItem item={code} actions={actions} key={index} />}
          />
        </div>
      </Page>
    );
  }
}

/* eslint-disable react/no-unused-prop-types */
CodeList.propTypes = {
  domain: PropTypes.string.isRequired,
  codes: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      _id: PropTypes.string.isRequired,
      _rev: PropTypes.string.isRequired
    })
  ),
  actions: PropTypes.shape({
    new: PropTypes.func.isRequired,
    destroy: PropTypes.func.isRequired,
    onDestroy: PropTypes.func.isRequired
  }),
  fetchAllDocuments: PropTypes.func.isRequired,
  schema: PropTypes.object.isRequired
};
/* eslint-enable react/no-unused-prop-types */

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CodeList);
