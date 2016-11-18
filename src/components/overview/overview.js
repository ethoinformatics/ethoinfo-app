import React from 'react';
import { observer } from 'mobx-react';
import { List, ListItem, Page } from 'react-onsenui';

import './overview.styl';

const Overview = observer(({ diaries }) => (
  <Page className="overview">
    <List
      dataSource={diaries.slice().reverse()}
      renderRow={(row, index) => <ListItem key={index}>{row.eventDate}</ListItem>}
    />
  </Page>
));

export default Overview;
