import {combineReducers} from 'redux';
import {UPDATE_PLAYER_STATUS} from "../actions/PlayerActions";

import Socket from '../socket/Socket';

function _player(state = {name: null, tourType: 3}, action) {
  switch (action.type) {
    case UPDATE_PLAYER_STATUS:
      const nextState = Object.assign({}, state, action.player);
      console.log('update player status', nextState);
      // console.log('state', state)
      // console.log('xxx', JSON.stringify(Object.assign({}, state, {player: action.player})))
      Socket.updatePlayer(nextState);
      return nextState;
    default:
      console.log('not matched')
      return state;
  }
}


export default _player;
