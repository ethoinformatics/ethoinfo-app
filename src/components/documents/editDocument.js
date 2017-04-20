import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

// Components
import { Page } from 'react-onsenui';
import Form from '../forms/form';

// Styles
import './editDocument.styl';
import './documentForm.styl';

import { getSchema } from '../../schemas/main';

// Actions
import { deleteDoc as _deleteDoc } from '../../redux/actions/documents';

import {
  resetFields as resetFieldsAtPath,
  setField as setFieldAction } from '../../redux/actions/fields';

// Selectors
import { getByPath as getFieldsByPath } from '../../redux/reducers/fields';
import { makeGetById } from '../../redux/selectors/documents';

const getById = makeGetById();

// Redux setup
const mapStateToProps = (state, ownProps) =>
  ({
    doc: getById(state, ownProps),
    fieldValues: getFieldsByPath(state.fields, ownProps.fieldsPath)
  });

const mapDispatchToProps = (dispatch, ownProps) => ({
  deleteDoc: (id, rev) => dispatch(_deleteDoc(id, rev)),
  resetFields: () => dispatch(resetFieldsAtPath(ownProps.fieldsPath)),
  setField: (path, value) => {
    dispatch(setFieldAction(path, value));
  }
});

class EditDocument extends React.Component {
  constructor() {
    super();

    // Bind context.
    this.deleteDoc = this.deleteDoc.bind(this);
    this.onFieldChange = this.onFieldChange.bind(this);
  }

  onFieldChange(path, value) {
    const { setField } = this.props;
    setField(path, value);
  }

  deleteDoc() {
    const { actions, deleteDoc, doc, resetFields } = this.props;

    deleteDoc(doc._id, doc._rev)
    .then(() => {
      actions.onUpdate();
      resetFields();
    })
    .catch((err) => {
      console.log('Error editing document:', err);
    });
  }

  render() {
    const { doc, domain, fieldsPath, fieldValues, /* resetFields */ } = this.props;
    const schema = getSchema(domain);

    return (
      <Page className="editDocument">
        <Form
          doc={doc}
          fieldValues={fieldValues}
          onFieldChange={this.onFieldChange}
          path={fieldsPath}
          schema={schema}
        />

        {/* <div className="actions">
          <Button modifier="large" onClick={this.deleteDoc}>Delete</Button>
        </div> */}
      </Page>
    );
  }
}

/* eslint-disable react/no-unused-prop-types */
EditDocument.propTypes = {
  id: PropTypes.string.isRequired,
  doc: PropTypes.object,
  actions: PropTypes.shape({
    onUpdate: PropTypes.func.isRequired,
  }),
  deleteDoc: PropTypes.func,
  domain: PropTypes.string,
  fieldsPath: PropTypes.array,
  fieldValues: PropTypes.object,
  resetFields: PropTypes.func,
  setField: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditDocument);
