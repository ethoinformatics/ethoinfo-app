import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Button, List, ListItem } from 'react-onsenui';
import R from 'ramda';
import _ from 'lodash';
import './collection.styl';

import { push as pushModal } from '../../../../redux/actions/modals';

// import Field from '../../field';

function mapStateToProps() {
  return {
  };
}

const mapDispatchToProps = dispatch => ({
  onPushModal: (id, props) => {
    dispatch(pushModal(id, props));
  }
});

class CollectionField extends Component {
  constructor() {
    super();
    this.state = {
      isExpanded: false
    };

    this.onItemChange = this.onItemChange.bind(this);
    this.removeNulls = this.removeNulls.bind(this);
  }

  onItemChange(index, val) {
    const { value, onChange } = this.props;
    const newValue = R.adjust(() => val, index, value); // Merge at index
    onChange(newValue);
  }

  removeNulls() {
    const { value, onChange } = this.props;
    const newValue = value.filter(item => !_.isNil(item)); // Merge at index
    onChange(newValue);
  }

  render() {
    const {
      type, value, name, path, onChange, onPushModal, isLookup
    } = this.props;

    // Header is name of field and number of items in collection
    const header = `${_.startCase(name)} (${value.length})`;

    return (
      <div className="collection-field">
        <label htmlFor={name}>{header}</label>
        <div className="accordian">
          {
            /* Existing items */
            /* value.map((item, index) =>
              <div key={index}>
                <Field
                  key={index}
                  type={type}
                  value={item}
                  onChange={val => this.onItemChange(index, val)}
                />
              </div>
            )*/
          }
          {
            <List
              className="list"
              dataSource={value}
              renderRow={(row, index) =>
                <ListItem
                  key={index}
                  onClick={() => {
                    const itemPath = [...path, index];
                    const modalId = itemPath.join('/');

                    // View modal with new value
                    onPushModal(modalId, {
                      path: itemPath,
                      type,
                      isLookup,
                      value: R.last(value),
                      onChange: val => this.onItemChange(index, val)
                    });
                  }}
                >
                  Hello
                </ListItem>
              }
            />
          }
          {
            /* New item */
            /* <Field type={type} value={null} /> */
          }
        </div>
        <Button
          modifier="outline"
          onClick={() => {
            // Push a new value to the end of collection
            const newValue = [...value, null];
            onChange(newValue);

            // Index of new item is last array index
            const newIndex = newValue.length - 1;

            // Append index to path
            const newPath = [...path, newIndex];

            // Make an id string from path components
            const modalId = newPath.join('/');

            // View modal with new value
            onPushModal(modalId, {
              path: newPath,
              type,
              isLookup,
              value: null,
              onChange: val => this.onItemChange(newIndex, val),
              onClose: () => { this.removeNulls(); }
            });
          }}
        >New</Button>
      </div>
    );
  }
}

CollectionField.propTypes = {
  // domain: PropTypes.string,
  name: PropTypes.string,
  onPushModal: PropTypes.func,
  onChange: PropTypes.func,
  type: PropTypes.object.isRequired,
  isLookup: PropTypes.bool,
  value: PropTypes.array.isRequired,
  path: PropTypes.array.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CollectionField);
