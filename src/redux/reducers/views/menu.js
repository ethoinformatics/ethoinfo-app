import {
  MENU_OPEN,
  MENU_CLOSE,
} from '../../actions/menu';

// -----------------------------------------------------------------------------
// PRIVATES

const defaultState = {
  isOpen: false,
};

// -----------------------------------------------------------------------------
// REDUCER

function menu(state = defaultState, action) {
  switch (action.type) {
    case MENU_OPEN:
      return {
        ...state,
        isOpen: true,
      };
    case MENU_CLOSE:
      return {
        ...state,
        isOpen: false,
      };
    default:
      break;
  }

  return state;
}

// -----------------------------------------------------------------------------
// EXPORTED REDUCER

export default menu;
