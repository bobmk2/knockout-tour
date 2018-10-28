import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import PersonIcon from '@material-ui/icons/Person';

import {updatePlayerStatus} from '../actions/PlayerActions';

const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

class Header extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      tourType: 3
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    const {dispatch} = this.props;
    // dispatch(updatePlayerStatus({id: 'x', name: 'y', tourType: 10}));
  }

  componentWillReceiveProps(nextProps) {
    const {dispatch} = nextProps;
    console.log('XXX')
    // dispatch(updatePlayerStatus({id: 'x', name: 'y', tourType: 10}));
  }


  handleChange(name) {
    return (event) => {
      // this.setState({[name]: event.target.value});
      const {dispatch} = this.props;
      dispatch(updatePlayerStatus({tourType: event.target.value}));
    }
  }

  render() {
    console.log('props', this.props)
    const {classes} = this.props;
    return (
        <AppBar position="fixed">
          <Toolbar>
            <Select
              value={this.props.tourType}
              onChange={this.handleChange('tourType')}
            >
              <option value={1}>1 minute</option>
              <option value={3}>3 minutes</option>
              <option value={5}>5 minutes</option>
              <option value={10}>10 minutes</option>
            </Select>
            <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
              <MenuIcon/>
            </IconButton>
            <Typography variant="title" color="inherit" className={classes.flex}>
              👊 Knockout Tour 🚀
            </Typography>
            {this.props.login === true ?
              <Button color='inherit'>
                <PersonIcon/>
                {this.props.anotherPlayers.filter(player => player.tourType === this.props.tourType).length + 1}
              </Button>
              :
              <Button disabled color='inherit'>
                <PersonIcon/>
                -
              </Button>
            }
            <Button color="inherit">Login</Button>
          </Toolbar>
        </AppBar>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  tourType: PropTypes.number.isRequired
};

const mapStateToProps = (state) => {
  console.log('Header ', state.player)
  return {
    tourType: state.player.tourType,
    anotherPlayers: state.anotherPlayers,
    initialized: state.player.initialized,
    login: state.player.login
  };
};

export default connect(mapStateToProps)(withStyles(styles)(Header));
