import React from 'react';
import { observer } from 'mobx-react';
import { Icon, Toolbar, ToolbarButton } from 'react-onsenui';
import './navbar.styl';

const Navbar = observer(({ leftItem, rightItem, title }) => (
  <Toolbar>
    {
    }
    <div className="left">
      <ToolbarButton
        onClick={() => leftItem && leftItem.action()}
      >
        <Icon icon={leftItem ? leftItem.icon : ''} />
      </ToolbarButton>
    </div>
    <div className="center">
      {title}
    </div>
    <div className="right">
      <ToolbarButton
        onClick={() => rightItem && rightItem.action()}
      >
        <Icon icon={rightItem ? rightItem.icon : ''} />
      </ToolbarButton>
    </div>
  </Toolbar>
));

Navbar.propTypes = {
  leftItem: React.PropTypes.shape({
    action: React.PropTypes.func.isRequired,
    icon: React.PropTypes.string.isRequired
  }),
  rightItem: React.PropTypes.shape({
    action: React.PropTypes.func.isRequired,
    icon: React.PropTypes.string.isRequired
  }),
  title: React.PropTypes.string
};

export default Navbar;

