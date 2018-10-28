import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import FormHelperText from '@material-ui/core/FormHelperText';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import PersonIcon from '@material-ui/icons/Person';
import ChatIcon from '@material-ui/icons/Chat';
import LinearProgress from '@material-ui/core/LinearProgress';
import FilledInput from '@material-ui/core/FilledInput';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Paper from '@material-ui/core/Paper';
import DirectionsBoatIcon from '@material-ui/icons/DirectionsBoat';
import TextField from '@material-ui/core/TextField';
import SendIcon from '@material-ui/icons/Send';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';

const {toMinSecStr} = require('../utils/StringUtil');

import {loginPlayer, updatePlayerStatus} from '../actions/PlayerActions';
import {sendMessage} from '../actions/MessageActions';

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
  colorPrimary: {
    backgroundColor: '#BDBDBD',
  },
  barColorPrimary: {
    backgroundColor: '#707070',
  },
};

class Header extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      tourType: 3,
      passSec: -1,
      remainSec: -1,
      completed: 0,
      emotion: 1,
      feedback: '',
      sending: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.progress = this.progress.bind(this);
    this.handleEmotionChange = this.handleEmotionChange.bind(this);
    this.handleFeedbackChange = this.handleFeedbackChange.bind(this);
  }

  componentDidMount() {
    this.timer = setInterval(() => {
      this.progress();
    }, 200);

    // dispatch(updatePlayerStatus({id: 'x', name: 'y', tourType: 10}));
  }

  componentWillReceiveProps(nextProps) {
    const {dispatch} = nextProps;
    // dispatch(updatePlayerStatus({id: 'x', name: 'y', tourType: 10}));
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  progress() {
    if (this.props.pageStartedAt && this.props.pageEndedAt) {
      const now = new Date();
      const passSec = Math.floor((now - this.props.pageStartedAt) / 1000);
      const remainSec = -1 * (Math.floor((this.props.pageEndedAt - this.props.pageStartedAt) / 1000) - passSec);
      const completed = Math.round(passSec / (Math.floor((this.props.pageEndedAt - this.props.pageStartedAt) / 1000)) * 100);
      this.setState({passSec, remainSec, completed})
    }
  };

  handleChange(name) {
    return (event) => {
      // this.setState({[name]: event.target.value});
      const {dispatch} = this.props;
      dispatch(updatePlayerStatus({tourType: event.target.value}));
    }
  }

  handleEmotionChange() {
    return (event) => {
      this.setState({
        ['emotion']: event.target.value
      })
    };
  }

  handleFeedbackChange() {
    return (event) => {
      this.setState({
        ['feedback']: event.target.value
      });
    };
  }

  handleSendMessageButtonClick() {
    return (event) => {
      const {feedback, emotion} = this.state;
      const {dispatch, userName, tourType, pageTitle, pageUrl} = this.props;

      let emotionText = '';
      switch(emotion) {
        case 1: emotionText='❤️';break;
        case 2: emotionText='👍';break;
        case 3: emotionText='⭐️';break;
        case 4: emotionText='🤣️';break;
        case 5: emotionText='🎉';break;
        case 6: emotionText='👏';break;
        case 7: emotionText='💯';break;
        case 8: emotionText='😀';break;
      }

      const text = emotionText + (feedback.length > 0 ? ' ' + feedback : '');
      //
      // const tourPage = tourPages.pages[tourType];
      //
      // const pageUrl = tourPage.url;
      // const pageTitle = tourPage.title;
      //
      // const userName = player.name;
      //
      console.log('clicked ' + emotionText + ' ' + feedback);
      console.log({userName, tourType, text, pageUrl, pageTitle});

      dispatch(sendMessage({userName, tourType, text, pageUrl, pageTitle}));

      // TODO DANGER
      this.setState({feedback: '', sending: true});
      setTimeout(() => {
        this.setState({sending: false})
      }, 2000)
    };
  }

  render() {
    const {classes} = this.props;
    return (
        <AppBar position="fixed">
          <Toolbar>
            <DirectionsBoatIcon
              color={this.props.login === true ? 'inherit' : 'disabled'}
              style={{paddingRight: "5px"}}
            />
            <Select
              disabled={this.props.login === false}
              value={this.props.tourType}
              onChange={this.handleChange('tourType')}
              style={{
                color: this.props.login ? '#FFFFFF' : '#777777',
                width: "80px"
              }}
            >
              <option value={1}>1 min</option>
              <option value={3}>3 min</option>
              <option value={5}>5 min</option>
            </Select>
            {/*<IconButton className={classes.menuButton} color="inherit" aria-label="Menu">*/}
              {/*<MenuIcon/>*/}
            {/*</IconButton>*/}
            {/*<Typography variant="title" color="inherit" className={classes.flex}>*/}
              {/*👊 Knockout Tour 🚀*/}
            {/*</Typography>*/}

            <div style={{height: "64px", width: "100px", backgroundColor: "#FFFFFF"}}>
            {
              this.props.pageThumbnailUrl && this.props.login === true ?
                <webview src={this.props.pageThumbnailUrl} style={{maxHeight: "64px", maxWidth: "113px", backgroundColor: "#FFFFFF"}}/>
                :
                <div/>
            }
            </div>
            <div style={{height: "64px", width: "320px"}}>
              <div style={{position: 'relative', height: "54px", width: '320px'}}>
                {
                  this.props.login ?
                    <div style={{textAlign: 'left', position: 'absolute', left: 5, top: 34, zIndex: 1, height: "24px", maxHeight: "54px", width: "120px"}}>
                      {toMinSecStr(this.state.passSec)}
                    </div>
                    :
                    <div/>
                }
                <div style={{textAlign: 'center', position: 'absolute', zIndex: 0,height: "54px", maxHeight: "54px", width: "320px", backgroundColor: "#6677DE"}}>
                  {
                    this.props.login ?
                      <table style={{height: "100%", width: "100%"}}>
                        <tbody>
                        <tr>
                          <td align="center">
                            <Typography style={{color: '#FFFFFF'}} variant="title">
                              {this.props.pageTitle ? this.props.pageTitle : ''}
                            </Typography>
                          </td>
                        </tr>
                        </tbody>
                      </table>
                      :
                      <table style={{height: "100%", width: "100%"}}>
                        <tbody>
                        <tr>
                          <td align="center">
                            Waiting...
                          </td>
                        </tr>
                        </tbody>
                      </table>
                  }
                </div>
                {
                  this.props.login ?
                    <div style={{textAlign: 'right', position: 'absolute', right: 5, top: 34, zIndex: 1, height: "24px", maxHeight: "54px", width: "120px"}}>
                      {this.props.interval ? '10sec Interval...' : toMinSecStr(this.state.remainSec)}
                    </div>
                    :
                    <div/>
                }
              </div>
              <LinearProgress
                classes={{colorPrimary: classes.colorPrimary, barColorPrimary: classes.barColorPrimary}}
                style={{height: "10px"}} variant={this.props.login ? "determinate" : "indeterminate"} value={this.state.completed}/>
            </div>

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
            {this.props.login === true ?
              <Button color='inherit'>
                <ChatIcon/>
                {this.props.messageCount}
              </Button>
              :
              <Button disabled color='inherit'>
                <ChatIcon/>
                -
              </Button>
            }
            <Paper>
              <FormControl variant="filled" style={{}}>
                <Select
                  disabled={this.props.login === false}
                  value={this.state.emotion}
                  onChange={this.handleEmotionChange()}
                  style={{fontSize: '120%', marginLeft: '2px', marginTop: '2px', marginBottom: '3px',height: '40px'}}
                >
                  <MenuItem select value={1}>
                    ❤️
                  </MenuItem>
                  <MenuItem value={2}>
                    👍
                  </MenuItem>
                  <MenuItem value={3}>
                    ⭐️
                  </MenuItem>
                  <MenuItem value={4}>
                    🤣️
                  </MenuItem>
                  <MenuItem value={5}>
                    🎉
                  </MenuItem>
                  <MenuItem value={6}>
                    👏
                  </MenuItem>
                  <MenuItem value={7}>
                    💯️
                  </MenuItem>
                  <MenuItem value={8}>
                    😀
                  </MenuItem>

                </Select>
              </FormControl>
              <TextField
                disabled={this.props.login === false}
                style={{marginTop: '2px', marginBottom: '3px', width: "100px", height: '40px'}}
                placeholder="Feedback"
                onChange={this.handleFeedbackChange()}
                variant="filled"
                value={this.state.feedback}
              />
              <Button
                disabled={this.props.login === false || this.state.sending === true}
                color='primary'
                variant="contained"
                onClick={this.handleSendMessageButtonClick()}
                style={{marginTop: '2px', marginRight: '2px', marginBottom: '3px', height: '40px', borderTopLeftRadius: 0, borderBottomLeftRadius: 0}}
              >
                <SendIcon/>
              </Button>
            </Paper>
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
  const result = {};

  const tourType = state.player.tourType;

  result.userName = state.player.name;

  result.tourType = tourType;
  result.anotherPlayers = state.anotherPlayers;
  result.initialized = state.player.initialized;
  result.login = state.player.login;

  if (state.tourPages.pages[tourType] !== null && typeof state.tourPages.pages[tourType] !== 'undefined') {
    const tourPage = state.tourPages.pages[tourType];
    result.pageTitle = tourPage.title;
    result.pageUrl = tourPage.url;
    result.pageThumbnailUrl = tourPage.thumbnail;
    result.pageStartedAt = tourPage.startedAt;
    result.pageEndedAt = tourPage.endedAt;
  }

  if (state.tourPages.interval[tourType] !== null && typeof state.tourPages.pages[tourType] !== 'undefined') {
    result.interval = state.tourPages.interval[tourType];
  }

  if (state.messages.counts[tourType] !== null && typeof state.messages.counts[tourType] !== 'undefined') {
    result.messageCount = state.messages.counts[tourType];
  } else {
    result.messageCount = 0;
  }

  return result;
};

export default connect(mapStateToProps)(withStyles(styles)(Header));
