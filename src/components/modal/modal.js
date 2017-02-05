import React from 'react';
import { connect } from 'react-redux';
import { Page } from 'react-onsenui';
import { pop as popModal } from '../../redux/actions/modals';
import './modal.styl';

import Navbar from '../navbar/navbar';

function mapStateToProps() {
  return {
  };
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  pop: () => {
    dispatch(popModal(ownProps.id));
  }
});

const Modal = props =>
  (
    <Page
      className="modal"
      renderToolbar={() =>
        <Navbar
          leftItem={{
            icon: 'md-chevron-left',
            action: () => props.pop()
          }}
          title={props.id}
        />
      }
    >
      { props.children }
    </Page>
  );

Modal.defaultProps = {
  children: []
};

/* eslint-disable react/no-unused-prop-types */
Modal.propTypes = {
  id: React.PropTypes.string.isRequired,
  pop: React.PropTypes.func.isRequired,
  children: React.PropTypes.node
};
/* eslint-enable react/no-unused-prop-types */

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Modal);
