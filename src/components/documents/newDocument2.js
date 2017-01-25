import React from 'react';
import { Button, Page } from 'react-onsenui';
import 'react-dates/lib/css/_datepicker.css';
import { connect } from 'react-redux';
import './documentForm.styl';
import Form from '../forms/form2';

// import { fetchAll as fetchAllDocuments } from '../../redux/actions/documents';

import { getSchema } from '../../schemas/main';
import { getByPath as getFieldsByPath } from '../../redux/reducers/fields';

const mapStateToProps = (state, ownProps) =>
  ({
    docs: state.docs,
    fieldValues: getFieldsByPath(state.fields, ['new', ownProps.domain])
  });

class NewDocument extends React.Component {
  constructor() {
    super();
    // Bind context so we can pass function to event handlers.
    this.saveFields = this.saveFields.bind(this);
    this.resetFields = this.resetFields.bind(this);
  }

  resetFields() {
    const { domain } = this.props;
    const path = ['edit', domain];
    // dataStore.resetFieldsAtPath(path);
  }

  saveFields() {
    const { domain, actions } = this.props;
    const path = ['new', domain];

    console.log('>>> Should save fields >>>');
    console.log(path);
    console.log('<<<');

    /* dataStore.saveFieldsAtPath(path)
      .then(() => {
        dataStore.resetFieldsAtPath(path);
        actions.onCreate();
      })
      .catch((err) => {
        console.log(`Error creating code: ${name} =>`, err);
      }); */
  }

  render() {
    const { domain, fieldValues } = this.props;
    const schema = getSchema(domain);
    const path = ['new', domain];
    console.log('FORM VALUES:');
    console.log(this.props.fieldValues);

    return (
      <Page className="newDocument">
        <Form
          path={path}
          fieldValues={fieldValues}
          schema={schema}
        />
        <Button modifier="large" onClick={this.saveFields}>Save</Button>
        <Button modifier="large" onClick={this.resetFields}>Reset fields</Button>
      </Page>
    );
  }
}

/* eslint-disable react/no-unused-prop-types */
NewDocument.propTypes = {
  domain: React.PropTypes.string,
  actions: React.PropTypes.shape({
    onCreate: React.PropTypes.func.isRequired,
  })
};

export default connect(
  mapStateToProps
)(NewDocument);
