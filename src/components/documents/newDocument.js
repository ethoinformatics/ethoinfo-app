import React from 'react';
import { observer } from 'mobx-react';
import { Button, Page } from 'react-onsenui';
import 'react-dates/lib/css/_datepicker.css';
import './documentForm.styl';
import Form from '../forms/form';

@observer
class NewDocument extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    const { dataStore, domain, schema, actions } = this.props;
    const path = ['new', domain];

    return (
      <Page className="newDocument">
        <Form
          path={path}
          schema={schema}
          dataStore={dataStore}
        />
        <Button
          modifier="large"
          onClick={() => {
            dataStore.saveFieldsAtPath(path)
              .then(() => {
                console.log(`Success creating document: ${name}`);
                dataStore.resetFieldsAtPath(path);
                actions.onCreate();
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
// Use generic "React.PropTypes.object" for now.

/* eslint-disable react/no-unused-prop-types */
NewDocument.propTypes = {
  dataStore: React.PropTypes.object, // eslint-disable-line  react/forbid-prop-types
  domain: React.PropTypes.string,
  schema: React.PropTypes.object, // eslint-disable-line  react/forbid-prop-types
  actions: React.PropTypes.shape({
    onCreate: React.PropTypes.func.isRequired,
    // onCreate: React.PropTypes.func.isRequired
  })
};
/* eslint-enable react/no-unused-prop-types */

export default NewDocument;
