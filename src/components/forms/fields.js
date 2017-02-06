import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Types } from '../../schemas/schema';

// Todo: consolidate export / import
import SelectField from './fields/select/select';
import TextInputField from './fields/text/input';
import DateField from './fields/date/date';
import CollectionField from './fields/collection/collection';
import Field from './field';

import { setField as setFieldAction } from '../../redux/actions/fields';
import { getAll as getAllDocs } from '../../redux/reducers/documents';
import { getSchema } from '../../schemas/main';

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

  makeSelect(field, props) {
    const { type } = field;
    const { name: domainName } = type;

    const schema = getSchema(domainName);

    if (!schema) {
      return null;
    }

    const { docs } = this.props;
    const options = docs
      .filter(doc => doc.domainName === domainName)
      .map(doc => ({
        _id: doc._id,
        name: doc[schema.displayField] || doc.name || doc._id
      }));

    return <SelectField options={[null, ...options]} {...props} />;
  }

  renderCollectionField(field) {

  }

  // Recursive field renderer
  renderField(field) {
    const { initialValues = {}, fieldValues = {} } = this.props;
    const { name, type, isCollection = false, isLookup = false } = field;

    const isEditing = !_.isNil(fieldValues[name]);

    const fieldValue = fieldValues[name];
    const initialValue = initialValues ? initialValues[name] || null : null;

    const value = isEditing ? fieldValue : initialValue;
    let formField = null;

    const props = {
      value,
      onChange: val => this.onFieldChange(name, val)
    };

    switch (type.constructor) {
      case Types.Date:
        formField = <DateField {...props} />;
        break;

      case Types.String:
        formField = <TextInputField {...props} />;
        break;

      case Types.Number:
        break;

      case Types.Category:
        formField = this.makeSelect(field, props);
        break;

      case Types.Model:
        if (isLookup) {
          formField = this.makeSelect(field, props);
          break;
        }

        if (isCollection) {
          formField = <CollectionField domain={type.name} />;
          break;
        }

        break;
      default:
        break;
    }

    return formField;
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
  docs: PropTypes.arrayOf(
    PropTypes.object
  ).isRequired,
  /* path: PropTypes.arrayOf( // Update path in state.fields
    PropTypes.string
  ).isRequired, */
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
