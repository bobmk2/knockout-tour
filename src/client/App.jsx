import React from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';

export default class App extends React.Component {
  render() {
    return (
      <div>
        Hello World!!! 🍣
        <MuiThemeProvider>
          <RaisedButton label="test" />
        </MuiThemeProvider>
      </div>
    )
  }
}
