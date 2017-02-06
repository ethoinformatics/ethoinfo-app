import React, { PropTypes } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { getAll as getAllDocs } from '../../redux/reducers/documents';
import { Types } from '../../schemas/schema';

import { getByPath as getFieldsByPath } from '../../redux/reducers/fields';

import Fields from './fields';
import TextInputField from './fields/text/input';
import DateField from './fields/date/date';
import CollectionField from './fields/collection/collection';
import SelectField from './fields/select/select';

import { getSchema } from '../../schemas/main';

const mapStateToProps = (state, ownProps) =>
  ({
    docs: getAllDocs(state.docs),
    fields: state.fields,
    fieldValue: getFieldsByPath(state.fields, ownProps.path)
  });

const mapDispatchToProps = () => ({
});

const Field = (props) => {
  console.log('Render field:', props);
  const {
    docs,
    // value,
    path,
    type,
    name,
    isCollection,
    isLookup,
    onChange,
    initialValue,
    fieldValue
  } = props;

  let fieldComponent = null;
  let normalizedValue = _.isNil(fieldValue) ? initialValue || null : fieldValue;

  let fieldProps = {
    // value,
    value: normalizedValue,
    initialValue,
    path,
    name,
    type,
    onChange,
    isLookup
  };

  if (isCollection) {
    // Make sure value is an array or set to empty array.
    normalizedValue = Array.isArray(fieldProps.value) ? fieldProps.value : [];

    fieldProps = {
      ...fieldProps,
      value: normalizedValue,
    };

    fieldComponent = <CollectionField {...fieldProps} />;
  } else {
    switch (type.constructor) {
      case Types.Date:
        fieldComponent = <DateField {...fieldProps} />;
        break;

      case Types.String:
        fieldComponent = <TextInputField {...fieldProps} />;
        break;

      case Types.Number:
        fieldComponent = <TextInputField {...fieldProps} />;
        break;

      case Types.Category:
        // fieldComponent = this.makeSelect(field, fieldProps);
        break;

      case Types.Model: {
        const { name: domainName } = type;
        const schema = getSchema(domainName);
        if (!schema) { return null; }

        if (isLookup) {
          const options = docs
          .filter(doc => doc.domainName === domainName)
          .map(doc => ({
            _id: doc._id,
            name: doc[schema.displayField] || doc.name || doc._id
          }));

          return <SelectField options={[null, ...options]} {...fieldProps} />;
        }

        return (
          <Fields
            path={path}
            schema={schema}
            initialValues={fieldProps.value}
          />
        );
      }

      default:
        break;
    }
  }


  return (
    <div className="field">
      <div>{fieldComponent}</div>
    </div>
  );
};

Field.propTypes = {
  docs: PropTypes.arrayOf(
    PropTypes.object
  ).isRequired,
  /* path: PropTypes.arrayOf( // Update path in state.fields
    PropTypes.string
  ), */
  path: PropTypes.array,
  isCollection: PropTypes.bool,
  isLookup: PropTypes.bool,
  value: PropTypes.any, // Transient form values
  onChange: PropTypes.func,
};



export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Field);


