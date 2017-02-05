import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { setField as setFieldAction } from '../../redux/actions/fields';
import { getAll as getAllDocs } from '../../redux/reducers/documents';

import './form.styl';

import Fields from './fields';

const mapStateToProps = state =>
  ({
    docs: getAllDocs(state.docs),
    fields: state.fields
  });

const mapDispatchToProps = dispatch => ({
  setField: (path, value) => {
    dispatch(setFieldAction(path, value));
  }
});

const Form = ({ initialValues, fieldValues, path, schema }) =>
  (<div className="form">
    <ol className="formFields">
      {
        <Fields
          path={path}
          schema={schema}
          initialValues={initialValues}
          fieldValues={fieldValues}
        />
      }
    </ol>
  </div>);


Form.propTypes = {
  path: PropTypes.arrayOf(
    PropTypes.string
  ).isRequired,
  initialValues: PropTypes.object,
  fieldValues: PropTypes.object,
  schema: PropTypes.object.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Form);
