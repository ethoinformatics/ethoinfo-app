import React from 'react';
import PropTypes from 'prop-types';
import { List, ListItem, Page } from 'react-onsenui';
import _ from 'lodash';
import history from '../../history';
import './modelList.styl';

const ModelList = ({ schemas = [], visibleItems = [] }) => {
  // Only include schemas listed in items (passed via config)
  const dataSource = schemas.filter(schema => visibleItems.includes(schema.name));

  return (
    <Page className="modelList">
      <List
        dataSource={dataSource}
        // renderHeader={() => <ListHeader>Documents</ListHeader>}
        renderRow={(row, index) => {
          const { name } = row;
          const path = `/documents/${row.name}`;

          return (<ListItem key={index} onClick={() => history.push(path, {})}>
            <div className="center">
              <div
                className="displayColor"
                style={{ backgroundColor: row.displayColor }}
              />
              <div className="name">
                {_.startCase(name)}
              </div>
            </div>
          </ListItem>);
        }}
      />
    </Page>
  );
};

ModelList.propTypes = {
  schemas: PropTypes.arrayOf(
    PropTypes.object
  ).isRequired,
  visibleItems: PropTypes.arrayOf(
    PropTypes.string
  ).isRequired
};

export default ModelList;
