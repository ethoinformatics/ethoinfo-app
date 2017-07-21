import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Field from './field';
import './fields.styl';

const mapStateToProps = () => ({});
const mapDispatchToProps = () => ({});

class Fields extends React.Component {
  constructor() {
    super();
    this.onFieldChange = this.onFieldChange.bind(this);
    this.renderField = this.renderField.bind(this);
  }

  // Field update
  // Path is a string or an array on nested objects
  onFieldChange(path, value) {
    const { onFieldChange } = this.props;
    onFieldChange(path, value);
  }

  renderField(field) {
    // These properties are defined per field by the model schema
    const { isCollection = false, isLookup = false, name, options = {}, type } = field;

    const { fieldValues, disabled, initialValues, path } = this.props;

    const fieldValue = fieldValues ? fieldValues[name] : null;
    const initialValue = initialValues ? initialValues[name] || null : null;
    const subpath = [...path, name];

    return (
      <Field
        disabled={disabled}
        fieldValue={fieldValue}
        initialValue={initialValue}
        isCollection={isCollection}
        isLookup={isLookup}
        onChange={this.onFieldChange}
        options={options}
        name={name}
        path={subpath}
        type={type}
      />
    );
  }

  render() {
    const { disabled, schema } = this.props;

    const isLockedMessage = disabled ?
      'Document is locked' : '';

    return (
      <div>
        <div className="isLockedMessage">
          {isLockedMessage}
        </div>
        <ol className="fields">
          { schema.fields.map(field =>
            (<li key={field.name}>
              { this.renderField(field) }
            </li>))
          }
        </ol>
      </div>
    );
  }
}

Fields.propTypes = {
  fieldValues: PropTypes.object, // Transient form values
  initialValues: PropTypes.object, // Values from model
  disabled: PropTypes.bool,
  onFieldChange: PropTypes.func,
  path: PropTypes.array,
  schema: PropTypes.object.isRequired,
};

Fields.defaultProps = {
  initialValues: {},
  disabled: false,
  onFieldChange: () => {},
  fieldValues: {}
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Fields);
