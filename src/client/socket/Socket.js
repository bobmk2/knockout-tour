import events from '../../both/socket/Events';

// const {io} = require('socket.io-client')('/socket.io/socket.io.js');
const io = require('socket.io-client')('http://localhost:5000');
// const io = require('socket.io-client');

let socket = null;

class Socket {
  initialize() {
    socket = io.connect();
    this.setSocketIOEventHandlers(socket);
  }

  disconnect() {
    socket.close();
  }

  setSocketIOEventHandlers(socket) {
    socket.on(events.CONNECT, this.onSocketConnected);
    socket.on(events.DISCONNECT, this.onSocketDisconnected);
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

  onJoinedNewPlayer(data) {
    console.log('New player joined ',{name: data.name, id: data.id});
  }

  onRemovedPlayer(data) {
    console.log('Player removed:', {id: data.id});
  }

  onMovedPage(data) {
    console.log('Move page', data);
  }

  onChangedPlayerStatus(data) {
    console.log('Changed player status', data);
  }

  emitPlayer(player) {
    console.log('Emit Player');
    socket.emit(events.JOIN_PLAYER, player);
  }

  updatePlayer(player) {
    console.log('Update Player', player);
    socket.emit(events.CHANGE_PLAYER_STATUS, player);
  }
}

export default new Socket();
