import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { Icon, Toolbar, ToolbarButton } from 'react-onsenui';

const MenuBar = observer(({ menuAction }) => (
  <Toolbar>
    <div className="right">
      <ToolbarButton onClick={menuAction}>
        <Icon icon="md-close" />
      </ToolbarButton>
    </div>
    <div className="center" />
  </Toolbar>
));

MenuBar.propTypes = {
  menuAction: PropTypes.func
};

export default MenuBar;

