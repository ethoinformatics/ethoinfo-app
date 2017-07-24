import React, { Component } from 'react';
import R from 'ramda';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';

import './mapper.styl';

import LeafletMap from './leaflet';

// Redux setup
const mapStateToProps = state =>
  ({
    useLocalTiles: state.config.useLocalTiles
  });

const mapDispatchToProps = () => ({
});

const mapPoints = entry => entry.lines;
const timeDiff = (t1, t2) => t1.timestamp - t2.timestamp;

class Mapper extends Component {
  componentDidMount() {
  }

  render() {
    const { entries, useLocalTiles } = this.props;
    const polylines = entries.polylines || [];

    // Flatmap entries into a single array and sort by timestamp:
    const flatEntries = R.flatten(R.map(mapPoints, polylines));
    const sortedFlatEntries = R.sort(timeDiff, flatEntries);

    // Most recent entry:
    const lastEntry = R.last(sortedFlatEntries);

    const elapsed = lastEntry ? moment(lastEntry.timestamp).fromNow() : null;
    const timeDisplay = elapsed ? `Last entry: ${elapsed}` : 'No entries';


    return (
      <div className="mapper">
        <div className="mapStatus">
          { useLocalTiles ? 'Using local tiles' : 'Using remote tiles'}
          {`, ${timeDisplay}`}
        </div>
        <LeafletMap
          entries={entries}
          useLocalTiles={useLocalTiles}
        />
      </div>
    );
  }
}

Mapper.defaultProps = {
  entries: {
    markers: [],
    polylines: [],
  },
  useLocalTiles: false,
};

Mapper.propTypes = {
  entries: PropTypes.shape({
    markers: PropTypes.arrayOf(PropTypes.object),
    polylines: PropTypes.arrayOf(PropTypes.object),
  }),
  useLocalTiles: PropTypes.bool
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Mapper);
