import React from 'react';
import { Button, Page } from 'react-onsenui';
import _ from 'lodash';

import './modal.styl';

const Modal = () => {
  return (
    <div className="modalFields">
      <div>I am a modal!</div>
      <Button
        style={{ margin: '6px' }}
        modifier="quiet"
        onClick={() => {
          /* destroy(_id, _rev)
          .then(() => {
            console.log(`Success deleting code: ${name}`);
            onDestroy();
          })
          .catch(() => {
            console.log(`Error deleting code: ${name}`);
          });*/
        }}
      >
        Delete
      </Button>
    </div>
  );
};

/* eslint-disable react/no-unused-prop-types */
Modal.propTypes = {
  item: React.PropTypes.shape({
    // name: React.PropTypes.string.isRequired,
    // _id: React.PropTypes.string.isRequired,
    // _rev: React.PropTypes.string.isRequired
  }),
  actions: React.PropTypes.shape({
    // new: React.PropTypes.func.isRequired,
    // destroy: React.PropTypes.func.isRequired,
    // onDestroy: React.PropTypes.func.isRequired
  })
};
/* eslint-enable react/no-unused-prop-types */

export default Modal;
