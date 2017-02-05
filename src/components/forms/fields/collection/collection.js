import React, { Component, PropTypes } from 'react';
import { Button } from 'react-onsenui';
import R from 'ramda';
import './collection.styl';

import Field from '../../field';

class CollectionField extends Component {
  constructor() {
    super();
    this.state = {
      isExpanded: false
    };

    this.onItemChange = this.onItemChange.bind(this);
  }

  onItemChange(index, val) {
    const { value, onChange } = this.props;
    const newValue = R.adjust(() => val, index, value); // Merge at index
    onChange(newValue);
  }

  render() {
    const {
      type,
      value,
      onChange,
      ...rest
    } = this.props;

    console.log('CollectionField props:', this.props);

    return (
      <div className="collection-field">
        <div className="accordian">
          {
            /* Existing items */
            value.map((item, index) =>
              <Field
                key={index}
                type={type}
                value={item}
                onChange={val => this.onItemChange(index, val)}
              />
            )
          }
          {
            /* New item */
            /* <Field type={type} value={null} /> */
          }
        </div>
        <Button
          modifier="outline"
          onClick={() => {
            // dataStore.resetFieldsAtPath(path);
          }}
        >New</Button>
      </div>
    );
  }
}

CollectionField.propTypes = {
  domain: PropTypes.string,
  value: PropTypes.array,
  onChange: PropTypes.func
};

export default CollectionField;
