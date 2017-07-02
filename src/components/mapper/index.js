import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import './mapper.styl';

import LeafletMap from './leaflet';

// Redux setup
const mapStateToProps = state =>
  ({
    useLocalTiles: state.config.useLocalTiles
  });

const mapDispatchToProps = () => ({
});

class Mapper extends Component {
  componentDidMount() {
  }

  render() {
    const { entries, useLocalTiles } = this.props;

    return (
      <div className="mapper">
        <LeafletMap
          entries={entries}
          useLocalTiles={useLocalTiles}
        />
      </div>
    );
  }
}

Mapper.defaultProps = {
  entries: [],
  useLocalTiles: false,
};

Mapper.propTypes = {
  entries: PropTypes.arrayOf(PropTypes.object),
  useLocalTiles: PropTypes.bool
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Mapper);
