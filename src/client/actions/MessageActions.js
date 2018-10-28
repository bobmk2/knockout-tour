export const POSTED_MESSAGE = 'POSTED_MESSAGE';
export const UPDATE_MESSAGE_COUNT = 'UPDATE_MESSAGE_COUNT';

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
