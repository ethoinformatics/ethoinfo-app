import React from 'react';
import { Button, ListItem } from 'react-onsenui';
import _ from 'lodash';

const CodeListItem = ({ item, actions }) => {
  const { name, _id, _rev } = item;
  const { destroy, onDestroy } = actions;
  return (
    <ListItem>
      <div className="center">
        {_.startCase(name)}
      </div>
      <div className="right">
        <Button
          style={{ margin: '6px' }}
          modifier="quiet"
          onClick={() => {
            destroy(_id, _rev)
            .then(() => {
              console.log(`Success deleting code: ${name}`);
              onDestroy();
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
};

/* eslint-disable react/no-unused-prop-types */
CodeListItem.propTypes = {
  item: React.PropTypes.shape({
    name: React.PropTypes.string.isRequired,
    _id: React.PropTypes.string.isRequired,
    _rev: React.PropTypes.string.isRequired
  }),
  actions: React.PropTypes.shape({
    new: React.PropTypes.func.isRequired,
    destroy: React.PropTypes.func.isRequired,
    onDestroy: React.PropTypes.func.isRequired
  })
};
/* eslint-enable react/no-unused-prop-types */

export default CodeListItem;
