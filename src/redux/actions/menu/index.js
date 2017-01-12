/* @flow */
/* eslint-disable import/prefer-default-export */

export const MENU_OPEN = 'MENU_OPEN';
export const MENU_CLOSE = 'MENU_CLOSE';

export function open() {
  return { type: MENU_OPEN };
}

export function close() {
  return { type: MENU_CLOSE };
}
