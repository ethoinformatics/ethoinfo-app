import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

class Select extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    const { disabled, name, onChange, options = [], value } = this.props;
    const normalizedValue = value ? value._id : '';
    return (
      <div>
        <label htmlFor={name}>{_.startCase(name)}</label>
        <select
          className="fieldSelect"
          disabled={disabled}
          value={normalizedValue}
          onChange={(e) => {
            if (e.target.value) {
              onChange({ _id: e.target.value });
            } else {
              onChange(null);
            }
          }}
        >
          {
            options.map((option, ii) =>
              <option
                key={`${ii}`}
                value={option && option._id ? option._id : ''}
              >
                {option ? option.name : ''}
              </option>
            )
          }
        </select>
      </div>
    );
  }
}

/* eslint-disable react/no-unused-prop-types */
Select.propTypes = {
  disabled: PropTypes.bool,
  value: PropTypes.shape({
    name: PropTypes.string,
    _id: PropTypes.string
  }),
  name: PropTypes.string,
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      _id: PropTypes.string.isRequired
    })
  )
};
/* eslint-enable react/no-unused-prop-types */

Select.defaultProps = {
  disabled: false,
};

export default Select;
