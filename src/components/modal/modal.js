import React from 'react';
import { connect } from 'react-redux';
import { Page } from 'react-onsenui';
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

  return (
    <Page
      className="modal"
      renderToolbar={() =>
        <Navbar
          leftItem={{
            icon: 'md-chevron-left',
            action: () => {
              props.pop();
              props.onClose();
            }
          }}
          title={props.id}
        />
      }
    >
      <ModalComponent {...props} />
    </Page>
  );
};

Modal.defaultProps = {
  onClose: () => {} // noop if we don't pass in a callback
};

/* eslint-disable react/no-unused-prop-types */
Modal.propTypes = {
  id: React.PropTypes.string.isRequired,
  pop: React.PropTypes.func.isRequired,
  onClose: React.PropTypes.func
};
/* eslint-enable react/no-unused-prop-types */

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Modal);
