import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from "@material-ui/core/styles/index";
import {connect} from "react-redux";

import WebviewPage from '../pages/WebviewPage';
import LoginPage from '../pages/LoginPage';

const styles = {};



{/*<webview style={{marginTop: "64px", height: '100vh - 64px'}} src='https://google.com'/>*/}

class MainFrame extends Component {
  render() {
    const {classes} = this.props;
    return (
      <div className={classes.root} style={{marginTop: "64px", height: "calc(100vh - 64px)"}}>
        { this.props.login ? <WebviewPage /> : <LoginPage />}
      </div>
    )
  }
}

MainFrame.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  return {
    login: state.player.login
  };
};

export default connect(mapStateToProps)(withStyles(styles)(MainFrame));
