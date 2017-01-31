import React, { Component, PropTypes } from 'react';

class Select extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    const { value, onChange, options = [] } = this.props;
    const normalizedValue = value ? value._id : '';
    return (
      <select
        className="fieldSelect"
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
    );
  }
}

/* eslint-disable react/no-unused-prop-types */
Select.propTypes = {
  value: PropTypes.shape({
    name: PropTypes.string,
    _id: PropTypes.string
  }),
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      _id: PropTypes.string.isRequired
    })
  )
};
/* eslint-enable react/no-unused-prop-types */

export default Select;