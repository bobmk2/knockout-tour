export const JOINED_ANOTHER_PLAYER = 'JOINED_ANOTHER_PLAYER';
export const REMOVED_ANOTHER_PLAYER = 'REMOVED_ANOTHER_PLAYER';
export const UPDATE_ANOTHER_PLAYER_STATUS = 'UPDATE_ANOTHER_PLAYER_STATUS';
export const UPDATE_PLAYER_STATUS = 'UPDATE_PLAYER_STATUS';
export const LOGIN_PLAYER = 'LOGIN_PLAYER';
export const INITIALIZED = 'INITIALIZED';

function _initialized(name) {
  return {
    type: INITIALIZED,
    name
  }
}

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

function _removeAnotherPlayer(anotherPlayer) {
  return {
    type: REMOVED_ANOTHER_PLAYER,
    anotherPlayer
  }
}

function _updatePlayerStatus(player) {
  return {
    type: UPDATE_PLAYER_STATUS,
    player
  };
}

function _loginPlayer(player) {
  return {
    type: LOGIN_PLAYER,
    player
  }
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

export const removedAnotherPlayer = anotherPlayer => {
  return dispatch => {
    return dispatch(_removeAnotherPlayer(anotherPlayer));
  }
}

export const updatePlayerStatus = player => {
  // console.log('!', player)
  return (dispatch, getState) => {
    return dispatch(_updatePlayerStatus(player));
  };
};

export const loginPlayer = player => {
  console.log('login')
  return (dispatch) => {
    return dispatch(_loginPlayer(player));
  }
}

export const initialized = (userName) => {
  return dispatch => {
    return dispatch(_initialized(userName));
  }
}

//
// module.exports = {
//   joinedAnotherPlayer,
//   updateAnotherPlayerStatus,
//   updatePlayerStatus
// }
