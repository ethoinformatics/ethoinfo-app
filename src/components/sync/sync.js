import React from 'react';
import { observer } from 'mobx-react';
import { AlertDialog, Button, Page, ProgressBar } from 'react-onsenui';
import './sync.styl';

@observer
class Sync extends React.Component {
  onURLChange() {
    const val = this.urlRef.value.trim();
    this.props.store.updateCouchUrlBase(val);
  }

  onUsernameChange() {
    const val = this.usernameRef.value.trim();
    this.props.store.updateCouchUsername(val);
  }

  onPasswordChange() {
    const val = this.passwordRef.value.trim();
    this.props.store.updateCouchPassword(val);
  }

  render() {
    const { store } = this.props;
    const inFlight = store.operationInFlight;

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
              defaultValue={store.couchUrlBase}
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
              defaultValue={store.couchUsername}
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
              defaultValue={store.couchPassword}
              style={{ width: '100%' }}
            />
          </li>
        </ol>
        <Button
          disabled={inFlight}
          onClick={() => {
            store.uploadSync();
          }}
          modifier={'outline large'}
        >
          Upload
        </Button>
        <Button
          disabled={inFlight}
          onClick={() => store.downloadSync()}
          modifier={'outline large'}
        >
          Download
        </Button>
        <Button
          disabled={inFlight}
          onClick={() => store.deletePouch()}
          modifier={'outline large'}
        >
          Clear local database
        </Button>
        <AlertDialog
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
        </AlertDialog>
      </Page>
    );
  }
}

Sync.propTypes = {
  store: React.PropTypes.shape({
    couchPassword: React.PropTypes.String, // eslint-disable-line react/no-unused-prop-types
    couchUrlBase: React.PropTypes.String, // eslint-disable-line react/no-unused-prop-types
    couchUsername: React.PropTypes.String, // eslint-disable-line react/no-unused-prop-types
    updateCouchPassword: React.PropTypes.function,
    updateCouchUrlBase: React.PropTypes.function,
    updateCouchUsername: React.PropTypes.function
  })
};

export default Sync;

