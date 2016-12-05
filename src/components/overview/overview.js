import React from 'react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import { List, ListItem, Page } from 'react-onsenui';

import './overview.styl';

const Overview = observer(({ diaries }) => {
  const dataSource = diaries ? toJS(diaries).slice().reverse() : [];
  return (
    <Page className="overview">
      <List
        dataSource={dataSource}
        renderRow={(row, index) => <ListItem key={index}>{row.eventDate}</ListItem>}
      />
    </Page>
  );
});

export default Overview;
