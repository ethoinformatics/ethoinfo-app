import React from 'react';
import L from 'leaflet';
import moment from 'moment';
import raf from 'raf';

import 'leaflet/dist/leaflet.css';
import './map.styl';

class Map extends React.Component {
  // componentDidMount() is invoked immediately after a component is mounted.
  // Leaflet requires a DOM node, so we initialize map here:
  componentDidMount() {
    // Create leaflet map
    // this.mapRef is assigned in render function of this class.
    this.map = L.map(this.mapRef);

    // Set tile layer
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    // Map doesn't use an explicit size, so we need to invalidate.
    // A subsequent scroll, zoom, move to location will force a re-render
    // of map tiles.
    this.map.invalidateSize();

    // componentDidMount is executed before DOM is finished drawing
    // so use requestAnimationFrame to make sure this is executed
    // after paint
    raf(() => this.updateLocation());

    // setTimeout(() => this.updateLocation(), 100);
    // this.updateLocation();
  }

  // Component updated (state and/or props have changed).
  componentDidUpdate() {
    // This won't be called on initial render
    this.updateLocation();
  }

  updateLocation() {
    const loc = this.props.location;

    // If our "location" prop is assigned, create a marker
    if (loc && Array.isArray(loc) && loc.length > 1) {
      console.log(loc);
      L.popup()
      .setLatLng(loc)
      .setContent('last update')
      .openOn(this.map);

      this.map.setView(loc, this.map.getMaxZoom());
    }
  }

  render() {
    return (
      <div className="map">
        <div className="leafletMount" ref={(c) => { this.mapRef = c; }} />
      </div>
    );
  }

}

Map.propTypes = {
  location: React.PropTypes.arrayOf(React.PropTypes.number)
};

export default Map;
