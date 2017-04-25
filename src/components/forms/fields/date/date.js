import React, { Component, PropTypes } from 'react';
import Datetime from 'react-datetime';
import moment from 'moment';
import _ from 'lodash';

import 'react-datetime/css/react-datetime.css';

class DateField extends Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    const { onChange, value } = this.props;

    if (!value) {
      onChange(moment().utc().format());
    }
  }

  render() {
    const { value, name, onChange } = this.props;
    const date = value ? moment(value) : moment();

    return (
      <div>
        <label htmlFor={name}>{_.startCase(name)}</label>
        {/* <SingleDatePicker
          date={date}
          focused={this.state.focused}
          onDateChange={(newDate) => {
            onChange(newDate.utc().format());
          }}
          onFocusChange={({ focused }) => { this.setState({ focused }); }}
          numberOfMonths={1}
          isOutsideRange={() => false}
          withPortal
          id={`SingleDatePicker-${value}`}
        /> */}
        <Datetime
          onChange={(newDate) => {
            onChange(newDate.utc().format());
          }}
          value={date}
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
