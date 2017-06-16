import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import R from 'ramda';
import { Button, Page } from 'react-onsenui';
import Breadcrumbs from '../breadcrumbs';
import { pop as popModal } from '../../redux/actions/modals';
import './modal.styl';

import { MODAL_TYPE_FIELD } from '../../redux/constants/modals';

import Navbar from '../navbar';

import Field from '../form/field';

const MODAL_COMPONENTS = {
  [MODAL_TYPE_FIELD]: Field
};

function mapStateToProps(state) {
  return {
    historyPath: state.views.history.path
  };
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  pop: () => {
    dispatch(popModal(ownProps.id));
  }
});

const Modal = (props) => {
  const ModalComponent = MODAL_COMPONENTS[MODAL_TYPE_FIELD] || null;

  const { actions, title, onClose, path, pop, historyPath } = props;

  // Without id
  // e.g. ["eba7d938-3488-4c4b-94ca-4c7cb636a057", "contacts", 0]
  // becomes ["contacts", 0]
  const relativePath = R.tail(path).join('/');
  const absolutePath = `${historyPath}/${relativePath}`;

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
        >
          <Breadcrumbs path={absolutePath} />
        </Navbar>
      }
    >
      <div className="modalComponent">
        <ModalComponent {...props} />
      </div>
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
  path: [],
  onClose: () => {}, // noop if we don't pass in a callback
  title: ''
};

/* eslint-disable react/no-unused-prop-types */
Modal.propTypes = {
  id: PropTypes.string.isRequired,
  historyPath: PropTypes.string,
  title: PropTypes.string,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      callback: PropTypes.func
    })
  ),
  path: PropTypes.array,
  pop: PropTypes.func.isRequired,
  onClose: PropTypes.func
};
/* eslint-enable react/no-unused-prop-types */

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Modal);
