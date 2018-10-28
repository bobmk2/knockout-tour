import { combineReducers } from 'redux'
import {routerReducer} from 'react-router-redux';

import player from './Player';
import tourPages from './TourPage';
import anotherPlayers from './AnotherPlayers';
import messages from './Messages';

const reducer = combineReducers({
  player,
  tourPages,
  anotherPlayers,
  messages,
  routing: routerReducer
});

module.exports = reducer;
