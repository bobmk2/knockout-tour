import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from "@material-ui/core/styles/index";

const styles = {};

class MainFrame extends Component {
  render() {
    const {classes} = this.props;
    return (
      <div className={classes.root}>
        {/*<Iframe url="https://google.com"/>*/}
        <webview src="https://google.com"/>
      </div>
    )
  }
}

MainFrame.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(MainFrame);
