import React from 'react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import { List, ListHeader, ListItem, Page } from 'react-onsenui';
import _ from 'lodash';
import history from '../../history';
import './overview.styl';

const Overview = observer(({ schemas }) => {
  const modelsDataSource = schemas.models ? toJS(schemas.models).slice() : [];
  return (
    <Page className="overview">
      <List
        dataSource={modelsDataSource}
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
    </Page>
  );
});

export default Overview;
