import React from 'react';
import { connect } from 'react-redux';

// Components
import { Button, Page } from 'react-onsenui';
import Form from '../forms/form';
import Breadcrumbs from '../breadcrumbs/breadcrumbs';

import './documentForm.styl';

import { getSchema } from '../../schemas/main';

// Actions
import { update, deleteDoc as _deleteDoc } from '../../redux/actions/documents';
import { resetFields as resetFieldsAtPath } from '../../redux/actions/fields';

// Selectors
import { getByPath as getFieldsByPath } from '../../redux/reducers/fields';
import { getById } from '../../redux/reducers/documents';

const mapStateToProps = (state, ownProps) =>
  ({
    doc: getById(state.docs.byId, ownProps.id),
    fieldValues: getFieldsByPath(state.fields, ownProps.fieldsPath)
  });

const mapDispatchToProps = (dispatch, ownProps) => ({
  updateDoc: (id, newValues) => dispatch(update(id, newValues)),
  deleteDoc: (id, rev) => dispatch(_deleteDoc(id, rev)),
  resetFields: () => dispatch(resetFieldsAtPath(ownProps.fieldsPath))

});

class EditDocument extends React.Component {
  constructor() {
    super();
    // Bind context so we can pass function to event handlers.
    this.saveFields = this.saveFields.bind(this);
    this.deleteDoc = this.deleteDoc.bind(this);
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

  saveFields() {
    const { actions, updateDoc, id, fieldValues, resetFields } = this.props;

    updateDoc(id, fieldValues)
    .then(() => {
      actions.onUpdate();
      resetFields();
    })
    .catch((err) => {
      console.log('Error saving new document:', err);
    });
  }

  render() {
    const { doc, domain, fieldsPath, fieldValues, resetFields } = this.props;
    const schema = getSchema(domain);

    return (
      <Page className="newDocument">
        <Breadcrumbs path={fieldsPath} />
        <Form
          path={fieldsPath}
          initialValues={doc}
          fieldValues={fieldValues}
          schema={schema}
        />
        <Button modifier="large" onClick={this.saveFields}>Save</Button>
        <Button modifier="large" onClick={resetFields}>Reset fields</Button>
        <Button modifier="large" onClick={this.deleteDoc}>Delete</Button>
      </Page>
    );
  }
}

/* eslint-disable react/no-unused-prop-types */
EditDocument.propTypes = {
  id: React.PropTypes.string.isRequired,
  doc: React.PropTypes.object,
  actions: React.PropTypes.shape({
    onUpdate: React.PropTypes.func.isRequired,
  }),
  deleteDoc: React.PropTypes.func,
  updateDoc: React.PropTypes.func,
  domain: React.PropTypes.string,
  fieldsPath: React.PropTypes.array,
  fieldValues: React.PropTypes.object,
  resetFields: React.PropTypes.func
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditDocument);
