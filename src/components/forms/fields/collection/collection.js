import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Button, List, ListItem, Page, Toolbar } from 'react-onsenui';
import R from 'ramda';
import './collection.styl';

import { push as pushModal } from '../../../../redux/actions/modals';

import Field from '../../field';

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
  }

  onItemChange(index, val) {
    const { value, onChange } = this.props;
    const newValue = R.adjust(() => val, index, value); // Merge at index
    onChange(newValue);
  }

  render() {
    const { type, value, path, onPushModal } = this.props;
    console.log('Collection field path:', path);

    return (
      <div className="collection-field">
        <div className="accordian">
          {
            /* Existing items */
            value.map((item, index) =>
              <div key={index}>
                <Field
                  key={index}
                  type={type}
                  value={item}
                  onChange={val => this.onItemChange(index, val)}
                />
              </div>
            )
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
            onPushModal('foobar', { aFakeProp: 'hello' });
            // dataStore.resetFieldsAtPath(path);
          }}
        >New</Button>
      </div>
    );
  }
}

CollectionField.propTypes = {
  // domain: PropTypes.string,
  onChange: PropTypes.func,
  type: PropTypes.object.isRequired,
  value: PropTypes.array.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CollectionField);
