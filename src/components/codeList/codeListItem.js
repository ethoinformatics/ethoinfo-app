import React from 'react';
import PropTypes from 'prop-types';
import { Button, ListItem } from 'react-onsenui';
import _ from 'lodash';

const CodeListItem = ({ item, deleteAction }) => {
  const { name, _id, _rev } = item;
  return (
    <ListItem>
      <div className="center">
        {_.startCase(name)}
      </div>
      <div className="right">
        <Button
          style={{ margin: '0px', padding: '0px' }}
          modifier="quiet"
          onClick={() => {
            deleteAction(_id, _rev)
            .then(() => {
              console.log(`Success deleting code: ${name}`);
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
  item: PropTypes.shape({
    name: PropTypes.string.isRequired,
    _id: PropTypes.string.isRequired,
    _rev: PropTypes.string.isRequired
  }),
  deleteAction: PropTypes.func.isRequired,
};
/* eslint-enable react/no-unused-prop-types */

export default CodeListItem;
