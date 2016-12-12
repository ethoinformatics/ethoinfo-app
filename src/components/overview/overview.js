import React from 'react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import { Icon, List, ListHeader, ListItem, Page } from 'react-onsenui';
import _ from 'lodash';
import history from '../../history';
import './overview.styl';

const Overview = observer(({ schemas }) => {
  const modelsDataSource = schemas.models ? toJS(schemas.models).slice() : [];
  const categoriesDataSource = schemas.categories ? toJS(schemas.categories).slice() : [];
  return (
    <Page className="overview">
      <List
        dataSource={modelsDataSource}
        renderHeader={() => <ListHeader>Models</ListHeader>}
        renderRow={(row, index) => {
          const { name, validation } = row;
          const style = validation.error !== null ? { color: 'red' } : { color: 'black' };
          const icon = validation.error !== null ? 'md-alert-triangle' : 'md-check';
          const path = `/overview/${row.name}`;

          return (<ListItem key={index} onClick={() => history.push(path, {})}>
            <div className="center" style={style}>
              {_.startCase(name)}
            </div>
            <div className="right" style={style}>
              <Icon icon={icon} />
            </div>
          </ListItem>);
        }}
      />
      <List
        dataSource={categoriesDataSource}
        renderHeader={() => <ListHeader>Categories</ListHeader>}
        renderRow={(row, index) => {
          const { name, validation } = row;
          const style = validation.error !== null ? { color: 'red' } : { color: 'black' };
          const icon = validation.error !== null ? 'md-alert-triangle' : 'md-check';
          const path = `/overview/${row.name}`;

          return (<ListItem key={index} onClick={() => history.push(path, {})}>
            <div className="center" style={style}>
              {_.startCase(name)}
            </div>
            <div className="right" style={style}>
              <Icon icon={icon} />
            </div>
          </ListItem>);
        }}
      />
    </Page>
  );
});

export default Overview;
