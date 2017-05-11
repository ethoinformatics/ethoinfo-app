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
    password: state.config.password,
    transactionInProgress: state.global.transactionInProgress,
    url: state.config.url,
    username: state.config.username,
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
    const {
      destroyDb, download, password, transactionInProgress, upload, url, username,
    } = this.props;

    return (
      <Page className="sync">
        <div className="progressContainer">
          { transactionInProgress && <ProgressBar indeterminate /> }
        </div>
        <ol className="syncFields">
          <li className="syncField">
            <label htmlFor="couchUrl">Couch URL</label>
            <input
              disabled={transactionInProgress}
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
              disabled={transactionInProgress}
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
              disabled={transactionInProgress}
              ref={(c) => { this.passwordRef = c; }}
              onChange={() => this.onPasswordChange()}
              type={'password'}
              defaultValue={password}
              style={{ width: '100%' }}
            />
          </li>
        </ol>
        <Button
          disabled={transactionInProgress}
          onClick={() => upload()}
          modifier={'outline large'}
        >
          Upload
        </Button>
        <Button
          disabled={transactionInProgress}
          onClick={() => download()}
          modifier={'outline large'}
        >
          Download
        </Button>
        <Button
          disabled={transactionInProgress}
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
  destroyDb: PropTypes.func.isRequired,
  download: PropTypes.func.isRequired,
  password: PropTypes.string,
  setConfigItem: PropTypes.func.isRequired,
  transactionInProgress: PropTypes.bool.isRequired,
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

