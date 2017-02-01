import React from 'react';
import { Button, Page } from 'react-onsenui';
import 'react-dates/lib/css/_datepicker.css';
import { connect } from 'react-redux';
import './documentForm.styl';
import Form from '../forms/form2';
import { update, deleteDoc as _deleteDoc } from '../../redux/actions/documents';
import { resetFields as resetFieldsAtPath } from '../../redux/actions/fields';
import { getSchema } from '../../schemas/main';
import { getByPath as getFieldsByPath } from '../../redux/reducers/fields';
import { getById } from '../../redux/reducers/documents';

const mapStateToProps = (state, ownProps) =>
  ({
    doc: getById(state.docs.byId, ownProps.id),
    fieldValues: getFieldsByPath(state.fields, ['edit', ownProps.id])
  });

const mapDispatchToProps = dispatch => ({
  updateDoc: (id, newValues) => dispatch(update(id, newValues)),
  deleteDoc: (id, rev) => dispatch(_deleteDoc(id, rev)),
  resetFields: path => dispatch(resetFieldsAtPath(path))

});

class EditDocument extends React.Component {
  constructor() {
    super();
    // Bind context so we can pass function to event handlers.
    this.saveFields = this.saveFields.bind(this);
    this.resetFields = this.resetFields.bind(this);
    this.deleteDoc = this.deleteDoc.bind(this);
  }

  deleteDoc() {
    const {
      actions,
      deleteDoc,
      doc,
      id,
      resetFields
    } = this.props;

    const path = ['edit', id];
    deleteDoc(doc._id, doc._rev)
    .then(() => {
      actions.onUpdate();
      resetFields(path);
    })
    .catch((err) => {
      console.log('Error saving new document:', err);
    });
  }

  resetFields() {
    const { id, resetFields } = this.props;
    const path = ['edit', id];
    resetFields(path);
  }

  saveFields() {
    const { actions, updateDoc, id, fieldValues, resetFields } = this.props;
    const path = ['edit', id];

    updateDoc(id, fieldValues)
    .then(() => {
      actions.onUpdate();
      resetFields(path);
    })
    .catch((err) => {
      console.log('Error saving new document:', err);
    });
  }

  render() {
    const { id, doc, domain, fieldValues } = this.props;
    const schema = getSchema(domain);
    const path = ['edit', id];

    return (
      <Page className="newDocument">
        <Form
          path={path}
          initialValues={doc}
          fieldValues={fieldValues}
          schema={schema}
        />
        <Button modifier="large" onClick={this.saveFields}>Save</Button>
        <Button modifier="large" onClick={this.resetFields}>Reset fields</Button>
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
  fieldValues: React.PropTypes.object,
  resetFields: React.PropTypes.func
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditDocument);
