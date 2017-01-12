export const UPDATE_HISTORY = 'HISTORY_UPDATE';

export function updateHistory(location) {
  return { type: UPDATE_HISTORY, payload: location };
}
