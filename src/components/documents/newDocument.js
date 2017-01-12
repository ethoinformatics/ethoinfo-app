import React from 'react';
import { observer } from 'mobx-react';
import { Button, Page } from 'react-onsenui';
import 'react-dates/lib/css/_datepicker.css';
import './documentForm.styl';
import Form from '../forms/form';

@observer
class NewDocument extends React.Component {
  constructor() {
    super();
    // Bind context so we can pass function to event handlers.
    this.saveFields = this.saveFields.bind(this);
    this.resetFields = this.resetFields.bind(this);
  }

  resetFields() {
    const { dataStore, domain } = this.props;
    const path = ['edit', domain];
    dataStore.resetFieldsAtPath(path);
  }

  saveFields() {
    const { dataStore, domain, actions } = this.props;
    const path = ['new', domain];
    dataStore.saveFieldsAtPath(path)
      .then(() => {
        dataStore.resetFieldsAtPath(path);
        actions.onCreate();
      })
      .catch((err) => {
        console.log(`Error creating code: ${name} =>`, err);
      });
  }

  render() {
    const { dataStore, domain, schema } = this.props;
    const path = ['new', domain];

    return (
      <Page className="newDocument">
        <Form
          path={path}
          schema={schema}
          dataStore={dataStore}
        />
        <Button modifier="large" onClick={this.saveFields}>Save</Button>
        <Button modifier="large" onClick={this.resetFields}>Reset fields</Button>
      </Page>
    );
  }
}

/* eslint-disable react/no-unused-prop-types */
NewDocument.propTypes = {
  dataStore: React.PropTypes.object,
  domain: React.PropTypes.string,
  schema: React.PropTypes.object,
  actions: React.PropTypes.shape({
    onCreate: React.PropTypes.func.isRequired,
  })
};
/* eslint-enable react/no-unused-prop-types */

export default NewDocument;
