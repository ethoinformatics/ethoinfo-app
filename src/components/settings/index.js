import React from 'react';
import { Page, List, ListItem } from 'react-onsenui';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import moment from 'moment';

import './settings.styl';

import Boolean from '../form/fields/boolean/boolean';

// Actions
import {
  setItem as setConfigItem,
} from '../../redux/actions/config';


// Redux setup
const mapStateToProps = state =>
  ({
    log: state.global.log,
    useLocalTiles: state.config.useLocalTiles
  });

const mapDispatchToProps = dispatch => ({
  setUseLocalTiles: (value) => {
    dispatch(setConfigItem('useLocalTiles', value));
  },
});

const Settings = ({ log, useLocalTiles, setUseLocalTiles }) => (
  <Page>
    <div className={'settingsItemLabel'}>
      Use local tiles?
    </div>
    <div className={'settingsItemInput'}>
      <Boolean value={!!useLocalTiles} onChange={() => { setUseLocalTiles(!useLocalTiles); }} />
      <div className={'settingsItemValue'}>{ useLocalTiles ? 'Yes' : 'No'}</div>
    </div>
    <div className="log">
      <div className={'logLabel'}>
      Log
    </div>
      <List
        className="logList"
        dataSource={log.sort((l, r) =>
            l.timestamp < r.timestamp)}
        renderRow={(entry, index) =>
          <ListItem key={index} >
            <div className="left">
              {moment(entry.timestamp).format('h:mm:ss a')}
            </div>
            <div className="center">
              {entry.text}
            </div>
          </ListItem>
        }
      />
    </div>
  </Page>
);

Settings.propTypes = {
  log: PropTypes.arrayOf(PropTypes.object),
  useLocalTiles: PropTypes.bool,
  setUseLocalTiles: PropTypes.func.isRequired
};

Settings.defaultProps = {
  log: [],
  useLocalTiles: false
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings);
