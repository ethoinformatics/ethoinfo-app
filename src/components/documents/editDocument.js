import React from 'react';
import { observer } from 'mobx-react';
import { Button, Page } from 'react-onsenui';
import 'react-dates/lib/css/_datepicker.css';
import './documentForm.styl';
import Form from '../forms/form';

@observer
class EditDocument extends React.Component {
  render() {
    const { dataStore, domain, schema, actions, doc } = this.props;
    const path = ['edit', domain];

    return (
      <Page className="newDocument">
        <Form
          path={path}
          schema={schema}
          initialValues={doc}
          dataStore={dataStore}
        />
        <Button
          modifier="large"
          onClick={() => {
            // console.log(doc._id, path);
            dataStore.updateDoc(doc._id, path)
              .then(() => {
                console.log(`Success updating document: ${name}`);
                dataStore.resetFieldsAtPath(path);
                actions.onUpdate();
              })
              .catch((err) => {
                console.log(`Error updating doc: ${name} =>`, err);
              });
          }}
        >Save</Button>
        <Button
          modifier="large"
          style={{ backgroundColor: '#666' }}
          onClick={() => {
            dataStore.resetFieldsAtPath(path);
          }}
        >Reset fields</Button>
        <Button
          modifier="large"
          style={{ backgroundColor: '#FF5722' }}
          onClick={() => {
            dataStore.deleteDoc(doc._id, doc._rev)
            .then(() => {
              console.log(`Success updating document: ${name}`);
              dataStore.resetFieldsAtPath(path);
              actions.onUpdate();
            })
            .catch((err) => {
              console.log(`Error updating doc: ${name} =>`, err);
            });
          }}
        >Delete</Button>
      </Page>
    );
  }
}

/* eslint-disable react/no-unused-prop-types */
EditDocument.propTypes = {
  dataStore: React.PropTypes.object,
  doc: React.PropTypes.object,
  domain: React.PropTypes.string,
  schema: React.PropTypes.object,
  actions: React.PropTypes.shape({
    onUpdate: React.PropTypes.func.isRequired
  })
};
/* eslint-enable react/no-unused-prop-types */

export default EditDocument;
