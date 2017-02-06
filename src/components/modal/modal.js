import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Button, Page } from 'react-onsenui';
import { pop as popModal } from '../../redux/actions/modals';
import './modal.styl';

import { MODAL_TYPE_FIELD } from '../../redux/constants/modals';

import Navbar from '../navbar/navbar';

import Field from '../forms/field';

const MODAL_COMPONENTS = {
  [MODAL_TYPE_FIELD]: Field
};

function mapStateToProps() {
  return {
  };
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  pop: () => {
    dispatch(popModal(ownProps.id));
  }
});

const Modal = (props) => {
  const ModalComponent = MODAL_COMPONENTS[MODAL_TYPE_FIELD] || null;

  const { actions, title, onClose, pop } = props;

  return (
    <Page
      className="modal"
      renderToolbar={() =>
        <Navbar
          leftItem={{
            icon: 'md-chevron-left',
            action: () => {
              pop();
              onClose();
            }
          }}
          title={title}
        />
      }
    >
      <ModalComponent {...props} />
      <div className="modalActions">
        {
          actions.map((action, index) =>
            <Button key={index} modifier="large" onClick={action.callback}>{action.title}</Button>
          )
        }
      </div>
    </Page>
  );
};

Modal.defaultProps = {
  actions: [],
  onClose: () => {}, // noop if we don't pass in a callback
  title: ''
};

/* eslint-disable react/no-unused-prop-types */
Modal.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      callback: PropTypes.func
    })
  ),
  pop: React.PropTypes.func.isRequired,
  onClose: React.PropTypes.func
};
/* eslint-enable react/no-unused-prop-types */

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Modal);
