import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Toolbar, ToolbarButton } from 'react-onsenui';
import './navbar.styl';

const Navbar = ({ leftItem, rightItem, title, children }) => (
  <Toolbar className={(children && 'navbar withChildren') || 'navbar'}>
    <div className="left">
      <ToolbarButton
        onClick={() => leftItem && leftItem.action()}
      >
        <Icon icon={leftItem ? leftItem.icon : ''} />
      </ToolbarButton>
    </div>
    <div className="center">
      {/* Render children if we have them or render title prop */}
      {(children && children) || title}
    </div>
    <div className="right">
      <ToolbarButton
        onClick={() => rightItem && rightItem.action()}
      >
        <Icon icon={rightItem ? rightItem.icon : ''} />
      </ToolbarButton>
    </div>
  </Toolbar>
);

Navbar.propTypes = {
  leftItem: PropTypes.shape({
    action: PropTypes.func.isRequired,
    icon: PropTypes.string.isRequired
  }),
  rightItem: PropTypes.shape({
    action: PropTypes.func.isRequired,
    icon: PropTypes.string.isRequired
  }),
  title: PropTypes.string,
  children: PropTypes.node
};

export default Navbar;

