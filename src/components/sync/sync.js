import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { /* AlertDialog, */ Button, Page, ProgressBar } from 'react-onsenui';
import './sync.styl';

// Actions
import {
  deleteLocalDb,
  downloadSync,
  setItem as setConfigItem,
  uploadSync,
} from '../../redux/actions/config';

// Redux setup
const mapStateToProps = state =>
  ({
    url: state.config.url,
    username: state.config.username,
    password: state.config.password
  });

const mapDispatchToProps = dispatch => ({
  destroyDb: () => {
    dispatch(deleteLocalDb());
  },
  download: () => {
    dispatch(downloadSync());
  },
  setConfigItem: (key, value) => {
    dispatch(setConfigItem(key, value));
  },
  upload: () => {
    dispatch(uploadSync());
  }
});

class Sync extends React.Component {
  onURLChange() {
    const val = this.urlRef.value.trim();
    this.props.setConfigItem('url', val);
  }

  onUsernameChange() {
    const val = this.usernameRef.value.trim();
    this.props.setConfigItem('username', val);
  }

  onPasswordChange() {
    const val = this.passwordRef.value.trim();
    this.props.setConfigItem('password', val);
  }

  render() {
    const inFlight = false;
    const { destroyDb, download, password, upload, url, username, } = this.props;

    return (
      <Page className="sync">
        <div className="progressContainer">
          { inFlight && <ProgressBar indeterminate /> }
        </div>
        <ol className="syncFields">
          <li className="syncField">
            <label htmlFor="couchUrl">Couch URL</label>
            <input
              disabled={inFlight}
              ref={(c) => { this.urlRef = c; }}
              onChange={() => this.onURLChange()}
              type={'text'}
              defaultValue={url}
              style={{ width: '100%' }}
            />
          </li>
          <li className="syncField">
            <label htmlFor="couchUsername">Couch Username</label>
            <input
              disabled={inFlight}
              ref={(c) => { this.usernameRef = c; }}
              onChange={() => this.onUsernameChange()}
              type={'text'}
              defaultValue={username}
              style={{ width: '100%' }}
            />
          </li>
          <li className="syncField">
            <label htmlFor="couchPassword">Couch Password</label>
            <input
              disabled={inFlight}
              ref={(c) => { this.passwordRef = c; }}
              onChange={() => this.onPasswordChange()}
              type={'password'}
              defaultValue={password}
              style={{ width: '100%' }}
            />
          </li>
        </ol>
        <Button
          disabled={inFlight}
          onClick={() => upload()}
          modifier={'outline large'}
        >
          Upload
        </Button>
        <Button
          disabled={inFlight}
          onClick={() => download()}
          modifier={'outline large'}
        >
          Download
        </Button>
        <Button
          disabled={inFlight}
          onClick={() => destroyDb()}
          modifier={'outline large'}
        >
          Clear local database
        </Button>
        {/* <AlertDialog
          isOpen={store.statusMessage !== null}
          isCancelable={false}
        >
          <div className="alert-dialog-content">
            {store.statusMessage}
          </div>
          <div className="alert-dialog-footer">
            <button onClick={() => store.clearStatusMessage()} className="alert-dialog-button">
              Ok
            </button>
          </div>
        </AlertDialog> */}
      </Page>
    );
  }
}

Sync.propTypes = {
  download: PropTypes.func.isRequired,
  password: PropTypes.string,
  setConfigItem: PropTypes.func.isRequired,
  upload: PropTypes.func.isRequired,
  url: PropTypes.string,
  username: PropTypes.string,
};

Sync.defaultProps = {
  url: '',
  username: '',
  password: ''
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sync);

