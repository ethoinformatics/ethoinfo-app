import React, { Component } from 'react';

const field = ({value, onChange}) => (WrappedComponent) => {
  return class Field extends Component {
    render() {
      return (
        <WrappedComponent {...this.props} fields={this.fields} />
      );
    }
  };
};

export default field;
