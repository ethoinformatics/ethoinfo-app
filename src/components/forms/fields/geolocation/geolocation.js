import React, { Component, PropTypes } from 'react';
import Promise from 'bluebird';
import { Fab, Icon } from 'react-onsenui';
import _ from 'lodash';
import './geolocation.styl';

Promise.config({
  // Enable cancellation
  cancellation: true,
});

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

  geolocate() { // eslint-disable-line class-methods-use-this
    // Todo: extrapolate this to a common geolocation api once we know all geo touchpoints

    this.setState({
      isGeolocating: true
    });

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.setState({
            isGeolocating: false
          });
          resolve(position);
        },
        (err) => {
          this.setState({
            isGeolocating: false
          });
          reject(err);
        }
      );
    });
  }

  render() {
    const { name, value, onChange } = this.props;
    const { isGeolocating } = this.state;

    return (
      <div className="geolocationField">
        <label htmlFor={name}>{_.startCase(name)}</label>
        <Fab
          ripple
          style={{ background: '#fff', color: '#000' }}
          disabled={isGeolocating}
          onClick={() => {
            console.log('Geolocating...');
            this.geoPromise = this.geolocate()
              .then((geo) => {
                const { coords: { longitude, latitude }, timestamp } = geo;

                onChange({
                  coords: { longitude, latitude },
                  timestamp
                });

                console.log('Found geolocation:', geo);
              })
              .catch((err) => {
                console.log('Error geolocating:', err);
              });
          }}
        >
          <Icon icon="md-my-location" />
        </Fab>
        {
          isGeolocating &&
          <div className="geolocating">
            Geolocating...
          </div>
        }
        {
          !isGeolocating && !value &&
          <div className="nullGeo">
            No geolocation data
          </div>
        }
        {
          !isGeolocating && value && value.coords &&
          <div className="latLong">
            <div className="lat">
              {value.coords.latitude}
            </div>
            ,
            <div className="long">
              {value.coords.longitude}
            </div>
          </div>
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
