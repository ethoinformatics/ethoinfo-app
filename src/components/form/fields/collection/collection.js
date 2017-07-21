import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Icon, List, ListItem } from 'react-onsenui';
// import ons from 'onsenui';
import { notification } from 'onsenui';
import R from 'ramda';
import _ from 'lodash';
import moment from 'moment';
import pluralize from 'pluralize';
import './collection.styl';

import { resetFields } from '../../../../redux/actions/fields';
import { push as pushModal, pop as popModal } from '../../../../redux/actions/modals';

import { Types } from '../../../../schemas/schema';
import { getSchema } from '../../../../schemas/main';
import { getAll as getAllDocs } from '../../../../redux/reducers/documents';

// Map state to props
const mapStateToProps = (state, { domain }) =>
  ({
    docs: getAllDocs(state.docs),
    historyPath: state.views.history.path,
    schema: getSchema(domain)
  });

// Map dispatch to props
const mapDispatchToProps = dispatch => ({
  onPopModal: (id) => {
    dispatch(popModal(id));
  },
  onPushModal: (id, props) => {
    dispatch(pushModal(id, props));
  },
  onResetFields: (path) => {
    dispatch(resetFields(path));
  }
});

class CollectionField extends Component {
  constructor() {
    super();

    // Accordion state
    this.state = {
      isExpanded: false
    };

    // Bind context
    this.onItemChange = this.onItemChange.bind(this);
    this.onItemRemove = this.onItemRemove.bind(this);
    this.removeNulls = this.removeNulls.bind(this);
  }

  // Wraps onChange with extra logic for collections.
  onItemChange(itemPath, newItemValue) {
    const { onChange, path, value } = this.props;
    const relativeItemPath = R.drop(path.length, itemPath);

    /* console.log('*** Collection path: ', path);
    console.log('*** Collection value: ', this.props.value);
    console.log('*** Collection initial value:', this.props.initialValue);
    console.log('*** Item path: ', itemPath);
    console.log('*** Relative item path:', relativeItemPath);
    console.log('*** New item value: ', newItemValue); */

    const newCollectionValue = R.assocPath(relativeItemPath, newItemValue, value);
    // console.log('*** New value:', newCollectionValue);
    onChange(path, newCollectionValue);
  }

  onItemRemove(index) {
    const { onChange, path, value } = this.props;

    notification.confirm('Remove?')
    .then((response) => {
      if (response) {
        const newCollectionValue = R.remove(index, 1, value);
        onChange(path, newCollectionValue);
      }
    });
  }

  onItemReset(index) {
    console.log('Resetting!');
    const { value, onChange, initialValue, path } = this.props;
    const initialItemValue = initialValue[index];

    if (_.isNil(initialItemValue)) {
      // Initial value did not exist, so remove:
      this.removeAtIndex(index);
    } else {
      // Reset to initial value
      let newValue = R.adjust(() => (
      initialValue ? initialItemValue || null : null),
      index, value);

      // Remove nulls
      newValue = newValue.filter(item => !_.isNil(item));
      onChange(path, newValue);
    }
  }

