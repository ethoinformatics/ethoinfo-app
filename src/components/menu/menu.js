import React from 'react';
import { observer } from 'mobx-react';
import { Icon, Page, SplitterSide } from 'react-onsenui';
import MenuBar from './menuBar';
import './menu.styl';

const Menu = observer(({ store }) => (
  <SplitterSide
    className={'menu'}
    collapse
    isOpen={store.menuIsOpen}
    isSwipeable={false}
    onClose={() => store.hideMenu()}
    onOpen={() => store.showMenu()}
    style={{
      background: '#fff',
      width: '100% !important'
    }}
  >
    <Page
      renderToolbar={() =>
        <MenuBar menuAction={() => store.hideMenu()} />}
    >
      <ul className="menuItems">
        {store.routes.map(item =>
          (<li className="menuItem" key={item.name} >
            <button onClick={() => item.action()}>
              <Icon icon={item.iconClass} />
              <span className="menuItemLabel">
                {item.name}
              </span>
            </button>
          </li>)
        )}
      </ul>
    </Page>
  </SplitterSide>
));

export default Menu;

