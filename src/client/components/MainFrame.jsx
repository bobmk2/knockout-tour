import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from "@material-ui/core/styles/index";

import Iframe from 'react-iframe';

const styles = {};

class MainFrame extends Component {
  render() {
    const {classes} = this.props;
    return (
      <div className={classes.root}>
        <Iframe url="http://kuramae-sushi.2018.nodeknockout.com"/>
      </div>
    )
  }
}

MainFrame.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(MainFrame);
