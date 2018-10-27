import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import LoginPage from './pages/LoginPage';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import socket from './socket/Socket';
import Player from '../both/socket/objects/Player';

import { createStore, applyMiddleware} from 'redux'
import reducers from './reducers';
import thunk from 'redux-thunk';
import {Provider} from 'react-redux'

const store = createStore(
  reducers,
  applyMiddleware(thunk)
);

socket.initialize();

socket.emitPlayer(new Player({id: -1, name: 'test' + (Math.round(Math.random() * 100)), tourType: 3}));

const rootElement = document.getElementById('app');
ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Route path="/" component={LoginPage}/>
      {/*<Route path="/" component={App}/>*/}
    </Router>
  </Provider>
  , rootElement
);
