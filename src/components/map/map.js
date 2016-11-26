import _ from 'lodash';
import React from 'react';
import L from 'leaflet';
import raf from 'raf';
import 'raf/polyfill';
import 'leaflet/dist/leaflet.css';
import 'spinkit/css/spinners/5-pulse.css';
import './map.styl';


/**
 * Map component
 *
 * Renders location to a Leaflet map.
 *
 * @class Map
 * @extends {React.Component}
 */

class Map extends React.Component {
  // componentDidMount() is invoked immediately after a component is mounted.
  // Leaflet requires a DOM node, so we initialize map here:
  componentDidMount() {
    // Create leaflet map
    // this.mapRef is assigned in the render function of this class.
    this.map = L.map(this.mapRef, { zoomControl: false });

    // Set the tile tile layer.
    // Using OpenStreetMap now but need to switch to local tiles.
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    // Map doesn't use an explicit size, so we need to invalidate.
    // Later we force a re-render.
    this.map.invalidateSize();

    // componentDidMount is executed before DOM is finished drawing
    // so use requestAnimationFrame to make sure this is executed
    // after the map has a chance to paint.
    raf(() => {
      // If location is set, zoom to that spot, otherwise go to center of USA.
      if (this.props.location && this.props.location.length > 1) {
        this.map.setView(this.props.location, this.map.getMaxZoom());
        this.updateLocation();
      } else {
        this.map.setView([37.0902, -95.7129], 4); // Center USA.
      }
    });
  }

  // Component updated (state and/or props have changed).
  componentDidUpdate(prevProps) {
    // This won't be called on initial render
    // Skip if location hasn't changed

    // Use lodash isEqual to compare values.
    if (!_.isEqual(prevProps.location, this.props.location)) {
      this.updateLocation();
    }
  }

  updateLocation() {
    // We have to write some imperative code here to update leaflet.
    // When geolocation changes, we remove the existing marker and create
    // a new one.
    const loc = this.props.location;

    // If our "location" prop is assigned, create a marker
    if (loc && Array.isArray(loc) && loc.length > 1) {
      // Remove marker if it already exists
      if (this.locationMarker) {
        this.map.removeLayer(this.locationMarker);
      }

      // Create a pulsing marker to highlight current location
      const pulse = L.divIcon({
        iconSize: L.point(40, 40),
        className: 'markerPulse',
        html: '<div><div class="markerStatic"></div><div class="sk-spinner sk-spinner-pulse"></div></div>'
      });

      // Add new marker
      this.locationMarker = L.marker(
        loc,
        { icon: pulse }
      ).addTo(this.map);

      // Move this to a button tap
      // this.map.setView(loc, this.map.getMaxZoom());

      // If map is declared with "followLocation" prop set to true,
      // focus map on the current location.
      if (this.props.followLocation === true) {
        this.focusCurrentLocation();
      }
    }
  }

  // Set map view to the current location.
  focusCurrentLocation() {
    const { location } = this.props;
    this.map.stop(); // Stop any existing map animations.

    if (!location || !Array.isArray(location) || location.length < 1) {
      return;
    }

    if (!this.map) return;

    this.map.setView(location, this.map.getMaxZoom(), {
      duration: 0.5
    });
  }

  // Simple render function provides a DOM mount point for leaflet.
  // We setup leaflet in componentDidMount().
  render() {
    return (
      <div className="map">
        <div className="leafletMount" ref={(c) => { this.mapRef = c; }} />
      </div>
    );
  }
}

// Declare our props:
// Location is an array of numbers [lat, long]
Map.propTypes = {
  followLocation: React.PropTypes.bool,
  location: React.PropTypes.arrayOf(React.PropTypes.number)
};

export default Map;
