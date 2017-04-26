import React from 'react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import { Page, Icon } from 'react-onsenui';
import JSONTree from 'react-json-tree';

import './debugDetail.styl';

const theme = {
  scheme: 'harmonic16',
  author: 'jannik siebert (https://github.com/janniks)',
  base00: '#0b1c2c',
  base01: '#223b54',
  base02: '#405c79',
  base03: '#627e99',
  base04: '#aabcce',
  base05: '#cbd6e2',
  base06: '#e5ebf1',
  base07: '#f7f9fb',
  base08: '#bf8b56',
  base09: '#bfbf56',
  base0A: '#8bbf56',
  base0B: '#56bf8b',
  base0C: '#568bbf',
  base0D: '#8b56bf',
  base0E: '#bf568b',
  base0F: '#bf5656'
};

const renderValidationFailBox = error =>
  <div className="validationStatus error">
    <div className="message">
      <Icon icon="md-alert-triangle" />
      <div className="header">Schema contains errors!</div>
    </div>
    <div className="detail">
      {error.message}
    </div>
  </div>;

const renderValidationSuccessBox = () =>
  <div className="validationStatus success">
    <div className="message">
      <Icon icon="md-check" />
      <div className="header">Schema is valid!</div>
    </div>
  </div>;

const DebugDetail = observer(({ schema }) => {
  const { name, validation } = toJS(schema);
  let { value } = validation;
  const { error } = validation;

  // Embed string values in an obj.
  if (typeof value === 'string') {
    value = {
      name: value
    };
  }

  // const validationStyle = error === null ? {backgroundColor: ''} : {}
  return (
    <Page className="debugDetail">
      {
        error ? renderValidationFailBox(error) : renderValidationSuccessBox()
      }
      <div className="jsonTree">
        <JSONTree
          data={value}
          shouldExpandNode={() => true}
          theme={theme}
        />
      </div>
    </Page>
  );
});

export default DebugDetail;
