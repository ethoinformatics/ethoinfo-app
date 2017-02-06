import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Field from './field';
import { setField as setFieldAction } from '../../redux/actions/fields';
import { getAll as getAllDocs } from '../../redux/reducers/documents';
import './fields.styl';

const mapStateToProps = state =>
  ({
    docs: getAllDocs(state.docs),
    fields: state.fields
  });

const mapDispatchToProps = dispatch => ({
  setField: (path, value) => {
    dispatch(setFieldAction(path, value));
  }
});

class Fields extends React.Component {
    // Field update
  // Path is a string or an array on nested objects
  onFieldChange(name, value) {
    const { path, setField } = this.props;
    setField([...path, name], value);
  }

  render() {
    const {
      fieldValues = {},
      initialValues = {},
      schema,
      path,
    } = this.props;

    return (
      <div>
        <ol className="fields">
          {
            schema.fields.map((field, index) => {
              const { name, isCollection = false, isLookup = false, type } = field;

              const fieldValue = fieldValues[name];
              const initialValue = initialValues ? initialValues[name] || null : null;
              const subpath = [...path, name];

              return (
                <li className="field" key={index}>
                  <Field
                    initialValue={initialValue}
                    fieldValue={fieldValue}
                    // value={value}
                    name={name}
                    path={subpath}
                    type={type}
                    isCollection={isCollection}
                    isLookup={isLookup}
                    onChange={val => this.onFieldChange(name, val)}
                  />
                </li>
              );
            })
          }
        </ol>
      </div>
    );
  }
}

Fields.propTypes = {
  path: PropTypes.array,
  initialValues: PropTypes.object, // Values from model
  fieldValues: PropTypes.object, // Transient form values
  schema: PropTypes.object.isRequired,
  setField: PropTypes.func
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Fields);
