import React, { PropTypes } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { getAll as getAllDocs } from '../../redux/reducers/documents';
import { Types } from '../../schemas/schema';

import { getByPath as getFieldsByPath } from '../../redux/reducers/fields';

import Form from './form';
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
    fieldValue, // Current value of field
    initialValue, // Initial value of field
    isCollection,
    isLookup,
    name,
    options,
    onChange,
    path,
    type,
  } = props;

  // console.log('> Render field:', path, fieldValue);

  let fieldComponent = null;
  const normalizedValue = _.isNil(fieldValue) ? initialValue || null : fieldValue;

  let fieldProps = {
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

      // GEOLOCATION
      case Types.Geolocation:
        // If this is a geolocation track (a series of points, field is a switch
        // that marks tracking on and off.

        // If this is a single geolocation point, field is a button fieldComponent
        // which takes taps and returns geolocation points
        if (options.track) {
          fieldComponent = <BooleanField {...fieldProps} />;
        } else {
          fieldComponent = <Geo {...fieldProps} />;
        }

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

        /// HERE! This should be fields
        return (
          <Form
            path={path}
            doc={initialValue}
            fieldValues={fieldValue}
            schema={schema}
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
  fieldValue: PropTypes.any,
  options: PropTypes.object,
  path: PropTypes.array,
  isCollection: PropTypes.bool,
  isLookup: PropTypes.bool,
  initialValue: PropTypes.any,
  name: PropTypes.string,
  onChange: PropTypes.func,
  type: PropTypes.any
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Field);
