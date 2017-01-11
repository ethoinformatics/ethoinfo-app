import React, { Component, PropTypes } from 'react';

class Select extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    const { value, onChange, options = [] } = this.props;

    return (
      <select className="fieldSelect">
        {
          options.map((option, ii) => {
            const isSelected = value && option && (option._id === value._id);

            return (<option
              key={`${ii}`}
              value={option && option.display ? option.display : ''}
              selected={isSelected}
              onChange={() => {
                if (option._id) {
                  this.onChange({ _id: option._id });
                } else {
                  this.onChange(null);
                }
              }}
            >
              {option ? option.name : ''}
            </option>);
          })
        }
      </select>
    );
  }
}

Select.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      _id: PropTypes.string.isRequired
    })
  )
};

export default Select;
