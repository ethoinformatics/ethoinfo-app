import React from 'react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import { List, ListHeader, ListItem, Page } from 'react-onsenui';

import './overview.styl';

const Overview = observer(({ schemas }) => {
  const modelsDataSource = schemas.models ? toJS(schemas.models).slice() : [];
  const categoriesDataSource = schemas.categories ? toJS(schemas.categories).slice() : [];
  return (
    <Page className="overview">
      <List
        dataSource={modelsDataSource}
        renderHeader={() => <ListHeader>Models</ListHeader>}
        renderRow={(row, index) => <ListItem key={index}>{row.name}</ListItem>}
      />
      <List
        dataSource={categoriesDataSource}
        renderHeader={() => <ListHeader>Categories</ListHeader>}
        renderRow={(row, index) => <ListItem key={index}>{row.name}</ListItem>}
      />
    </Page>
  );
});

export default Overview;
