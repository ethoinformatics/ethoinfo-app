import React from 'react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import { Icon, List, ListHeader, ListItem, Page } from 'react-onsenui';
import _ from 'lodash';
import history from '../../history';
import './debugView.styl';

const DebugView = observer(({ schemas }) => {
  console.log('render debug view');
  const modelsDataSource = schemas.models ? toJS(schemas.models).slice() : [];
  const categoriesDataSource = schemas.categories ? toJS(schemas.categories).slice() : [];
  return (
    <Page className="debug">
      <List
        dataSource={modelsDataSource}
        renderHeader={() => <ListHeader>Models</ListHeader>}
        renderRow={(row, index) => {
          const { name, validation } = row;
          const style = validation.error !== null ? { color: 'red' } : { color: 'black' };
          const icon = validation.error !== null ? 'md-alert-triangle' : 'md-check';
          const path = `/debug/${row.name}`;

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
          const path = `/debug/${row.name}`;

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

export default DebugView;
