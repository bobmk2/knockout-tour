export const MOVE_TOUR_PAGE = 'MOVE_TOUR_PAGE';
export const START_INTERVAL_PAGE = 'START_INTERVAL_PAGE';

function _moveTourPage(tourType, tourPage) {
  return {
    type: MOVE_TOUR_PAGE,
    tourType,
    tourPage
  }
}

export const moveTourPage = (tourType, tourPage) => {
  return dispatch => {
    return dispatch(_moveTourPage(tourType, tourPage));
  }
};


function _startInterval(tourType) {
  return {
    type: START_INTERVAL_PAGE,
    tourType
  }
}

export const startIntervalPage = tourType => {
  return dispatch => {
    return dispatch(_startInterval(tourType));
  }
};
