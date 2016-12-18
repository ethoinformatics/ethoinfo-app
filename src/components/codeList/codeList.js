import React from 'react';
import { toJS } from 'mobx';
import { observer, PropTypes } from 'mobx-react';
import { List, ListHeader, Page } from 'react-onsenui';
import CodeListItem from './codeListItem';
import './codeList.styl';

// Function for sorting codes
const sortFn = (a, b) => {
  if (a.name.toLowerCase() > b.name.toLowerCase()) {
    return 1;
  }

  if (a.name.toLowerCase() < b.name.toLowerCase()) {
    return -1;
  }

  return 0;
};

const CodeList = observer(({ codes, actions }) => {
  const dataSource = codes ? toJS(codes).slice().sort(sortFn) : [];
  return (
    <Page className="codeList">
      <div className="list-container">
        <List
          className="list"
          renderHeader={() => <ListHeader>Codes</ListHeader>}
          dataSource={dataSource}
          renderRow={(row, index) =>
            <CodeListItem item={row} actions={actions} key={index} />
          }
        />
      </div>
    </Page>
  );
});

/* eslint-disable react/no-unused-prop-types */
CodeList.propTypes = {
  codes: PropTypes.observableArrayOf(
    React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      _id: React.PropTypes.string.isRequired,
      _rev: React.PropTypes.string.isRequired
    })
  ),
  actions: React.PropTypes.shape({
    new: React.PropTypes.func.isRequired,
    destroy: React.PropTypes.func.isRequired,
    onDestroy: React.PropTypes.func.isRequired
  })
};
/* eslint-enable react/no-unused-prop-types */

export default CodeList;
