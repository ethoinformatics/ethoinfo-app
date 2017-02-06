import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Button, List, ListItem, Page, Toolbar } from 'react-onsenui';
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
    const { type, value, path, onChange, onPushModal } = this.props;

    return (
      <div className="collection-field">
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
                <ListItem key={index}>Hello</ListItem>
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
              value: R.last(value),
              onChange: val => this.onItemChange(newIndex, val),
              onClose: () => { this.removeNulls(); }
            });
            // dataStore.resetFieldsAtPath(path);
          }}
        >New</Button>
      </div>
    );
  }
}

CollectionField.propTypes = {
  // domain: PropTypes.string,
  onPushModal: PropTypes.func,
  onChange: PropTypes.func,
  type: PropTypes.object.isRequired,
  value: PropTypes.array.isRequired,
  path: PropTypes.array.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CollectionField);
