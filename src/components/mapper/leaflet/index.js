/* eslint-disable global-require */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';
import _ from 'lodash';
import raf from 'raf';
import 'raf/polyfill';
import 'leaflet/dist/leaflet.css';

import './leaflet.styl';

import { getSchema } from '../../../schemas/main';

// Leaflet bug fix:
// https://github.com/Leaflet/Leaflet/issues/4968
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

class LeafletMap extends Component {
  componentDidMount() {
    // Create leaflet map
    // this.mapRef is assigned in the render function of this class.
    this.map = L.map(this.mapRef, { zoomControl: false });

    this.setTileLayer();

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

    // Use lodash isEqual to compare values.
    if (
      !_.isEqual(prevProps.entries, this.props.entries)
    ) {
      this.refreshMapLayers();
    }

    if (
      !_.isEqual(prevProps.useLocalTiles, this.props.useLocalTiles)
    ) {
      this.setTileLayer();
    }
  }

  setTileLayer() {
    if (!this.map) { return; }

    const { useLocalTiles } = this.props;
    // Set the tile layer.

    if (this.tileLayer) {
      this.map.removeLayer(this.tileLayer);
    }

    if (useLocalTiles) {
      this.tileLayer = L.tileLayer(
        '/maptiles/{z}/{x}/{y}.png',
        {
          attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }
      );
    } else {
      this.tileLayer = L.tileLayer(
        'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
        {
          attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }
      );
    }

    this.tileLayer.addTo(this.map);
  }

  refreshMapLayers() {
    // Good use case for immutablejs here.
    // Difficult to diff geolocation entries to accomodate imperative leaflet api
    const { entries } = this.props;

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
  }

  render() {
    return (
      <div className="leafletMap">
        <div className="leafletMount" ref={(c) => { this.mapRef = c; }} />
      </div>
    );
  }
}

LeafletMap.defaultProps = {
  entries: [],
  useLocalTiles: false,
};

LeafletMap.propTypes = {
  entries: PropTypes.arrayOf(PropTypes.object),
  useLocalTiles: PropTypes.bool,
};

export default LeafletMap;
