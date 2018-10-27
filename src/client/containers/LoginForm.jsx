import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from "@material-ui/core/styles/index";
// import FormControl from '@material-ui/core/FormControl';
// import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';

import Paper from '@material-ui/core/Paper';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PersonIcon from '@material-ui/icons/Person';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import Badge from '@material-ui/core/Badge';

import Player from '../../both/socket/objects/Player';

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
      name: 'Anonymous',
      tourType: 3
    };

    this.handleTourTypeClick = this.handleTourTypeClick.bind(this);
  }

  handleChange(name) {
    return event => {
      this.setState({
        [name]: event.target.value,
      });
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
      const _player = new Player({id: -1, name: this.state.name, tourType: this.state.tourType});
      
    };
  }

  render() {
    const {classes} = this.props;

    return (
      <form className={classes.root} autoComplete="off">
        {/*<FormControl>*/}
          {/*<InputLabel htmlFor='name'>Name</InputLabel>*/}
          {/**/}
        {/*</FormControl>*/}
        <TextField
          id="login-name"
          label="Name"
          className={classes.textField}
          value={this.state.name}
          onChange={this.handleChange('name')}
          margin="normal"
        />
        <FormControl component="fieldset" className={classes.tourTypeMenu}>
          <FormLabel component="legend" className={classes.tourTypeMenuLabel}>Tour Type</FormLabel>
          <Paper>
            <MenuList>
              <MenuItem className={classes.menuItem} selected={this.state.tourType === 1} onClick={this.handleTourTypeClick(1)}>
                <ListItemText classes={{ primary: classes.primary }} primary="1 minute Tour "/>
                <ListItemIcon className={classes.icon}>
                  <Badge className={classes.margin} badgeContent={0} color="secondary">
                    <PersonIcon/>
                  </Badge>
                </ListItemIcon>
              </MenuItem>
              <MenuItem className={classes.menuItem} selected={this.state.tourType === 3} onClick={this.handleTourTypeClick(3)}>
                <ListItemText classes={{ primary: classes.primary }} primary="3 minutes Tour "/>
                <ListItemIcon className={classes.icon}>
                  <Badge className={classes.margin} badgeContent={0} color="secondary">
                    <PersonIcon/>
                  </Badge>
                </ListItemIcon>
              </MenuItem>
              <MenuItem className={classes.menuItem} selected={this.state.tourType === 5} onClick={this.handleTourTypeClick(5)}>
                <ListItemText classes={{ primary: classes.primary }} primary="5 minutes Tour "/>
                <ListItemIcon className={classes.icon}>
                  <Badge className={classes.margin} badgeContent={0} color="secondary">
                    <PersonIcon/>
                  </Badge>
                </ListItemIcon>
              </MenuItem>
            </MenuList>
          </Paper>
        </FormControl>
        <Button variant="contained" color="primary" className={classes.loginButton} onClick={this.handleStartButtonClick()}>
          <PlayArrowIcon className={classes.loginIcon}/>
          Start Tour
        </Button>
      </form>
    );
  }
}

LoginForm.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(LoginForm);
