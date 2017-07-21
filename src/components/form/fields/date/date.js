import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
    const { disabled, name, onChange, value } = this.props;
    const date = value ? moment(value) : moment();

    const inputProps = { disabled };

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
          inputProps={inputProps}
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
  disabled: PropTypes.bool,
  value: PropTypes.string,
  onChange: PropTypes.func
};

DateField.defaultProps = {
  disabled: false,
};

export default DateField;
