export const SET_FIELD = 'SET_FIELD';
export const RESET_FIELDS = 'RESET_FIELDS';
export const SAVE_FIELDS = 'SAVE_FIELDS';

// Set data input field.
// Path is pathway to some state value
export function setField(path, value) {
  return {
    type: SET_FIELD,
    payload: {
      path,
      value
    }
  };
}

export function resetFields(path) {
  return {
    type: RESET_FIELDS,
    payload: { path }
  };
}
