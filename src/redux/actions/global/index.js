
// ------------------------------------------------------------
// GLOBAL TRANSACTIONS

export const GLOBAL_TRANSACTION_BEGIN =
  'GLOBAL_TRANSACTION_BEGIN';

export const GLOBAL_TRANSACTION_END =
  'GLOBAL_TRANSACTION_END';

export function beginTransaction() {
  return { type: GLOBAL_TRANSACTION_BEGIN };
}

export function endTransaction() {
  return { type: GLOBAL_TRANSACTION_END };
}

// ------------------------------------------------------------
// GLOBAL MESSAGES

export const GLOBAL_MESSAGE_CREATE = 'GLOBAL_MESSAGE_CREATE';
export const GLOBAL_MESSAGE_MARK_READ = 'GLOBAL_MESSAGE_MARK_READ';

export function createMessage(message = '') {
  return { type: GLOBAL_MESSAGE_CREATE, payload: message };
}

export function markMessageAsRead(id) {
  return { type: GLOBAL_MESSAGE_MARK_READ, payload: id };
}

// ------------------------------------------------------------
// DEBUG LOG
export const GLOBAL_DEBUG_LOG_MESSAGE_CREATE =
  'GLOBAL_DEBUG_LOG_MESSAGE_CREATE';

export function createLogMessage(message = '') {
  return { type: GLOBAL_DEBUG_LOG_MESSAGE_CREATE, payload: message };
}

