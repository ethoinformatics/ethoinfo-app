import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Button, Icon, List, ListItem } from 'react-onsenui';
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
      isExpanded: true
    };

    // Bind context
    this.onItemChange = this.onItemChange.bind(this);
    this.removeNulls = this.removeNulls.bind(this);
  }

  // Wraps onChange with extra logic for collections.
  onItemChange(itemPath, newItemValue) {
    const { onChange } = this.props;
    // const newValue = R.adjust(() => newItemValue, index, value); // Merge at index
    console.log('**** collection onItemChange:', itemPath, newItemValue);

    onChange(itemPath, newItemValue);
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
    const { value, name } = this.props;
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
      path,
      onChange,
      onPushModal,
      onPopModal,
      isLookup
    } = this.props;

    return (
      <Button
        className="newHeaderButton"
        modifier="quiet"
        onClick={(event) => {
          // Prevent propogation
          event.preventDefault();

          // Push a new value to the end of collection
          const newCollectionValue = [...value, null];

          // Index of new item is last array index
          const newIndex = newCollectionValue.length - 1;

          // Append index to path
          const newPath = [...path, newIndex];

          // Models need special handling for initial value or Ramda poops out
          // When trying to use assocPath on a null value
          const newItemValue = type.constructor === Types.Model ? {} : null;

          onChange(newPath, newItemValue);

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
            onChange: (__path, val) => this.onItemChange(__path, val),
            onClose: () => {
              // this.onItemReset(newIndex);
            },
            actions: [
              {
                title: 'Done',
                callback: () => {
                  onPopModal(modalId);
                }
              }
            ]
          });
        }}
      ><Icon icon="md-plus" /></Button>
    );
  }

  render() {
    const {
      type,
      value,
      name,
      path,
      onPushModal,
      onPopModal,
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
                    const modalId = itemPath.join('/');

                    const title = _.startCase(pluralize(name, 1));

                    // View modal with new value
                    onPushModal(modalId, {
                      path: itemPath,
                      type,
                      name: title,
                      title,
                      isLookup,
                      initialValue: initialValue[index],
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
  initialValue: []
};

CollectionField.propTypes = {
  name: PropTypes.string,
  docs: PropTypes.array,
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
