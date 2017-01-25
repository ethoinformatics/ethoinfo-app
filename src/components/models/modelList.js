import React, { PropTypes } from 'react';
import { List, ListHeader, ListItem, Page } from 'react-onsenui';
import _ from 'lodash';
import history from '../../history';
import './modelList.styl';

const ModelList = ({ schemas = [] }) =>
  <Page className="overview">
    <List
      dataSource={schemas}
      renderHeader={() => <ListHeader>Documents</ListHeader>}
      renderRow={(row, index) => {
        const { name } = row;
        const path = `/documents/${row.name}`;

        return (<ListItem key={index} onClick={() => history.push(path, {})}>
          <div className="center">
            {_.startCase(name)}
          </div>
        </ListItem>);
      }}
    />
  </Page>;

ModelList.propTypes = {
  schemas: PropTypes.arrayOf(
    PropTypes.object
  ).isRequired
};

export default ModelList;
