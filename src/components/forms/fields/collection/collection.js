import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Button, List, ListItem } from 'react-onsenui';
import R from 'ramda';
import _ from 'lodash';
import pluralize from 'pluralize';
import './collection.styl';

import { resetFields as resetFieldsAtPath } from '../../../../redux/actions/fields';
import { push as pushModal, pop as popModal } from '../../../../redux/actions/modals';

// import Field from '../../field';

function mapStateToProps() {
  return {
  };
}

const mapDispatchToProps = dispatch => ({
  onPopModal: (id) => {
    dispatch(popModal(id));
  },
  onPushModal: (id, props) => {
    dispatch(pushModal(id, props));
  },
  onResetFieldsAtPath: (path) => {
    dispatch(resetFieldsAtPath(path));
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

  removeAtIndex(index) {
    const { value, onChange } = this.props;
    const newValue = R.remove(index, 1, value); // Remove item at index
    onChange(newValue);
  }

  render() {
    const {
      type, value, name, path, onChange, onPushModal, onPopModal, isLookup, onResetFieldsAtPath
    } = this.props;

    // Header is name of field and number of items in collection
    const header = `${_.startCase(name)} (${value.length})`;

    return (
      <div className="collection-field">
        <label htmlFor={name}>{header}</label>
        <div className="accordian">
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

                    const title = _.startCase(pluralize(name, 1));

                    // View modal with new value
                    onPushModal(modalId, {
                      path: itemPath,
                      type,
                      name: title,
                      title,
                      isLookup,
                      value: R.last(value),
                      onChange: val => this.onItemChange(index, val),
                      onClose: () => {
                        onResetFieldsAtPath(itemPath);
                      },
                      actions: [
                        {
                          title: 'Done',
                          callback: () => {
                            onPopModal(modalId);
                            this.removeNulls();
                          }
                        },
                        {
                          title: 'Remove',
                          callback: () => {
                            onPopModal(modalId);
                            this.removeAtIndex(index);
                          }
                        }
                      ]
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

            // const title = type.name;
            const title = _.startCase(pluralize(name, 1));

            // View modal with new value
            onPushModal(modalId, {
              path: newPath,
              type,
              title,
              name: title,
              isLookup,
              value: null,
              onChange: val => this.onItemChange(newIndex, val),
              onClose: () => {
                this.removeNulls();
                onResetFieldsAtPath(newPath);
              },
              actions: [
                {
                  title: 'Done',
                  callback: () => {
                    onPopModal(modalId);
                    this.removeNulls();
                  }
                }
              ]
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
