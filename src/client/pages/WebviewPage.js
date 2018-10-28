import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from "@material-ui/core/styles/index";
import {connect} from "react-redux";

const styles = {
};

class WebviewPage extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    const {classes} = this.props;
    return (
      <webview style={{height: '100%'}} src={this.props.pageUrl}/>
    )
  }
}

WebviewPage.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  const result = {};

  const tourType = state.player.tourType;

  if (state.tourPages.pages[tourType] !== null || typeof state.tourPages.pages[tourType] !== 'undefined') {
    const tourPages = state.tourPages.pages[tourType];
    const pageUrl = tourPages.url;
    result.pageUrl = pageUrl;
  }

  if (state.tourPages.interval[tourType] !== null || typeof state.tourPages.pages[tourType] !== 'undefined') {
    result.interval = state.tourPages.interval[tourType];
  }

  // const title = tour.pageUrl;
  // const thumbnail = tour.thumbnail;
  result.login = state.player.login;

  return result;
};

export default connect(mapStateToProps)(withStyles(styles)(WebviewPage));
