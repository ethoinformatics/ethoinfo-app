import React, { Component, PropTypes } from 'react';
import Promise from 'bluebird';
import { Fab, Icon } from 'react-onsenui';
import _ from 'lodash';
import './geolocation.styl';

// Enable Promise cancellation.
// Important in case component unmounts before Promise returns.
Promise.config({
  cancellation: true,
});

// navigator.geolocation.getCurrentPosition as a Promise.
const geolocate = () =>
  new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Convert position values to plain object:
        const { coords: { longitude, latitude }, timestamp } = position;

        return {
          coords: { longitude, latitude },
          timestamp
        };
      },
      err => reject(new Error(err.message))
    );
  });

/**
 * A "controlled component" that takes button presses and returns geolocation.
 *
 */

class GeolocationPointInput extends Component {
  constructor() {
    super();

    // Initial state
    this.state = {
      canGeolocate: navigator.geolocation,
      isGeolocating: false
    };

    // Bind context
    this.geolocate = this.geolocate.bind(this);
  }

  componentWillUnmount() {
    // Cancel promise
    if (this.geoPromise) {
      this.geoPromise.cancel();
    }
  }

  geolocate() {
    const { onChange } = this.props;

    this.setState({
      isGeolocating: true
    });

    this.geoPromise = geolocate()
      .then((geo) => {
        onChange(geo);
        this.setState({ isGeolocating: false });
      })
      .catch((err) => {
        this.setState({ isGeolocating: false });
        console.log(err);
      });
  }

  renderNullGeo = () =>
    <div className="nullGeo">
      No geolocation data
    </div>

  renderIsGeolocating = () =>
    <div className="geolocating">
      Geolocating...
    </div>

  renderCoords() {
    const { value: { coords: { latitude, longitude } } } = this.props;

    return (
      <div className="latLong">
        <div className="lat">
          {latitude}
        </div>
        ,
        <div className="long">
          {longitude}
        </div>
      </div>
    );
  }

  render() {
    const { name, value } = this.props;
    const { isGeolocating } = this.state;

    return (
      <div className="geolocationField">
        <label htmlFor={name}>{_.startCase(name)}</label>
        <Fab
          ripple
          style={{ background: '#fff', color: '#000' }}
          disabled={isGeolocating}
          onClick={this.geolocate}
        >
          <Icon icon="md-my-location" />
        </Fab>
        {
          isGeolocating &&
          this.renderIsGeolocating()
        }
        {
          !isGeolocating && !value &&
          this.renderNullGeo()
        }
        {
          !isGeolocating && value && value.coords &&
          this.renderCoords()
        }
      </div>
    );
  }
}

GeolocationPointInput.propTypes = {
  name: PropTypes.string,
  value: PropTypes.shape({
    coords: PropTypes.shape({
      longitude: PropTypes.number,
      latitude: PropTypes.number
    }),
    timestamp: PropTypes.number,
  }),
  onChange: PropTypes.func.isRequired
};

GeolocationPointInput.defaultProps = {
  name: '',
  value: null,
};

export default GeolocationPointInput;
