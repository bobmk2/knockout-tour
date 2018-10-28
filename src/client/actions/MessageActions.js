export const POSTED_MESSAGE = 'POSTED_MESSAGE';
export const UPDATE_MESSAGE_COUNT = 'UPDATE_MESSAGE_COUNT';

export const REQUEST_SEND_MESSAGE = 'REQUEST_SEND_MESSAGE';

import fetch from 'isomorphic-fetch'

function _postedMessage(message) {
  return {
    type: POSTED_MESSAGE,
    message
  }
}

function _updateMessageCount(tourType, totalCount) {
  return {
    type: UPDATE_MESSAGE_COUNT,
    tourType,
    totalCount
  }
}

export const postedMessage = (message) => {
  return dispatch => {
    return dispatch(_postedMessage(message));
  };
}

export const updateMessageCount = (tourType, totalCount) => {
  return dispatch => {
    return dispatch(_updateMessageCount(tourType, totalCount));
  }
}

function _sendMessage(message) {
  return dispatch => {
    return fetch('$socket.io_URL$/api/message/B9KjbXT58zJXGzYiirmF54rB8uVMuZm5', {
      method: 'POST',
      body: JSON.stringify(message),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(function(response) {
        // handle HTTP response
        console.log(response);
      }, function(error) {
        // handle network error
        console.log(error.message);
      })  };
}

export const sendMessage = (message) => {
  return (dispatch, getState) => {
    return dispatch(_sendMessage(message))
  };
};
