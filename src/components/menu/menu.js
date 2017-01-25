import React, { PropTypes } from 'react';
import { Icon, Page, SplitterSide } from 'react-onsenui';
import MenuBar from './menuBar';
import history from '../../history';

import './menu.styl';

const Menu = (props) => {
  const { items, isOpen, onClose } = props;

  const splitterProps = {
    className: 'menu',
    collapse: true,
    isOpen,
    isSwipeable: false
  };

  const renderToolbar = () =>
    <MenuBar menuAction={() => onClose()} />;

  const MenuLink = ({ icon, name, route }) => // eslint-disable-line react/prop-types
    <button onClick={() => history.push(route, {})}>
      <Icon icon={icon} />
      <span className="menuItemLabel">
        {name}
      </span>
    </button>;

  return (
    <SplitterSide {...splitterProps}>
      <Page renderToolbar={renderToolbar}>
        <ul className="menuItems">
          {items.map((item, index) =>
            <li className="menuItem" key={index}>
              <MenuLink {...item} />
            </li>
          )}
        </ul>
      </Page>
    </SplitterSide>);
};

/* eslint-disable react/no-unused-prop-types */
Menu.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      route: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired
    })
  )
};

export default Menu;

