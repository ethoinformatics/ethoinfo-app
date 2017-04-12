import React, { PropTypes } from 'react';
import _ from 'lodash';
import { Switch } from 'react-onsenui';

/**
 * Boolean input rendered as a switch
 *
 */

const BooleanInput = ({ value, name, onChange }) =>
  <div>
    <label htmlFor={name}>{_.startCase(name)}</label>

    <Switch
      checked={value} onChange={(event) => {
        onChange(event.value);
      }}
    />
  </div>;

BooleanInput.defaultProps = {
  name: '',
  value: false,
};

BooleanInput.propTypes = {
  name: PropTypes.string,
  value: PropTypes.bool,
  onChange: PropTypes.func.isRequired
};

export default BooleanInput;