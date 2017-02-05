import React from 'react';
import { Button, Page, Modal } from 'react-onsenui';
import 'react-dates/lib/css/_datepicker.css';
import { connect } from 'react-redux';
import './documentForm.styl';
import Form from '../forms/form';
import { create } from '../../redux/actions/documents';
import { resetFields as resetFieldsAtPath } from '../../redux/actions/fields';
import { getSchema } from '../../schemas/main';
import { getByPath as getFieldsByPath } from '../../redux/reducers/fields';

const mapStateToProps = (state, ownProps) =>
  ({
    docs: state.docs,
    fieldValues: getFieldsByPath(state.fields, ['new', ownProps.domain])
  });

const mapDispatchToProps = dispatch => ({
  createDoc: (doc, schema) => dispatch(create(doc, schema)),
  resetFields: path => dispatch(resetFieldsAtPath(path))

});

class NewDocument extends React.Component {
  constructor() {
    super();
    // Bind context so we can pass function to event handlers.
    this.saveFields = this.saveFields.bind(this);
    this.resetFields = this.resetFields.bind(this);
  }

  resetFields() {
    const { domain, resetFields } = this.props;
    const path = ['new', domain];
    resetFields(path);
  }

  saveFields() {
    const { actions, createDoc, domain, fieldValues, resetFields } = this.props;
    const path = ['new', domain];

    const schema = getSchema(domain);

    createDoc(fieldValues, schema)
    .then(() => {
      actions.onCreate();
      resetFields(path);
    })
    .catch((err) => {
      console.log('Error saving new document:', err);
    });
  }

  render() {
    const { domain, fieldValues } = this.props;
    const schema = getSchema(domain);
    const path = ['new', domain];

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
  actions: React.PropTypes.shape({
    onCreate: React.PropTypes.func.isRequired,
  }),
  createDoc: React.PropTypes.func,
  domain: React.PropTypes.string,
  fieldValues: React.PropTypes.object,
  resetFields: React.PropTypes.func
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewDocument);
