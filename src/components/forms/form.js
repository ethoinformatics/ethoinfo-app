import React, { PropTypes } from 'react';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import { Types } from '../../schemas/schema';

// Todo: consolidate export / import
import SelectField from './fields/select/select';
import TextInputField from './fields/text/input';
import DateField from './fields/date/date';

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
    const { dataStore, path } = this.props;

    const { name, type } = field;
    const value = dataStore.getField([...path, name]);

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
                <label htmlFor={field.name}>{field.name}</label>
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
  schema: PropTypes.object.isRequired, // eslint-disable-line  react/forbid-prop-types
  // data: PropTypes.object, // eslint-disable-line  react/forbid-prop-types
  dataStore: PropTypes.object.isRequired // eslint-disable-line  react/forbid-prop-types
};

export default Form;
