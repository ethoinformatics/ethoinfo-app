import React, { PropTypes } from 'react';
import { observer } from 'mobx-react';
import { Button, Page } from 'react-onsenui';
import 'react-dates/lib/css/_datepicker.css';
import './documentForm.styl';
import Form from '../forms/form';

@observer
class EditDocument extends React.Component {
  constructor() {
    super();
    // Bind context so we can pass function to event handlers.
    this.updateDoc = this.updateDoc.bind(this);
    this.resetFields = this.resetFields.bind(this);
    this.deleteDoc = this.deleteDoc.bind(this);
  }

  deleteDoc() {
    const { actions, dataStore, doc, domain } = this.props;
    const path = ['edit', domain];
    dataStore.deleteDoc(doc._id, doc._rev)
      .then(() => {
        dataStore.resetFieldsAtPath(path);
        actions.onUpdate();
      })
      .catch(err => console.log(`Error deleting doc: ${name} =>`, err));
  }

  resetFields() {
    const { dataStore, domain } = this.props;
    const path = ['edit', domain];
    dataStore.resetFieldsAtPath(path);
  }

  updateDoc() {
    const { actions, dataStore, doc, domain } = this.props;
    const path = ['edit', domain];

    dataStore.updateDoc(doc._id, path)
    .then(() => {
      // console.log(`Success updating document: ${name}`);
      dataStore.resetFieldsAtPath(path);
      actions.onUpdate();
    })
    .catch(err => console.log(`Error updating doc: ${name} =>`, err));
  }

  render() {
    const { dataStore, domain, schema, doc } = this.props;
    const path = ['edit', domain];

    const formProps = {
      dataStore,
      path,
      schema,
      initialValues: doc
    };

    return (
      <Page className="newDocument">
        <Form {...formProps} />
        <Button modifier="large" onClick={this.updateDoc}>Save</Button>
        <Button modifier="large" onClick={this.resetFields}>Reset fields</Button>
        <Button modifier="large" onClick={this.deleteDoc}>Delete</Button>
      </Page>
    );
  }
}

/* eslint-disable react/no-unused-prop-types */
EditDocument.propTypes = {
  dataStore: PropTypes.object,
  doc: PropTypes.object,
  domain: PropTypes.string,
  schema: PropTypes.object,
  actions: PropTypes.shape({
    onUpdate: PropTypes.func.isRequired
  })
};
/* eslint-enable react/no-unused-prop-types */

export default EditDocument;
