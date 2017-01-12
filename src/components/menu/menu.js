import React from 'react';
import { observer } from 'mobx-react';
import { Icon, Page, SplitterSide } from 'react-onsenui';
import MenuBar from './menuBar';
import './menu.styl';

const Menu = observer(({ store, isOpen, onClose }) => (
  <SplitterSide
    className={'menu'}
    collapse
    isOpen={isOpen}
    isSwipeable={false}
    onClose={() => {}}
    onOpen={() => {}}
    style={{
      background: '#fff',
      width: '100% !important'
    }}
  >
    <Page
      renderToolbar={() =>
        <MenuBar menuAction={() => onClose()} />}
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

