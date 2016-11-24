import React from 'react';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import { BottomToolbar, Page } from 'react-onsenui';
import JSONTree from 'react-json-tree';
import Map from '../map/map';

import './geoViewer.styl';

@observer
class GeoViewer extends React.Component {
  render() {
    const { store } = this.props;
    const geolocation = toJS(store.geolocation);
    const { latitude, longitude } = geolocation;
    const pos = [latitude, longitude]; // move this to a computed prop?
    return (
      <Page className="geoViewer">
        { /*
        <div>
          {
            store.geolocation
            && <JSONTree data={toJS(store.geolocation)} />
          }
        </div> */ }
        <div className="mapContainer">
          <Map location={pos} />
        </div>
        <BottomToolbar>
          <div>{`Watching: ${store.isWatching}`}</div>
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
