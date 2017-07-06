import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Components
import { Page } from 'react-onsenui';
import Form from '../../form';

// Styles
import './editDocument.styl';

// Helpers
import { getSchema } from '../../../schemas/main';

// Actions
import { setField as setFieldAction } from '../../../redux/actions/fields';

// Selectors
import { getByPath as getFieldsByPath } from '../../../redux/reducers/fields';
import { makeGetById } from '../../../redux/selectors/documents';

const getById = makeGetById();

// Redux setup
const mapStateToProps = (state, ownProps) =>
  ({
    doc: getById(state, ownProps),
    fieldValues: getFieldsByPath(state.fields, ownProps.fieldsPath)
  });

const mapDispatchToProps = dispatch => ({
  setField: (path, value) => {
    dispatch(setFieldAction(path, value));
  }
});

class EditDocument extends React.Component {
  constructor() {
    super();

    // Bind context.
    this.onFieldChange = this.onFieldChange.bind(this);
  }

  onFieldChange(path, value) {
    const { setField } = this.props;
    setField(path, value);
  }

  render() {
    const { doc, domain, fieldsPath, fieldValues, /* resetFields */ } = this.props;
    const schema = getSchema(domain);

    console.log('Rendering Edit doc:', doc);

    return (
      <Page className="editDocument">
        <Form
          doc={doc}
          fieldValues={fieldValues}
          onFieldChange={this.onFieldChange}
          path={fieldsPath}
          schema={schema}
        />
      </Page>
    );
  }
}

/* eslint-disable react/no-unused-prop-types */
EditDocument.propTypes = {
  id: PropTypes.string.isRequired,
  doc: PropTypes.object,
  domain: PropTypes.string.isRequired,
  fieldsPath: PropTypes.array.isRequired,
  fieldValues: PropTypes.object,
  setField: PropTypes.func.isRequired
};

EditDocument.defaultProps = {
  doc: null,
  fieldValues: null,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditDocument);
