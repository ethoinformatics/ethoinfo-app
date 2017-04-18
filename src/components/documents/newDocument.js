import React from 'react';
import { Button, Page } from 'react-onsenui';
import 'react-dates/lib/css/_datepicker.css';
import { connect } from 'react-redux';
import './documentForm.styl';
import Form from '../forms/form';

// Actions
import { create } from '../../redux/actions/documents';
import { resetFields as resetFieldsAtPath } from '../../redux/actions/fields';

// Selectors
import { getSchema } from '../../schemas/main';
import { getByPath as getFieldsByPath } from '../../redux/reducers/fields';

const mapStateToProps = (state, ownProps) =>
  ({
    docs: state.docs,
    fieldValues: getFieldsByPath(state.fields, ownProps.fieldsPath)
  });

const mapDispatchToProps = (dispatch, ownProps) => ({
  createDoc: (doc, domainName) => dispatch(create(doc, domainName)),
  resetFields: () => dispatch(resetFieldsAtPath(ownProps.fieldsPath))
});

class NewDocument extends React.Component {
  constructor() {
    super();
    // Bind context so we can pass function to event handlers.
    this.saveFields = this.saveFields.bind(this);
  }

  saveFields() {
    const { actions, createDoc, domain, fieldValues, resetFields } = this.props;
    const schema = getSchema(domain);

    createDoc(fieldValues, schema.name)
    .then(() => {
      actions.onCreate();
      resetFields();
    })
    .catch((err) => {
      console.log('Error saving new document:', err);
    });
  }

  render() {
    const { domain, fieldsPath, fieldValues, resetFields } = this.props;
    const schema = getSchema(domain);

    return (
      <Page className="newDocument">
        <Form
          path={fieldsPath}
          fieldValues={fieldValues}
          schema={schema}
        />
        <Button modifier="large" onClick={this.saveFields}>Save</Button>
        <Button modifier="large" onClick={resetFields}>Reset fields</Button>
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
  fieldsPath: React.PropTypes.array,
  fieldValues: React.PropTypes.object,
  resetFields: React.PropTypes.func
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewDocument);
