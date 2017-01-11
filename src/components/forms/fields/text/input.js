import React, { PropTypes } from 'react';

const TextInput = ({ value, onChange, ...rest }) =>
  <input
    type="text"
    value={value || ''}
    onChange={(e) => {
      onChange(e.target.value);
      e.preventDefault();
    }
    }
    style={{ width: '100%' }}
    {...rest}
  />;

TextInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func
};

export default TextInput;
