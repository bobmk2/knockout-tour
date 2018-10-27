import { combineReducers } from 'redux'
import {routerReducer} from 'react-router-redux';

import player from './Player';
import anotherPlayers from './AnotherPlayers';

const reducer = combineReducers({
  player,
  anotherPlayers,
  routing: routerReducer
});

module.exports = reducer;
