export const JOINED_ANOTHER_PLAYER = 'JOINED_ANOTHER_PLAYER';
export const UPDATE_ANOTHER_PLAYER_STATUS = 'UPDATE_ANOTHER_PLAYER_STATUS';
export const UPDATE_PLAYER_STATUS = 'UPDATE_PLAYER_STATUS';

function _joinedAnotherPlayer(anotherPlayer) {
  return {
    type: JOINED_ANOTHER_PLAYER,
    anotherPlayer
  }
}

function _updateAnotherPlayerStatus(anotherPlayer) {
  return {
    type: UPDATE_ANOTHER_PLAYER_STATUS,
    anotherPlayer
  };
}

function _updatePlayerStatus(player) {
  console.log('!!', player)
  return {
    type: UPDATE_PLAYER_STATUS,
    player
  };
}

export const joinedAnotherPlayer = anotherPlayer => {
  return (dispatch, getState) => {
    return dispatch(_joinedAnotherPlayer(anotherPlayer));
  }
};
export const updateAnotherPlayerStatus = anotherPlayer => {
  return (dispatch, getState) => {
    return dispatch(_updateAnotherPlayerStatus(anotherPlayer));
  };
};

export const updatePlayerStatus = player => {
  // console.log('!', player)
  return (dispatch, getState) => {
    return dispatch(_updatePlayerStatus(player));
  };
};
//
// module.exports = {
//   joinedAnotherPlayer,
//   updateAnotherPlayerStatus,
//   updatePlayerStatus
// }
