// import R from 'ramda';
import uuid from 'uuid';

import {
  GLOBAL_MESSAGE_CREATE,
  GLOBAL_MESSAGE_MARK_READ,
  GLOBAL_TRANSACTION_BEGIN,
  GLOBAL_TRANSACTION_END,
} from '../../actions/global';

// -----------------------------------------------------------------------------
// PRIVATES

const defaultState = {
  messages: [],
  transactionInProgress: false,
};

// -----------------------------------------------------------------------------
// REDUCER

function global(state = defaultState, action) {
  switch (action.type) {
    case GLOBAL_MESSAGE_CREATE: {
      const newMessage = { id: uuid.v4(), text: action.payload };
      return { ...state, messages: [...state.messages, newMessage] };
    }
    case GLOBAL_MESSAGE_MARK_READ: {
      return { ...state, messages: state.messages.filter(m => m.id !== action.payload) };
    }
    case GLOBAL_TRANSACTION_BEGIN:
      return { ...state, ...{ transactionInProgress: true } };
    case GLOBAL_TRANSACTION_END:
      return { ...state, ...{ transactionInProgress: false } };
    default:
      break;
  }
  return state;
}

// -----------------------------------------------------------------------------
// EXPORTED SELECTORS

// Todo . . .

// -----------------------------------------------------------------------------
// EXPORTED REDUCER

export default global;
