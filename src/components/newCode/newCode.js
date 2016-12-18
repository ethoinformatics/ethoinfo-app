import React from 'react';
import { observer } from 'mobx-react';
import { Page, Button } from 'react-onsenui';
import './newCode.styl';

@observer
class NewCode extends React.Component {
  render() {
    const { createAction, createSuccessAction } = this.props;
    return (
      <Page className="newCode">
        <ol className="formFields">
          <li className="field">
            <label htmlFor="name">Name</label>
            <input
              disabled={false}
              ref={(c) => { this.nameRef = c; }}
              type={'text'}
              defaultValue={''}
              style={{ width: '100%' }}
            />
          </li>
        </ol>
        <Button
          modifier="large"
          onClick={() => {
            const name = this.nameRef.value;
            // Return if name is not valid
            // Todo: More thorough validation
            if (name.length < 1) { return; }

            createAction({
              name
            })
            .then(() => {
              console.log(`Success creating code: ${name}`);
              createSuccessAction();
            })
            .catch((err) => {
              console.log(`Error creating code: ${name} =>`, err);
            });
          }}
        >Save</Button>
      </Page>
    );
  }
}

/* eslint-disable react/no-unused-prop-types */
NewCode.propTypes = {
  createAction: React.PropTypes.func.isRequired,
  createSuccessAction: React.PropTypes.func.isRequired
};
/* eslint-enable react/no-unused-prop-types */

export default NewCode;
