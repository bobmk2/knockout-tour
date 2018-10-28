import {UPDATE_ANOTHER_PLAYER_STATUS, JOINED_ANOTHER_PLAYER, REMOVED_ANOTHER_PLAYER} from "../actions/PlayerActions";

const _playerMap = {};

function _anotherPlayers(state = [], action) {
  let nextState;
  switch(action.type) {
    case JOINED_ANOTHER_PLAYER:
      // もういるのなら何もしない
      if (_playerMap.hasOwnProperty(action.anotherPlayer.id)) {
        return state;
      }
      nextState = [].concat(state, [action.anotherPlayer]);
      _playerMap[action.anotherPlayer.id] = action.anotherPlayer;
      console.log('JOINED_ANOTHER_PLAYER remain: ' + nextState.length)
      return nextState;
    case REMOVED_ANOTHER_PLAYER:
      nextState = state.filter(s => s.id !== action.anotherPlayer.id);
      delete _playerMap[action.anotherPlayer.id];
      console.log('REMOVED_ANOTHER_PLAYER remain: ' + nextState.length, state, action.anotherPlayer)
      return nextState;
    case UPDATE_ANOTHER_PLAYER_STATUS:
      if (_playerMap.hasOwnProperty(action.anotherPlayer.id)) {
        _playerMap[action.anotherPlayer.id] = action.anotherPlayer;
        // 古いのを消して新しいのを入れる
        nextState = state.filter(s => s.id !== action.anotherPlayer.id)
          .concat([action.anotherPlayer]);
        console.log('UPDATE_ANOTHER_PLAYER_STATUS found ' + nextState.length)
      } else {
        console.log('UPDATE_ANOTHER_PLAYER_STATUS not found'  + nextState.length)
      }
      return nextState;
    default:
      return state;
  }
}

module.exports = _anotherPlayers;