  // How is the value represented?
  // Todo extract to another module.
  getDisplayText = (value, type) => {
    const { docs } = this.props;
    if (_.isNil(value)) {
      return null;
    }

    switch (type.constructor) {
      case Types.Date:
        return value ? moment(value) : null;

      case Types.String:
        return value;

      case Types.Number:
        return value;

      case Types.Category: {
        const { name: domainName } = type;

        const schema = getSchema(domainName);
        if (!schema) { return null; }

        const id = value._id;
        if (!id) { return null; }

        const doc = docs.find(instance => instance._id === id);
        if (!doc) { return null; }

        return doc.name;
        // return value;
      }

      case Types.Model: {
        const { name: domainName } = type;
        const schema = getSchema(domainName);
        if (!schema) { return null; }

        const id = value._id;
        if (!id) { return schema.getFriendlyString(value) || value[schema.displayField]; }

        const doc = docs.find(instance => instance._id === id);
        if (!doc) { return schema.getFriendlyString(value) || value[schema.displayField]; }

        // Nested docs won't have an id
        return schema.getFriendlyString(doc) || value[schema.displayField];
        // return schema.getFriendlyString(doc) || id;
      }

      default:
        return null;
    }
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

  renderHeader() {
    const { value, name, type } = this.props;

    // console.log('Header props:', type.constructor);

    const { name: domainName } = type;
    const schema = getSchema(domainName);

    const color = schema ? schema.displayColor : '#000';

    const { isExpanded } = this.state;

    // Header text is name of field and number of items in collection
    const text = `${_.startCase(name)} (${value.length})`;

    // Accordion icon depends on state.isExpanded
    const accordionIcon = isExpanded ? 'md-chevron-down' : 'md-chevron-right';

    return (
      <div className="collectionHeader">
        <button className="expandButton" onClick={() => this.setState({ isExpanded: !isExpanded })} >
          { /* Only show accordion button if we have items */ }
          {
            value && value.length > 0 &&
              <div
                className="accordionIcon"
              >
                <Icon icon={accordionIcon} />
              </div>
          }
          <div
            className="displayColor"
            style={{ backgroundColor: color }}
          />
          <div className="collectionHeaderLabel">{text}</div>
        </button>
        {this.renderNewButton()}
      </div>
    );
  }

  renderNewButton() {
    const {
      type,
      value,
      name,
      historyPath,
      path,
      onChange,
      onPushModal,
      onPopModal,
      isLookup,
      disabled,
    } = this.props;

    return (
      <Button
        className="newHeaderButton"
        disabled={disabled}
        modifier="quiet"
        onClick={(event) => {
          // Prevent propogation
          event.preventDefault();

          const newIndex = value.length;

          // Append index to path
          const newItemPath = [...path, newIndex];

          // Models need special handling for initial value or Ramda poops out
          // When trying to use assocPath on a null value
          const newItemValue = type.constructor === Types.Model ? {} : null;

          // onChange(newItemPath, newItemValue);

          /* --------- */
          const relativeItemPath = R.drop(path.length, newItemPath);

          const newCollectionValue = R.assocPath(
            relativeItemPath,
            newItemValue,
            this.props.value
          );

          // console.log('Creating a new entry', path, newCollectionValue);

          onChange(path, newCollectionValue);
          /* --------- */


          // Make an id string from path components
          const relativePath = R.tail(newItemPath).join('/');
          const absoluteHistoryPath = `${historyPath}/${relativePath}`;
          const modalId = absoluteHistoryPath;
          // const modalId = newItemPath.join('/');

          // const title = type.name;
          const title = _.startCase(pluralize(name, 1));

          // View modal with new value
          onPushModal(modalId, {
            disabled,
            path: newItemPath,
            type,
            title,
            name: title,
            isLookup,
            value: null,
            onChange: (__path, val) => this.onItemChange(__path, val),
            onClose: () => {
              // this.onItemReset(newIndex);
            },
            actions: [
              /* {
                title: 'Done',
                callback: () => {
                  onPopModal(modalId);
                }
              } */
            ]
          });
        }}
      ><Icon icon="md-plus" /></Button>
    );
  }

  render() {
    const {
      disabled,
      type,
      value,
      name,
      path,
      onPushModal,
      // onPopModal,
      historyPath,
      isLookup,
      initialValue
    } = this.props;

    const { isExpanded } = this.state;

    return (
      <div className="collectionField">
        {this.renderHeader()}

        <div className={`accordion ${isExpanded ? 'isExpanded' : ''}`}>
          {
            <List
              className="list"
              dataSource={value}
              renderRow={(row, index) =>
                <ListItem
                  key={index}
                  onClick={() => {
                    const itemPath = [...path, index];

                    const relativePath = R.tail(itemPath).join('/');
                    const absoluteHistoryPath = `${historyPath}/${relativePath}`;

                    // const modalId = itemPath.join('/');

                    const modalId = absoluteHistoryPath;


                    const title = _.startCase(pluralize(name, 1));

                    // View modal with new value
                    onPushModal(modalId, {
                      path: itemPath,
                      type,
                      name: title,
                      title,
                      isLookup,
                      initialValue: initialValue[index],
                      disabled,
                      value: value[index],
                      onChange: (_itemPath, val) => this.onItemChange(_itemPath, val),
                      onClose: () => {
                        // this.onItemReset(index);
                        // onResetFields(itemPath);
                      },
                      actions: [
                        /* {
                          title: 'Done',
                          callback: () => {
                            onPopModal(modalId);
                            // this.removeNulls();
                          }
                        },
                        {
                          title: 'Remove',
                          callback: () => {
                            onPopModal(modalId);
                            this.removeAtIndex(index);
                          }
                        } */
                      ]
                    });
                  }}
                >
                  { this.getDisplayText(value[index], type) }
                  <button
                    className="delete"
                    disabled={disabled}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (disabled) { return; }
                      this.onItemRemove(index);
                      // console.log('Should delete!');
                      // deleteDoc(_id, _rev);
                    }}
                  >
                    {
                      !disabled &&
                        <Icon icon="md-close" />
                    }
                    {
                      disabled &&
                        <Icon style={{ color: 'black' }} icon="ion-ios-locked-outline" />
                    }
                  </button>
                </ListItem>
              }
            />
          }
        </div>
      </div>
    );
  }
}

CollectionField.defaultProps = {
  docs: [],
  disabled: false,
  initialValue: []
};

CollectionField.propTypes = {
  name: PropTypes.string,
  disabled: PropTypes.bool,
  docs: PropTypes.array,
  historyPath: PropTypes.string,
  onPushModal: PropTypes.func,
  onPopModal: PropTypes.func,
  onChange: PropTypes.func,
  type: PropTypes.object.isRequired,
  isLookup: PropTypes.bool,
  initialValue: PropTypes.array,
  value: PropTypes.array.isRequired,
  path: PropTypes.array.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CollectionField);
