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
import BooleanField from './fields/boolean/boolean';

import Geo from './fields/geolocation/geolocation';

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
  const {
    docs,
    path,
    type,
    name,
    isCollection,
    isLookup,
    options,
    onChange,
    initialValue,
    fieldValue
  } = props;

  let fieldComponent = null;
  const normalizedValue = _.isNil(fieldValue) ? initialValue || null : fieldValue;

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

  // For collections, enforce array value:
  if (isCollection) {
    fieldProps = {
      ...fieldProps,
      value: Array.isArray(normalizedValue) ? normalizedValue : [],
      initialValue: Array.isArray(initialValue) ? initialValue : []
    };

    fieldComponent = <CollectionField {...fieldProps} />;
  } else {
    switch (type.constructor) {
      // DATE
      case Types.Date:
        fieldComponent = <DateField {...fieldProps} />;
        break;

      // STRING
      case Types.String:
        fieldComponent = <TextInputField {...fieldProps} />;
        break;

      // NUMBER
      case Types.Number:
        fieldComponent = <TextInputField {...fieldProps} />;
        break;

      case Types.Geolocation:
        // If this is a geolocation track, field is a switch that turns tracking on and off.

        console.log('Rendering geolocation:', options);

        // If this is a geolocation point, field is a button
        // which calls the geolocation API or allows user to manually input position
        // fieldComponent = <BooleanField {...fieldProps} />;
        fieldComponent = <Geo {...fieldProps} />;
        break;

      // CATEGORY
      case Types.Category: {
        const { name: domainName } = type;
        const schema = getSchema(domainName);
        if (!schema) { return null; }

        const selectOptions = docs
          .filter(doc => doc.domainName === domainName)
          .map(doc => ({
            _id: doc._id,
            name: doc[schema.displayField] || doc.name || doc._id
          }));

        return <SelectField options={[null, ...selectOptions]} {...fieldProps} />;
      }

      // MODEL
      case Types.Model: {
        const { name: domainName } = type;
        const schema = getSchema(domainName);
        if (!schema) { return null; }

        if (isLookup) {
          const selectOptions = docs
          .filter(doc => doc.domainName === domainName)
          .map(doc => ({
            _id: doc._id,
            name: doc[schema.displayField] || doc.name || doc._id
          }));

          return <SelectField options={[null, ...selectOptions]} {...fieldProps} />;
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
  options: PropTypes.object,
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


