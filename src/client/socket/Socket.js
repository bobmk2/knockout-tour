import events from '../../both/socket/Events';

// const {io} = require('socket.io-client')('/socket.io/socket.io.js');
const io = require('socket.io-client')('http://localhost:5000');
// const io = require('socket.io-client');

let socket = null;

import {moveTourPage, startIntervalPage} from '../actions/TourActions';
import {initialized, joinedAnotherPlayer, removedAnotherPlayer} from "../actions/PlayerActions";

const storage = require('electron-json-storage');

let store = null;

class Socket {
  initialize(_store) {
    socket = io.connect();
    this.setSocketIOEventHandlers(socket);
    store = _store;
  }

  disconnect() {
    socket.close();
  }

  setSocketIOEventHandlers(socket) {
    socket.on(events.CONNECT, this.onSocketConnected);
    socket.on(events.DISCONNECT, this.onSocketDisconnected);
    socket.on(events.INITIAL_CLIENT, this.onInitialized);
    socket.on(events.JOIN_PLAYER, this.onJoinedNewPlayer);
    socket.on(events.REMOVE_PLAYER, this.onRemovedPlayer);
    socket.on(events.CHANGE_PLAYER_STATUS, this.onChangedPlayerStatus);
    socket.on(events.MOVE_PAGE, this.onMovedPage);
  }

  onSocketConnected() {
    console.log('Connected to socket server');
  }

  onSocketDisconnected() {
    console.log('Disconnected from socket server');
  }

  onInitialized(data) {
    console.log('Initialized', data);

    Object.keys(data.tourPages).forEach(tourType => {
      const tourPage = data.tourPages[tourType];
      console.log(`tourType: ${tourType} `, tourPage);
      store.dispatch(moveTourPage(tourType, tourPage))
    });

    Object.keys(data.interval).forEach(tourType => {
      console.log(`tourType: ${tourType} / interval: ${data.interval[tourType]}`)
      if (data.interval[tourType]) {
        store.dispatch(startIntervalPage(tourType));
      }
    });

    data.players.map(player => {
      store.dispatch(joinedAnotherPlayer(player));
    })

    setTimeout(() => {
      storage.get('name', (error, name) => {
        console.log('===> name: ', JSON.stringify(name));
        if (typeof name === 'undefined' || JSON.stringify(name) === '{}') {
          name = 'Anonymous';
        }
        store.dispatch(initialized(name));
      });
    }, 1000);
  }

  onJoinedNewPlayer(data) {
    console.log('New player joined ',{name: data.name, id: data.id});
    store.dispatch(joinedAnotherPlayer(data));
  }

  onRemovedPlayer(data) {
    console.log('Player removed:', {id: data.id});
    store.dispatch(removedAnotherPlayer(data));
  }

  onMovedPage({tourType, tourPage}) {
    console.log('Move page', {tourType, tourPage});
    store.dispatch(moveTourPage(tourType, tourPage));
  }

  onStartPageInterval({tourType}) {
    console.log('Start Page Interval', {tourType, intervalSec});
    store.dispatch(startIntervalPage(tourType));
  }

  onChangedPlayerStatus(data) {
    console.log('Changed player status', data);
  }

  updatePlayer(player) {
    console.log('Update Player', player);
    socket.emit(events.CHANGE_PLAYER_STATUS, player);
  }

  loginPlayer(player) {
    console.log('Login Player', player);
    socket.emit(events.JOIN_PLAYER, player);
  }
}

export default new Socket();
