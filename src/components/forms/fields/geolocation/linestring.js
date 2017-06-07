import React, { Component } from 'react';
import PropTypes from 'prop-types';
import R from 'ramda';
import _ from 'lodash';

import Boolean from '../boolean/boolean';

class GeolocationLineString extends Component {
  constructor() {
    super();

    // Initial state
    this.state = {};

    this.onSwitchToggle = this.onSwitchToggle.bind(this);

    // Default value:
  }

  componentWillUnmount() {
  }

  onSwitchToggle(switchValue) { // eslint-disable-line class-methods-use-this
    const { onChange } = this.props;

    const value = this.props.value ||
      {
        timeRanges: [],
      };

    const timeRanges = value.timeRanges || [];

    console.log('TIME RANGES:', timeRanges);

    const lastTimeRange = R.last(timeRanges);

    // Start a new time range if we have an open one or if none exist
    if (!lastTimeRange || lastTimeRange.end) {
      const newEntry = { start: Date.now() };
      const updatedTimeRanges = R.append(newEntry, timeRanges);
      const newValue = R.assoc('timeRanges', updatedTimeRanges, value);
      onChange(newValue);
      console.log('New value is:', newValue);
    } else {
      // Update last time range
      const updatedLastTimeRange = R.assoc('end', Date.now(), lastTimeRange);
      const updatedTimeRanges = R.update(
        timeRanges.length - 1,
        updatedLastTimeRange,
        timeRanges);
      const newValue = R.assoc('timeRanges', updatedTimeRanges, value);
      onChange(newValue);
      console.log('New value is:', newValue);
    }

    // console.log('Switch toggled:', switchValue);
  }

  render() {
    const { name, value } = this.props;

    const _value = value || {}; // Temporary

    const timeRanges = _value.timeRanges || [];
    const lastTimeRange = R.last(timeRanges);

    const isActive = lastTimeRange ? !lastTimeRange.end : false;
    console.log('Time ranges:', timeRanges, typeof timeRanges);
    console.log('last time range:', lastTimeRange);
    console.log('is Active:', isActive);

    console.log('Linestring value is:', value);
    return (
      <div className="geolocationField">
        <label htmlFor={name}>{_.startCase(name)}</label>
        <Boolean value={isActive} onChange={this.onSwitchToggle} />
        {`value is: ${value}`}
      </div>
    );
  }
}

GeolocationLineString.propTypes = {
  name: PropTypes.string,
  value: PropTypes.shape({
    coords: PropTypes.shape({
      longitude: PropTypes.number,
      latitude: PropTypes.number
    }),
    timestamp: PropTypes.number,
  }),
  onChange: PropTypes.func.isRequired // eslint-disable-line
};

GeolocationLineString.defaultProps = {
  name: '',
  value: {},
};

export default GeolocationLineString;
