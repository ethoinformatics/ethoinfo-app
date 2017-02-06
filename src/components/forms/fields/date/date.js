import React, { Component, PropTypes } from 'react';
import { SingleDatePicker } from 'react-dates';
import moment from 'moment';
import _ from 'lodash';

class DateField extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    const { value, name, onChange } = this.props;

    const date = value ? moment(value) : null;

    return (
      <div>
        <label htmlFor={name}>{_.startCase(name)}</label>
        <SingleDatePicker
          date={date}
          focused={this.state.focused}
          onDateChange={(newDate) => {
            console.log(newDate);
            onChange(newDate.utc().format());
          }}
          onFocusChange={({ focused }) => { this.setState({ focused }); }}
          numberOfMonths={1}
          isOutsideRange={() => false}
          withPortal
          id={`SingleDatePicker-${value}`}
        />
      </div>);
  }
}

DateField.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func
};

export default DateField;
