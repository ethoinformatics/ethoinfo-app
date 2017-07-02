import React from 'react';
import { Page } from 'react-onsenui';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import './settings.styl';

import Boolean from '../form/fields/boolean/boolean';

// Actions
import {
  setItem as setConfigItem,
} from '../../redux/actions/config';


// Redux setup
const mapStateToProps = state =>
  ({
    useLocalTiles: state.config.useLocalTiles
  });

const mapDispatchToProps = dispatch => ({
  setUseLocalTiles: (value) => {
    dispatch(setConfigItem('useLocalTiles', value));
  },
});

const Settings = ({ useLocalTiles, setUseLocalTiles }) => (
  <Page>
    <div className={'settingsItemLabel'}>
      Use local tiles?
    </div>
    <div className={'settingsItemInput'}>
      <Boolean value={!!useLocalTiles} onChange={() => { setUseLocalTiles(!useLocalTiles); }} />
      <div className={'settingsItemValue'}>{ useLocalTiles ? 'Yes' : 'No'}</div>
    </div>
  </Page>
);

Settings.propTypes = {
  useLocalTiles: PropTypes.bool,
  setUseLocalTiles: PropTypes.func.isRequired
};

Settings.defaultProps = {
  useLocalTiles: false
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings);
