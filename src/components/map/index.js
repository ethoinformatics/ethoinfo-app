/* eslint-disable global-require */

import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';
import raf from 'raf';
import 'raf/polyfill';
import 'leaflet/dist/leaflet.css';
import 'spinkit/css/spinners/5-pulse.css';
import './map.styl';

import { getSchema } from '../../schemas/main';

// Leaflet bug fix:
// https://github.com/Leaflet/Leaflet/issues/4968
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

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
      /* if (this.props.location && this.props.location.length > 1) {
        this.map.setView(this.props.location, this.map.getMaxZoom());
        this.updateLocation();
      } else {
        this.map.setView([37.0902, -95.7129], 4); // Center USA.
      } */
      this.refreshMapLayers();
    });
  }

  // Component updated (state and/or props have changed).
  componentDidUpdate(prevProps) {
    // This won't be called on initial render
    // Skip if location hasn't changed

    // Use lodash isEqual to compare values.
    /* if (!_.isEqual(prevProps.location, this.props.location)) {
      this.updateLocation();
    } */

    // Use lodash isEqual to compare values.
    if (
      !_.isEqual(prevProps.entries, this.props.entries) ||
      !_.isEqual(prevProps.points, this.props.points)
    ) {
      this.refreshMapLayers();
    }
  }

  refreshMapLayers() {
    // Good use case for immutablejs here.
    // Difficult to diff geolocation entries to accomodate imperative leaflet api
    const { entries, points } = this.props;
    console.log('ENTRIES ARE:', entries);
    // const { geoPoints } = entries;

    // Create markers
    const pointLatLngs = points.map(point => [
      point.coords.latitude, point.coords.longitude
    ]);

    if (this.pointsLayerGroup) {
      this.pointsLayerGroup.eachLayer(l => this.layerGroup.removeLayer(l));
    } else {
      this.pointsLayerGroup = L.layerGroup([]).addTo(this.map);
    }

    const markers = [];

    pointLatLngs.forEach((ll) => {
      const marker = L.marker(ll, {});
      marker.bindPopup(`<p>${ll[0]}, ${ll[1]}</p>`);
      this.pointsLayerGroup.addLayer(marker);
      markers.push(marker);
    });

    /* const lastPoint = R.last(points);

    if (lastPoint) {
      // console.log('Last point:', lastPoint);
      const latLng = [lastPoint.coords.latitude, lastPoint.coords.longitude];
      this.map.setView(latLng, this.map.getMaxZoom());
    } else if (location) {
      this.map.setView(location, this.map.getMaxZoom());
    } */

    // If we have markers, calculate bounds of all markers with some padding.
    // Fit map to bounds.

    if (markers.length > 0) {
      const group = new L.featureGroup(markers); // eslint-disable-line new-cap
      this.map.fitBounds(group.getBounds().pad(0.5));
    }

    /* const latLngs = entries.map(entry => [
      entry.coords.latitude, entry.coords.longitude
    ]); */

    // For now we are just going to refresh map each time
    if (this.layerGroup) {
      // Remove existing
      this.layerGroup.eachLayer(l => this.layerGroup.removeLayer(l));
    } else {
      // Create layer group if it  doesn't exist
      this.layerGroup = L.layerGroup([]).addTo(this.map);
    }

    entries.forEach((subEntry) => {
      const { domainName } = subEntry;

      const schema = getSchema(domainName);
      const color = schema ? schema.displayColor : '#000';

      if (!subEntry.geoPoints) { return; }

      subEntry.geoPoints.forEach((values) => {
        const latLngs = values.map(entry => [
          entry.coords.latitude, entry.coords.longitude
        ]);

        if (latLngs.length > 0) {
            // Re-add path
          const geoPath = L.polyline(
            latLngs,
            {
              color,
              weight: 1
            }).addTo(this.map);
          // Zoom map to bounding box of polyline
          this.map.fitBounds(geoPath.getBounds());

          // Add individual points
          latLngs.forEach((ll) => {
            const marker = L.circleMarker(ll, {
              radius: 1,
              color,
            });

            marker.bindPopup(`<p>${ll[0]}, ${ll[1]}</p>`);

            this.layerGroup.addLayer(marker);
          });
        }
      });
    });

    /* const latLngs = R.flatten(entries).map(entry => [
      entry.coords.latitude, entry.coords.longitude
    ]);

    if (latLngs.length > 0) {
        // Re-add path
      const geoPath = L.polyline(
        latLngs,
        {
          color: 'blue',
          weight: 1
        }).addTo(this.map);
      // Zoom map to bounding box of polyline
      this.map.fitBounds(geoPath.getBounds());

      // Add individual points
      latLngs.forEach((ll) => {
        const marker = L.circleMarker(ll, {
          radius: 1,
          color: 'blue',
        });

        marker.bindPopup(`<p>${ll[0]}, ${ll[1]}</p>`);

        this.layerGroup.addLayer(marker);
      });
    }*/

    // Zoom to first entry
    /* const firstEntry = R.head(entries);
    if (firstEntry) {
      this.map.setView(
        [firstEntry.coords.latitude, firstEntry.coords.longitude], this.map.getMaxZoom()
      );
    } else {
      // this.map.setView([37.0902, -95.7129], 4); // Center USA.
    } */
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
  followLocation: PropTypes.bool,
  location: PropTypes.arrayOf(PropTypes.number),
  entries: PropTypes.arrayOf(
    PropTypes.shape({
      domainName: PropTypes.string,
      geoPoints: PropTypes.arrayOf(
        PropTypes.arrayOf(
          PropTypes.shape({
            timestamp: PropTypes.number,
            coords: PropTypes.shape({
              latitude: PropTypes.number,
              longitude: PropTypes.number
            })
          })
        )
      )
    })
  ),
  points: PropTypes.arrayOf(
      PropTypes.shape({
        timestamp: PropTypes.number,
        coords: PropTypes.shape({
          latitude: PropTypes.number,
          longitude: PropTypes.number
        })
      })
    )
};

Map.defaultProps = {
  points: [],
};

export default Map;
