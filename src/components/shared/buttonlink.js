import React, { PropTypes } from 'react';
import link from './link';

const Button = ({ children }) =>
  <Button>
    {children}
  </Button>;

Button.propTypes = {
  children: PropTypes.node
};

export default link(Button);
