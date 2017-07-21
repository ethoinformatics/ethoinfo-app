import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Switch } from 'react-onsenui';

import './boolean.styl';

/**
 * Boolean input rendered as a switch
 *
 */

const BooleanInput = ({ value, name, onChange, disabled }) =>
  <div className="booleanInput">
    <label htmlFor={name}>{_.startCase(name)}</label>

    <Switch
      checked={value} disabled={disabled} onChange={(event) => {
        onChange(event.value);
      }}
    />
  </div>;

BooleanInput.defaultProps = {
  disabled: false,
  name: '',
  value: false,
};

BooleanInput.propTypes = {
  name: PropTypes.string,
  disabled: PropTypes.bool,
  value: PropTypes.bool,
  onChange: PropTypes.func.isRequired
};

export default BooleanInput;
