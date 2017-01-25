import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Types } from '../../schemas/schema';

// Todo: consolidate export / import
import SelectField from './fields/select/select';
import TextInputField from './fields/text/input';
import DateField from './fields/date/date';
import CollectionField from './fields/collection/collection';

import { setField as setFieldAction } from '../../redux/actions/fields';
import { getAll as getAllDocs } from '../../redux/reducers/documents';
import { getSchema } from '../../schemas/main';

import './form.styl';

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

class Form extends React.Component {
    // Field update
  // Path is a string or an array on nested objects
  onFieldChange(name, value) {
    const { path, setField } = this.props;
    console.log(path, name, value);
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

  // Recursive field renderer
  renderField(field) {
    const { initialValues = {}, fieldValues = {} } = this.props;
    const { name, type, isCollection = false, isLookup = false } = field;
    const value = fieldValues[name] || initialValues[name] || null;

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
          // Get schema for the lookup domain
          /* const lookupSchema = dataStore.getSchema(type.name) || [];
          if (!lookupSchema) { break; } // throw error?

          // type.name is domain name
          const optionDocs = dataStore.getData(type.name) || [];

          // Todo: move this to datastore
          const modelOptions = toJS(optionDocs).slice()
            .filter(optionDoc => optionDoc._id)
            . map((optionDoc) => {
              const displayKey = lookupSchema.displayField;
              return {
                _id: optionDoc._id,
                name: optionDoc[displayKey] || optionDoc._id
              };
            });

          const modelSelectOptions = [null, ...modelOptions];*/


          const modelSelectOptions = [];
          formField = this.makeSelect(field, props);
          break;
        }

        if (isCollection) {
          formField = <CollectionField domain={type.name} />;
        }

        break;
      default:
        break;
    }

    return formField;
  }

  render() {
    const { schema } = this.props;

    return (
      <div className="form">
        <ol className="formFields">
          {
            schema.fields.map((field, index) =>
              <li className="field" key={index}>
                <label htmlFor={field.name}>{_.startCase(field.name)}</label>
                { this.renderField(field) }
              </li>
            )
          }
        </ol>
      </div>
    );
  }
}

Form.propTypes = {
  docs: PropTypes.arrayOf(
    PropTypes.object
  ).isRequired,
  path: PropTypes.arrayOf(
    PropTypes.string
  ).isRequired,
  initialValues: PropTypes.object,
  fieldValues: PropTypes.object,
  schema: PropTypes.object.isRequired,
  setField: PropTypes.func
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Form);
