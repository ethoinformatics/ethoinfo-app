import React, { PropTypes } from 'react';
import history from '../../history';

const Link = ({ to, ...rest }) => WrappedComponent =>
  <WrappedComponent onClick={() => history.push(to, {})} {...rest} />;

Link.propTypes = {
  to: PropTypes.string.isRequired
};

export default Link;
