// Pouch uses underscore ids

import React, { PropTypes } from 'react';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import _ from 'lodash';
import { Types } from '../../schemas/schema';

// Todo: consolidate export / import
import SelectField from './fields/select/select';
import TextInputField from './fields/text/input';
import DateField from './fields/date/date';
import CollectionField from './fields/collection/collection';

import './form.styl';

@observer
class Form extends React.Component {
    // Field update
  // Path is a string or an array on nested objects
  onFieldChange(name, value) {
    const { dataStore, path } = this.props;
    dataStore.setField([...path, name], value);
  }

  // Recursive field renderer
  renderField(field) {
    const { dataStore, path, initialValues = {} } = this.props;
    const { name, type, isCollection = false, isLookup = false } = field;
    const fieldValue = toJS(dataStore.getField([...path, name]));
    const modelValue = toJS(initialValues)[name];

    // Take fieldValue if it exists otherwise use modelValue
    const value = fieldValue || modelValue;

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
      case Types.Category: // eslint-disable-line  no-case-declarations
        const domainName = type.name;
        const options = [null, ...(dataStore.getData(domainName) || [])];
        formField = <SelectField options={options} {...props} />;
        break;
      case Types.Model:
        if (isLookup) {
          // Get schema for the lookup domain
          const lookupSchema = dataStore.getSchema(type.name) || [];
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

          const modelSelectOptions = [null, ...modelOptions];
          formField = <SelectField options={modelSelectOptions} {...props} />;
          break;
        }

        if (isCollection) {
          formField = <CollectionField domain={type.name} />;
          // console.log(`${name} field is a collection`);
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
            toJS(schema).fields.map((field, index) =>
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
  path: PropTypes.arrayOf(
    PropTypes.string
  ).isRequired,
  initialValues: PropTypes.object,
  schema: PropTypes.object.isRequired,
  dataStore: PropTypes.object.isRequired
};

export default Form;
