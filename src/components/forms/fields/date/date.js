import React, { Component, PropTypes } from 'react';
import { SingleDatePicker } from 'react-dates';

class DateField extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    const { value, onChange } = this.props;

    return (<SingleDatePicker
      date={value || null}
      focused={this.state.focused}
      onDateChange={(date) => { onChange({ date }); }}
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
