import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { List, ListHeader, ListItem, Page } from 'react-onsenui';
import R from 'ramda';
import history from '../../history';
import { getAllDocs } from '../../redux/selectors/documents';
import './allDocuments.styl';
      
const mapStateToProps = state =>
  ({ docs: getAllDocs(state) });

const AllDocuments = ({ docs }) =>
  <Page className="allDocuments">
    <List
      dataSource={R.values(docs)}
      renderHeader={() => <ListHeader>Documents</ListHeader>}
      renderRow={(row, index) => {
        const { _id, domainName } = row;
        const path = `/documents/${domainName}/${_id}`;

        return (<ListItem key={index} onClick={() => history.push(path, {})}>
          <div className="center">
            {_id}
          </div>
        </ListItem>);
      }}
    />
  </Page>;

AllDocuments.propTypes = {
  docs: PropTypes.object
};

export default connect(mapStateToProps)(AllDocuments);
