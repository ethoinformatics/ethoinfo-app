import React from 'react';
import R from 'ramda';
import { connect } from 'react-redux';
import { Fab, BottomToolbar, Page, Icon } from 'react-onsenui';
import Map from '../map/map';
import './geoViewer.styl';

/**
 * A component for viewing geolocation cache.
 *
 * renders a <Map /> component with the data from cache
 *
 * @class GeoViewer
 * @extends {React.Component}
 */

function mapStateToProps(state) {
  return {
    geo: state.geo,
  };
}

const mapDispatchToProps = () => ({
});

class GeoViewer extends React.Component {

  render() {
    const { geo: { entries } } = this.props;
    const firstEntry = R.head(entries);
    // const lastEntry = R.last(entries);

    const startPos = firstEntry ?
      [firstEntry.coords.latitude, firstEntry.coords.longitude] : [];

    return (
      <Page className="geoViewer">
        <div className="mapContainer">
          <Map
            followLocation
            location={startPos}
            entries={entries}
            ref={(c) => { this.mapRef = c; }}
          />
        </div>
        {
          /* pos && pos.length > 1 &&
          <div className="status">
            <div>{`Updated ${store.friendlyElapsed}`}</div>
          </div> */
        }
        <Fab
          style={{ zIndex: 999, bottom: '74px', background: '#fff', color: '#000' }}
          position="bottom right"
          onClick={() => this.mapRef.focusCurrentLocation()}
        >
          <Icon icon="md-my-location" />
        </Fab>
        <BottomToolbar>
          {/* <div className="switchContainer">
            <Switch
              modifier="etho"
              checked={store.shouldWatch} onChange={(event) => {
                const { value } = event;
                if (value === true) {
                  store.watchPosition();
                } else {
                  store.cancelWatchPosition();
                }
                console.log('Switched:', value);
              }}
            />
          </div> */}
          {/* <ToolbarButton onClick={() => this.mapRef.focusCurrentLocation()}>
            <Icon icon="md-gps-fixed" />
          </ToolbarButton> */}
          {/* <div>{`Watching: ${store.isWatching}`}</div> */}
        </BottomToolbar>
      </Page>
    );
  }
}

GeoViewer.propTypes = {
  geo: React.PropTypes.shape({
    entries: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        timestamp: React.PropTypes.number,
        coords: React.PropTypes.shape({
          latitude: React.PropTypes.number,
          longitude: React.PropTypes.number
        })
      })
    )
  })
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GeoViewer);
