import {INITIALIZED, UPDATE_PLAYER_STATUS, LOGIN_PLAYER} from "../actions/PlayerActions";

import Socket from '../socket/Socket';
import storage from 'electron-json-storage';

function _player(state = {name: ' ', tourType: 3, login: false, initialized: false}, action) {
  let nextState;
  switch (action.type) {
    case UPDATE_PLAYER_STATUS:
      nextState = Object.assign({}, state, action.player);
      console.log('update player status', nextState);
      // console.log('state', state)
      // console.log('xxx', JSON.stringify(Object.assign({}, state, {player: action.player})))
      if (state.login) {
        // ログイン済みのときだけ共有する
        Socket.updatePlayer(nextState);
      }
      return nextState;
    case LOGIN_PLAYER:
      nextState = Object.assign({}, state, action.player.toJSON(), {login: true});
      Socket.loginPlayer(nextState);
      storage.set('name', action.player.name, err => {});
      return nextState;
    case INITIALIZED:
      console.log('XXX NAME ', action.name);
      nextState = Object.assign({}, state, {name: action.name, initialized: true});
      return nextState;
    default:
      return state;
  }
}


export default _player;
