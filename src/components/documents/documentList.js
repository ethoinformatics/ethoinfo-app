import React from 'react';
import { List, ListItem, Page, ListHeader } from 'react-onsenui';
import { toJS } from 'mobx';
import { observer, PropTypes } from 'mobx-react';
import './documentList.styl';
import history from '../../history';

const DocumentList = observer(({ domain, documents, actions }) => {
  const dataSource = documents ? toJS(documents).slice().sort() : [];
  // const { create, onCreate } = actions;
  // console.log(documents, actions);
  return (
    <Page className="documentList">
      <List
        dataSource={dataSource}
        renderHeader={() => <ListHeader>Documents</ListHeader>}
        renderRow={(row, index) => {
          const { _id } = row;
          const path = `/documents/${domain}/${_id}`;
          return (
            <ListItem key={index} onClick={() => history.push(path, {})}>
              {_id}
            </ListItem>
          );
        }
        }
      />
    </Page>
  );
});

/* eslint-disable react/no-unused-prop-types */
DocumentList.propTypes = {
  domain: React.PropTypes.string,
  documents: PropTypes.observableArrayOf(
    React.PropTypes.shape({
      _id: React.PropTypes.string.isRequired,
      _rev: React.PropTypes.string.isRequired
    })
  ).isRequired,
  actions: React.PropTypes.shape({
    // create: React.PropTypes.func.isRequired,
    // onCreate: React.PropTypes.func.isRequired
  })
};
/* eslint-enable react/no-unused-prop-types */

export default DocumentList;
