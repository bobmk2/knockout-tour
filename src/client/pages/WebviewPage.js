import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from "@material-ui/core/styles/index";
import {connect} from "react-redux";
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import FavoriteIcon from '@material-ui/icons/Favorite';
import CreateIcon from '@material-ui/icons/Create';

const {shell} = require('electron');

const styles = {
};

class WebviewPage extends Component {
  constructor(props, context) {
    super(props, context);
    this.openUrl = this.openUrl.bind(this);
  }

  openUrl(url) {
    return () => {
      shell.openExternal(url);
    }
  }

  render() {
    const {classes} = this.props;
    return (
      <div style={{position: 'relative', height: '100%', width: '100%'}}>
        {
          this.props.interval ?
            <div style={{zIndex: 1, position:'absolute', top: 0, left: 0, height: '100%', width: '100%', backgroundColor: '#000000CC'}}>
              <Grid
                className={classes.root}
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justify="center"
                style={{ minHeight: '100vh'}}
              >
                <Grid item xs={3}>
                  <Paper style={{width: "500px", padding: "20px"}}>
                    <Typography component="h4" variant="h4" gutterBottom>
                      <CircularProgress size={40} color='inherit'/>
                      10sec Interval
                    </Typography>
                    <Button
                      variant="contained"
                      color='primary'
                      onClick={this.openUrl(this.props.pageUrl)}
                    >
                      <FavoriteIcon/>
                      Open this in Browser
                    </Button>
                    <Button
                      variant="contained"
                      color='primary'
                      onClick={this.openUrl(this.props.entryUrl)}
                      style={{margin: '10px'}}
                     >
                      <CreateIcon/>
                      Open Entry Page
                    </Button>


                  </Paper>
                </Grid>
              </Grid>

            </div>
            :
            <div/>
        }
        <webview style={{zIndex:0, position:'absolute', top: 0, left: 0, width: '100%', height: '100%'}} src={this.props.pageUrl}/>
      </div>
    )
  }
}

WebviewPage.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  const result = {};

  const tourType = state.player.tourType;

  if (state.tourPages.pages[tourType] !== null && typeof state.tourPages.pages[tourType] !== 'undefined') {
    const tourPages = state.tourPages.pages[tourType];
    const pageUrl = tourPages.url;
    result.pageUrl = pageUrl;
    result.entryUrl = tourPages.entryUrl;
  }

  if (state.tourPages.interval[tourType] !== null && typeof state.tourPages.pages[tourType] !== 'undefined') {
    result.interval = state.tourPages.interval[tourType];
  }

  // const title = tour.pageUrl;
  // const thumbnail = tour.thumbnail;
  result.login = state.player.login;

  return result;
};

export default connect(mapStateToProps)(withStyles(styles)(WebviewPage));
