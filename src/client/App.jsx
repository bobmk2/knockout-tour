import React from 'react';

import Header from './components/Header';
import MainFrame from './components/MainFrame';


export default class App extends React.Component {
  render() {
    return (
      <div>
        <Header/>
        <MainFrame/>
      </div>
    )
  }
}
