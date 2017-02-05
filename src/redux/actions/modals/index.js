/* eslint-disable import/prefer-default-export */

export const MODAL_PUSH = 'MODAL_PUSH';
export const MODAL_POP = 'MODAL_POP';

export function push(id, props) {
  return {
    type: MODAL_PUSH,
    payload: { id, props }
  };
}

export function pop(id) {
  return {
    type: MODAL_POP,
    payload: { id }
  };
}
