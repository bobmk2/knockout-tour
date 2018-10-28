import {MOVE_TOUR_PAGE, START_INTERVAL_PAGE} from '../actions/TourActions';

import socket from '../socket/Socket';

function _tourPages(state = {pages: {1: null, 3: null, 5: null}, interval: {1: false, 3: false, 5: false}}, action) {
  let nextState;
  switch(action.type) {
    case MOVE_TOUR_PAGE:
      nextState = Object.assign({}, state);
      nextState.pages[action.tourType] = action.tourPage;
      nextState.interval[action.tourType] = false;
      console.log(`MOVE_TOUR_PAGE [${action.tourType}]`, state, nextState, action);
      return nextState;
    case START_INTERVAL_PAGE:
      nextState = Object.assign({}, state);
      nextState.interval[action.tourType] = true;
      console.log(`START_INTERVAL_PAGE [${action.tourType}]`, state, nextState, action);
      return nextState;
    default:
        return state;
  }
}


export default _tourPages;
