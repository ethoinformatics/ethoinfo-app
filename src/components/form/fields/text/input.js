import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

const TextInput = ({ value, name, onChange }) =>
  <div>
    <label htmlFor={name}>{_.startCase(name)}</label>
    <input
      type="text"
      value={value || ''}
      onChange={(e) => {
        onChange(e.target.value);
        e.preventDefault();
      }
      }
      style={{ width: '100%' }}
    />
  </div>;

TextInput.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func
};

export default TextInput;
