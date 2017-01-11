import React, { Component, PropTypes } from 'react';
import { SingleDatePicker } from 'react-dates';
import moment from 'moment';

class DateField extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    const { value, onChange } = this.props;

    const date = value ? moment(value) : moment();

    return (<SingleDatePicker
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
    />);
  }
}

DateField.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func
};

export default DateField;
