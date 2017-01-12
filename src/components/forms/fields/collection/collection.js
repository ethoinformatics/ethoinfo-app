import React, { PropTypes } from 'react';
import { Button } from 'react-onsenui';
import './collection.styl';

const CollectionField = ({ domain, value, onChange, ...rest }) =>
  (
    <div className="collection-field" {...rest}>
      <div className="accordian">{`Accordian with ${domain} collection goes here`}</div>
      <Button
        modifier="outline"
        onClick={() => {
          // dataStore.resetFieldsAtPath(path);
        }}
      >New</Button>
    </div>
  );

CollectionField.propTypes = {
  domain: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func
};

export default CollectionField;
