import React from 'react';
import _ from 'lodash';
import { toJS } from 'mobx';
import { observer, PropTypes } from 'mobx-react';
import { Button, BottomToolbar, Icon, ToolbarButton, List, ListItem, ListHeader, Page } from 'react-onsenui';
// import history from '../../history';

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

const CodeList = observer(({ codes, newAction, deleteAction, deleteSuccessAction }) => {
  const dataSource = codes ? toJS(codes).slice().sort(sortFn) : [];
  return (
    <Page className="codeList">
      <div className="list-container">
        <List
          className="list"
          renderHeader={() => <ListHeader>Codes</ListHeader>}
          dataSource={dataSource}
          renderRow={(row, index) => {
            const { name, _id, _rev } = row;
            return (
              <ListItem key={index}>
                <div className="center">
                  {_.startCase(name)}
                </div>
                <div className="right">
                  <Button
                    style={{ margin: '6px' }}
                    modifier="quiet"
                    onClick={() => {
                      deleteAction(_id, _rev)
                      .then(() => {
                        console.log(`Success deleting code: ${name}`);
                        deleteSuccessAction();
                      })
                      .catch(() => {
                        console.log(`Error deleting code: ${name}`);
                      });
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </ListItem>
            );
          }
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
      // values: PropTypes.observableArrayOf(React.PropTypes.string).isRequired
    })
  ),
  newAction: React.PropTypes.func.isRequired,
  deleteAction: React.PropTypes.func.isRequired,
  deleteSuccessAction: React.PropTypes.func.isRequired
};
/* eslint-enable react/no-unused-prop-types */

export default CodeList;
