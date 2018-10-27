import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from "@material-ui/core/styles/index";

import Grid from '@material-ui/core/Grid';
import LoginForm from '../containers/LoginForm';

const styles = theme => ({
});

class LoginPage extends Component {
  render() {
    const {classes} = this.props;
    return (
      <Grid
        className={classes.root}
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: '100vh' }}
      >
        <Grid item xs={3}>
          <LoginForm/>
        </Grid>
      </Grid>
    );
  }
}

LoginPage.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(LoginPage);
