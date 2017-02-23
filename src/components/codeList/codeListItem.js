import React from 'react';
import { ListItem, Icon } from 'react-onsenui';
import _ from 'lodash';
import './codeListItem.styl';

const CodeListItem = ({ item, deleteAction }) => {
  const { name, _id, _rev } = item;
  return (
    <ListItem>
      <div className="center">
        {_.startCase(name)}
      </div>
      <div className="right">
        <button
          className="delete"
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
          <Icon icon="md-close"/>
        </button>
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
  deleteAction: React.PropTypes.func.isRequired,
};
/* eslint-enable react/no-unused-prop-types */

export default CodeListItem;
