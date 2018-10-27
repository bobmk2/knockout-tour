import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {BrowserRouter as Router, Route} from 'react-router-dom';

const rootElement = document.getElementById('app');
ReactDOM.render(
<Router>
<Route path="/" component={App}>
  </Route>
  </Router>
  , rootElement
);
