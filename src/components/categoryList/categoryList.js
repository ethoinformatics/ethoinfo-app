import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { List, ListItem, Page } from 'react-onsenui';
import history from '../../history';

import './categoryList.styl';

const CategoryList = (({ categories }) => {
  const dataSource = categories.sort();

  return (
    <Page className="categoryList">
      <List
        dataSource={dataSource}
        // renderHeader={() => <ListHeader>Categories</ListHeader>}
        renderRow={(row, index) => {
          const { name } = row;
          const path = `/categories/${row.name}`;
          return (
            <ListItem key={index} onClick={() => history.push(path, {})}>
              {_.startCase(name)}
            </ListItem>
          );
        }
        }
      />
    </Page>
  );
});

/* eslint-disable react/no-unused-prop-types */
CategoryList.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    })
  ).isRequired
};
/* eslint-enable react/no-unused-prop-types */

export default CategoryList;
