import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

const TextInput = ({ disabled, name, onChange, value }) =>
  <div>
    <label htmlFor={name}>{_.startCase(name)}</label>
    <input
      disabled={disabled}
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
  disabled: PropTypes.bool,
  name: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func
};

TextInput.defaultProps = {
  disabled: false,
};

export default TextInput;
