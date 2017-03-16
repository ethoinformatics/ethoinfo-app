import React from 'react';
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
  leftItem: React.PropTypes.shape({
    action: React.PropTypes.func.isRequired,
    icon: React.PropTypes.string.isRequired
  }),
  rightItem: React.PropTypes.shape({
    action: React.PropTypes.func.isRequired,
    icon: React.PropTypes.string.isRequired
  }),
  title: React.PropTypes.string,
  children: React.PropTypes.node
};

export default Navbar;

