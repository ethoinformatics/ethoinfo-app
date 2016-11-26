import React from 'react';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import { Fab, BottomToolbar, Page, ToolbarButton, Icon } from 'react-onsenui';
// import JSONTree from 'react-json-tree';
import Map from '../map/map';
import './geoViewer.styl';

/**
 * A component for debugging geolocation.
 * Reads GeoStore.geolocation and
 * renders a <Map /> component with the current location.
 *
 * @class GeoViewer
 * @extends {React.Component}
 */

@observer
class GeoViewer extends React.Component {
  render() {
    const { store } = this.props;
    const geo = toJS(store.geolocation);
    const pos = geo ? [geo.latitude, geo.longitude] : [];
    return (
      <Page className="geoViewer">
        <div className="mapContainer">
          <Map
            followLocation
            location={pos}
            ref={(c) => { this.mapRef = c; }}
          />
        </div>
        {
          pos && pos.length > 1 &&
          <div className="status">
            <div>{`Updated ${store.friendlyElapsed}`}</div>
          </div>
        }
        <Fab
          style={{ zIndex: 999, bottom: '74px', background: '#fff', color: '#000' }}
          position="bottom right"
          onClick={() => this.mapRef.focusCurrentLocation()}
        >
          <Icon icon="md-my-location" />
        </Fab>
        <BottomToolbar>
          <ToolbarButton onClick={() => this.mapRef.focusCurrentLocation()}>
            <Icon icon="md-gps-fixed" />
          </ToolbarButton>
          {/* <div>{`Watching: ${store.isWatching}`}</div> */}
        </BottomToolbar>
      </Page>
    );
  }
}

GeoViewer.propTypes = {
  store: React.PropTypes.shape({
    isWatching: React.PropTypes.Boolean, // eslint-disable-line react/no-unused-prop-types
  })
};

export default GeoViewer;
