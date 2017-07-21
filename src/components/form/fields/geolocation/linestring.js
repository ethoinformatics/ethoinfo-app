import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import R from 'ramda';
import _ from 'lodash';
import moment from 'moment';

import Boolean from '../boolean/boolean';

import './linestring.styl';

const mapStateToProps = state => ({
  geoCache: state.geo.entries // Todo: make selector!
});

const mapDispatchToProps = () => ({});

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

  onSwitchToggle() {
    const { onChange } = this.props;

    const value = this.props.value ||
      {
        timeRanges: [],
      };

    const timeRanges = value.timeRanges || [];
    const lastTimeRange = R.last(timeRanges);

    // Start a new time range if we have an open one or if none exist
    if (!lastTimeRange || lastTimeRange.end) {
      const newEntry = { start: Date.now() };
      const updatedTimeRanges = R.append(newEntry, timeRanges);
      const newValue = R.assoc('timeRanges', updatedTimeRanges, value);
      onChange(newValue);
    } else {
      // Update last time range
      const updatedLastTimeRange = R.assoc('end', Date.now(), lastTimeRange);
      const updatedTimeRanges = R.update(
        timeRanges.length - 1,
        updatedLastTimeRange,
        timeRanges);
      const newValue = R.assoc('timeRanges', updatedTimeRanges, value);
      onChange(newValue);
    }

    // console.log('Switch toggled:', switchValue);
  }

  renderTimeRanges() {
    const { geoCache, value } = this.props;

    if (!value || !value.timeRanges) {
      return null;
    }

    const timeRanges = value.timeRanges;

    return (
      <div>
        <div className="timeRangesHeader">
          <div className="timeRangesHeaderStart">Start</div>
          <div className="timeRangesHeaderEnd">End</div>
          <div className="timeRangesHeaderCount">Entries</div>
        </div>
        {
          timeRanges.map((range) => {
            const { start, end } = range;
            const entries = geoCache.filter((cacheValue) => {
              const { timestamp } = cacheValue;
              return end ? timestamp >= start && timestamp <= end :
                timestamp >= start;
            });

            return (
              <div className="timeRange" key={`timerange-${range.start}-${range.end}`}>
                <div className="timeRangeStart">
                  { range.start && moment(range.start).format('MM-DD, h:mm a') }
                </div>
                <div className="timeRangeEnd">
                  { range.end && moment(range.end).format('MM-DD, h:mm a')}
                </div>
                <div className="timeRangeCount">
                  { entries.length }
                </div>
              </div>
            );
          })
        }
      </div>
    );
  }

  render() {
    const { name, value, disabled } = this.props;

    const _value = value || {}; // Temporary

    const timeRanges = _value.timeRanges || [];
    const lastTimeRange = R.last(timeRanges);
    const isActive = lastTimeRange ? !lastTimeRange.end : false;

    // console.log('Linestring value is:', value);
    return (
      <div className="geolocationField">
        <label htmlFor={name}>{_.startCase(name)}</label>
        <Boolean value={isActive} disabled={disabled} onChange={this.onSwitchToggle} />
        <div className={'boolValue'}>{ isActive ? 'On' : 'Off'}</div>
        { this.renderTimeRanges() }
      </div>
    );
  }
}

GeolocationLineString.propTypes = {
  disabled: PropTypes.bool,
  geoCache: PropTypes.arrayOf(
    PropTypes.shape(
      {
        coords: PropTypes.shape({
          latitude: PropTypes.number,
          longitude: PropTypes.number
        }),
        timestamp: PropTypes.number
      }
    )
  ),
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
  disabled: false,
  geoCache: [],
  name: '',
  value: {},
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GeolocationLineString);
