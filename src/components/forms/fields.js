import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Field from './field';
import { setField as setFieldAction } from '../../redux/actions/fields';
import './fields.styl';

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  setField: (path, value) => {
    dispatch(setFieldAction(path, value));
  }
});

class Fields extends React.Component {
  constructor() {
    super();
    this.onFieldChange = this.onFieldChange.bind(this);
    this.renderField = this.renderField.bind(this);
  }

  // Field update
  // Path is a string or an array on nested objects
  onFieldChange(name, value) {
    console.log('&&& onFieldChange', name, value);
    const { path, setField } = this.props;
    setField([...path, name], value);
  }

  renderField(field) {
    // These properties are defined per field by the model schema
    const { isCollection = false, isLookup = false, name, options = {}, type } = field;

    const { fieldValues, initialValues, path } = this.props;

    const fieldValue = fieldValues ? fieldValues[name] : null;
    const initialValue = initialValues ? initialValues[name] || null : null;
    const subpath = [...path, name];

    return (
      <Field
        fieldValue={fieldValue}
        initialValue={initialValue}
        isCollection={isCollection}
        isLookup={isLookup}
        onChange={val => this.onFieldChange(name, val)}
        options={options}
        name={name}
        path={subpath}
        type={type}
      />
    );
  }

  render() {
    const { schema } = this.props;

    // console.log('>>> Render fields:', this.props.path);

    return (
      <div>
        <ol className="fields">
          { schema.fields.map((field, index) =>
            (<li className="field" key={index}>
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
  path: PropTypes.array,
  schema: PropTypes.object.isRequired,
  setField: PropTypes.func
};

Fields.defaultProps = {
  initialValues: {},
  fieldValues: {}
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Fields);
