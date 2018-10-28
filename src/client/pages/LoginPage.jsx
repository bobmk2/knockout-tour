import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from "@material-ui/core/styles/index";
import {connect} from 'react-redux';

import Grid from '@material-ui/core/Grid';
import LoginForm from '../containers/LoginForm';

const styles = theme => ({
});

class LoginPage extends Component {
  constructor(props, context) {
    super(props, context);
  }
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
        style={{ minHeight: '100vh', display: this.props.login === true ? 'none' : null}}
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

const mapStateToProps = (state) => {
  return {
    initialized: state.player.initialized,
    login: state.player.login
  };
};

export default connect(mapStateToProps)(withStyles(styles)(LoginPage));
