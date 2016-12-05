import React from 'react';
import _ from 'lodash';
import { toJS } from 'mobx';
import { observer, PropTypes } from 'mobx-react';
import { List, ListItem, Page, ListHeader } from 'react-onsenui';
import history from '../../history';

import './categoryList.styl';

const CategoryList = observer(({ categories }) => {
  const dataSource = categories ? toJS(categories).slice().sort() : [];

  return (
    <Page className="categoryList">
      <List
        dataSource={dataSource}
        renderHeader={() => <ListHeader>Categories</ListHeader>}
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
  categories: PropTypes.observableArrayOf(
    React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      // values: PropTypes.observableArrayOf(React.PropTypes.string).isRequired
    })
  ).isRequired
};
/* eslint-enable react/no-unused-prop-types */

export default CategoryList;
