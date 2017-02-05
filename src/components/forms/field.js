import React, { PropTypes } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { getAll as getAllDocs } from '../../redux/reducers/documents';
import { setField as setFieldAction } from '../../redux/actions/fields';
import { Types } from '../../schemas/schema';

// import SelectField from './fields/select/select';
import TextInputField from './fields/text/input';
import DateField from './fields/date/date';
import CollectionField from './fields/collection/collection';

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

const Field = (props) => {
  const {
    initialValue,
    value,
    path,
    type,
    name,
    isCollection,
    isLookup,
    onChange
  } = props;

  // console.log('Field Props', name, props);

  let fieldComponent = null;
  let normalizedValue = value;

  let fieldProps = {
    value: value || initialValue || null,
    path,
    type,
    onChange,
    isLookup
  };

  if (isCollection) {
    // Make sure value is an array or set to empty array.
    normalizedValue = Array.isArray(value) ? value : [];

    // Push an empty value to the end of the array
    normalizedValue = normalizedValue.filter(v => v !== null);
    normalizedValue = [...normalizedValue, null];
    // console.log('value:', normalizedValue);

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
        break;

      case Types.Category:
        // fieldComponent = this.makeSelect(field, fieldProps);
        break;

      case Types.Model:
        /* if (isLookup) {
          fieldComponent = this.makeSelect(field, props);
          break;
        }

        if (isCollection) {
          console.log('Rendering collection');
          fieldComponent = <CollectionField domain={type.name} />;
        }*/

        break;
      default:
        break;
    }
  }


  return (
    <div>
      <label htmlFor={name}>{_.startCase(name)}</label>
      <div>{path ? path.join(',') : 'No path specified'}</div>
      <div>{fieldComponent}</div>
    </div>
  );
};

Field.propTypes = {
  docs: PropTypes.arrayOf(
    PropTypes.object
  ).isRequired,
  path: PropTypes.arrayOf( // Update path in state.fields
    PropTypes.string
  ),
  isCollection: PropTypes.bool,
  isLookup: PropTypes.bool,
  value: PropTypes.any, // Transient form values
  setField: PropTypes.func,
  onChange: PropTypes.func,
};



export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Field);


