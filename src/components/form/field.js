import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { getAll as getAllDocs } from '../../redux/reducers/documents';
import { Types } from '../../schemas/schema';

import { getByPath as getFieldsByPath } from '../../redux/reducers/fields';

// import BooleanField from './fields/boolean/boolean';
import CollectionField from './fields/collection/collection';
import DateField from './fields/date/date';
import Geo from './fields/geolocation/geolocation';
import GeoLineString from './fields/geolocation/linestring';
import Form from './';
import SelectField from './fields/select/select';
import TextInputField from './fields/text/input';

import { getSchema } from '../../schemas/main';

const mapStateToProps = (state, ownProps) =>
  ({
    docs: getAllDocs(state.docs),
    fields: state.fields,
    fieldValue: getFieldsByPath(state.fields, ownProps.path)
  });

const mapDispatchToProps = () => ({
});


class Field extends React.Component {
  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
  }

  onChange(value) {
    const { onChange, path } = this.props;
    onChange(path, value);
  }

  render() {
    const {
      docs,
      disabled,
      fieldValue, // Current value of field
      initialValue, // Initial value of field
      isCollection,
      isLookup,
      name,
      options,
      path,
      type,
    } = this.props;

    let fieldComponent = null;
    const normalizedValue = _.isNil(fieldValue) ? initialValue || null : fieldValue;

    // Todo: default field values?
    let fieldProps = {
      disabled,
      value: normalizedValue,
      initialValue,
      path,
      name,
      type,
      onChange: this.onChange,
      isLookup
    };

    let typeString = null;

    // For collections, enforce array value:
    if (isCollection) {
      fieldProps = {
        ...fieldProps,
        value: Array.isArray(normalizedValue) ? normalizedValue : [],
        initialValue: Array.isArray(initialValue) ? initialValue : [],
        onChange: (__path, value) => {
          // console.log('FIELD >> Collection on change', __path, value);
          this.props.onChange(__path, value);
        }
      };
      typeString = 'collection';
      fieldComponent = <CollectionField {...fieldProps} />;
    } else {
      switch (type.constructor) {

        // --------------------
        // DATE
        case Types.Date:
          typeString = 'date';
          fieldComponent = <DateField {...fieldProps} />;
          break;

        // --------------------
        // STRING
        case Types.String:
          typeString = 'string';
          fieldComponent = <TextInputField {...fieldProps} />;
          break;

        // --------------------
        // NUMBER
        case Types.Number:
          typeString = 'number';
          fieldComponent = <TextInputField {...fieldProps} />;
          break;

        // --------------------
        // GEOLOCATION
        case Types.Geolocation:
          typeString = 'geolocation';
          // If this is a geolocation track (a series of points, field is a switch
          // that marks tracking on and off.

          // If this is a single geolocation point, field is a button fieldComponent
          // which takes taps and returns geolocation points
          if (options.track) {
            /* fieldComponent = <BooleanField {...fieldProps} />; */
            fieldComponent = <GeoLineString {...fieldProps} />;
          } else {
            fieldComponent = <Geo {...fieldProps} />;
          }
          break;

        // --------------------
        // CATEGORY
        case Types.Category: {
          const { name: domainName } = type;
          const schema = getSchema(domainName);

          typeString = 'category';

          if (!schema) {
            fieldComponent = null;
          } else {
            const selectOptions = docs
            .filter(doc => doc.domainName === domainName)
            .map(doc => ({
              _id: doc._id,
              name: doc[schema.displayField] || doc.name || doc._id
            }));

            fieldComponent = (
              <SelectField options={[null, ...selectOptions]} {...fieldProps} />
            );
          }
        }
          break;

        // --------------------
        // MODEL
        case Types.Model: {
          const { name: domainName } = type;
          const schema = getSchema(domainName);
          if (!schema) { return null; }

          typeString = 'model';

          if (isLookup) {
            const selectOptions = docs
            .filter(doc => doc.domainName === domainName)
            .map(doc => ({
              _id: doc._id,
              name: doc[schema.displayField] || doc.name || doc._id
            }));

            fieldComponent = <SelectField options={[null, ...selectOptions]} {...fieldProps} />;
          } else {
            return (
              <Form
                path={path}
                doc={initialValue}
                disabled={disabled}
                fieldValues={fieldValue}
                onFieldChange={(_path, value) => {
                  this.props.onChange(_path, value);
                }}
                schema={schema}
              />
            );
          }
        }
          break;

        default:
          break;
      }
    }

    return (
      <div className={`field ${typeString}`}>
        {fieldComponent}
      </div>
    );
  }
}

Field.propTypes = {
  docs: PropTypes.arrayOf(
    PropTypes.object
  ).isRequired,
  disabled: PropTypes.bool,
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

Field.defaultProps = {
  disabled: false,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Field);
