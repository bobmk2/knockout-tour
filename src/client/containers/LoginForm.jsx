import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from "@material-ui/core/styles/index";
import {connect} from 'react-redux';

// import FormControl from '@material-ui/core/FormControl';
// import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import DirectionsBoatIcon from '@material-ui/icons/DirectionsBoat';

import Paper from '@material-ui/core/Paper';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PersonIcon from '@material-ui/icons/Person';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import Badge from '@material-ui/core/Badge';
import {Link} from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';

import Player from '../../both/socket/objects/Player';
import {loginPlayer, updatePlayerStatus} from "../actions/PlayerActions";

const styles = theme => ({
  // menuItem: {
  //   '&:focus': {
  //     backgroundColor: theme.palette.primary.main,
  //     '& $primary, & $icon': {
  //       color: theme.palette.common.white,
  //     },
  //     '& $badge': {
  //       color: theme.palette.common.black
  //     }
  //   },
  // },
  primary: {},
  icon: {},
  tourTypeMenu: {
    marginTop: '10px',
    marginBottom: '10px'
  },
  tourTypeMenuLabel: {
    marginBottom: '3px'
  }
});

class LoginForm extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      tourType: 3
    };

    this.handleTourTypeClick = this.handleTourTypeClick.bind(this);
    this.handleStartButtonClick = this.handleStartButtonClick.bind(this);
  }

  handleChange(name) {
    return event => {
      // this.setState({
      //   [name]: event.target.value,
      // });
      const {dispatch} = this.props;
      dispatch(updatePlayerStatus({name: event.target.value}))
    };
  };

  handleTourTypeClick(value) {
    return () => {
      this.setState({
        ['tourType']: value
      });
    };
  }

  handleStartButtonClick() {
    return () => {
      const _player = new Player({id: -1, name: this.props.name, tourType: this.state.tourType});
      const {dispatch} = this.props;
      dispatch(loginPlayer(_player));
    };
  }

  render() {
    const {classes} = this.props;

    const oneMinPersons = this.props.anotherPlayers.filter(s => s.tourType === 1).length;
    const threeMinPersons = this.props.anotherPlayers.filter(s => s.tourType === 3).length;
    const fiveMinPersons = this.props.anotherPlayers.filter(s => s.tourType === 5).length;

    return (
      <form className={classes.root} autoComplete="off">
        {/*<FormControl>*/}
          {/*<InputLabel htmlFor='name'>Name</InputLabel>*/}
          {/**/}
        {/*</FormControl>*/}
        <TextField
          error={this.props.name.length === 0}
          id="login-name"
          label="Name"
          className={classes.textField}
          value={this.props.name}
          onChange={this.handleChange('name')}
          margin="normal"
          disabled={this.props.login === true || this.props.initialized === false}
        />
        <FormControl component="fieldset" className={classes.tourTypeMenu} disabled={this.props.login === true}>
          <FormLabel component="legend" className={classes.tourTypeMenuLabel}>Tour Type</FormLabel>
          <Paper>
            <MenuList>
              <MenuItem disabled={this.props.login === true || this.props.initialized === false} className={classes.menuItem} selected={this.state.tourType === 1} onClick={this.handleTourTypeClick(1)}>
                <ListItemText classes={{ primary: classes.primary }} primary="1 minute Tour "/>
                <ListItemIcon className={classes.icon}>
                  {this.props.initialized === false ? <PersonIcon/> : <Badge className={classes.margin} badgeContent={oneMinPersons} color="secondary">
                    <PersonIcon/>
                  </Badge>
                  }
                </ListItemIcon>
              </MenuItem>
              <MenuItem disabled={this.props.login === true || this.props.initialized === false} className={classes.menuItem} selected={this.state.tourType === 3} onClick={this.handleTourTypeClick(3)}>
                <ListItemText classes={{ primary: classes.primary }} primary="3 minutes Tour "/>
                <ListItemIcon className={classes.icon}>
                  {this.props.initialized === false ? <PersonIcon/> : <Badge className={classes.margin} badgeContent={threeMinPersons} color="secondary">
                    <PersonIcon/>
                  </Badge>
                  }
                </ListItemIcon>
              </MenuItem>
              <MenuItem disabled={this.props.login === true || this.props.initialized === false} className={classes.menuItem} selected={this.state.tourType === 5} onClick={this.handleTourTypeClick(5)}>
                <ListItemText classes={{ primary: classes.primary }} primary="5 minutes Tour "/>
                <ListItemIcon className={classes.icon}>
                  {this.props.initialized === false ? <PersonIcon/> : <Badge className={classes.margin} badgeContent={fiveMinPersons} color="secondary">
                    <PersonIcon/>
                  </Badge>
                  }
                </ListItemIcon>
              </MenuItem>
            </MenuList>
          </Paper>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          className={classes.loginButton}
          onClick={this.handleStartButtonClick()}
          disabled={this.props.initialized === false || this.props.login === true || this.props.name.length === 0}
          // component={Link}
          // to="/tour"
        >
          {this.props.initialized === false ? <CircularProgress size={20} style={{marginRight: '5px'}} color='inherit'/> : <DirectionsBoatIcon className={classes.loginIcon} style={{marginRight: '5px'}}/>}
          {this.props.initialized === false ? "Loading..." : "Start Tour"}
        </Button>
      </form>
    );
  }
}

LoginForm.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  return {
    name: state.player.name,
    anotherPlayers: state.anotherPlayers,
    initialized: state.player.initialized,
    login: state.player.login
  };
};

export default connect(mapStateToProps)(withStyles(styles)(LoginForm));
