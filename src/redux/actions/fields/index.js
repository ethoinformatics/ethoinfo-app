export const FIELD_SET = 'SET_FIELD';
export const FIELDS_RESET = 'RESET_FIELDS';


// -----------------------------------------------------------------------------
// EXPORTED ACTION CREATORS

// Set data input field.
// Path is pathway to some state value
export function setField(path, value) {
  return {
    type: FIELD_SET,
    payload: {
      path,
      value
    }
  };
}

export function resetFields(path) {
  return {
    type: FIELDS_RESET,
    payload: { path }
  };
}
