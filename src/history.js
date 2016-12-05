import createHistory from 'history/createMemoryHistory';

// Create history object for managing history stack
// https://github.com/mjackson/history
export default createHistory({
  initialEntries: [],  // The initial URLs in the history stack
  initialIndex: 0 // The starting index in the history stack
});
