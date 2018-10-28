import { combineReducers } from 'redux'
import {routerReducer} from 'react-router-redux';

import player from './Player';
import tourPages from './TourPage';
import anotherPlayers from './AnotherPlayers';

const reducer = combineReducers({
  player,
  tourPages,
  anotherPlayers,
  routing: routerReducer
});

module.exports = reducer;
