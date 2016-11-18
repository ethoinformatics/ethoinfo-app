import React from 'react';
import { observer } from 'mobx-react';
import { Icon, Toolbar, ToolbarButton } from 'react-onsenui';
import './navbar.styl';

const Navbar = observer(({ menuAction, title }) => (
  <Toolbar>
    <div className="left">
      <ToolbarButton onClick={menuAction}>
        <Icon icon="md-menu" />
      </ToolbarButton>
    </div>
    <div className="center">
      {title}
    </div>
  </Toolbar>
));

Navbar.propTypes = {
  menuAction: React.PropTypes.func,
  title: React.PropTypes.string
};

export default Navbar;

