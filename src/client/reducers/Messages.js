import {POSTED_MESSAGE, UPDATE_MESSAGE_COUNT} from '../actions/MessageActions';

function _messages(state = {messages: {1: [], 3: [], 5: []}, counts: {1: null, 3: null, 5: null}}, action) {
  let nextState;
  switch(action.type) {
    case POSTED_MESSAGE:
      nextState = Object.assign({}, state);
      console.log(`POSTED_MESSAGE [${action.message.tourType}]`, state, nextState);
      return nextState;
    case UPDATE_MESSAGE_COUNT:
      nextState = Object.assign({}, state);
      nextState.counts[action.tourType] = action.totalCount;
      console.log(`UPDATE_MESSAGE_COUNT [${action.tourType}]`, state, nextState);
      return nextState;
    default:
      return state;
  }
}

export default _messages;
