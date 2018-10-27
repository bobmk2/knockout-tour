const express = require('express');
const app = express();

const port = process.env.PORT || 5000;
const events = require('../both/socket/Events');

app.use(express.static(__dirname + '/../../public'));
app.use(express.static(__dirname + '/../../dist'));

app.get('/hello-world', (req, res) => {
  res.json({hello: 'world'});
});

app.get('/dist/client.js', (req, res) => {
  res.sendFile('client.js', {root: `${__dirname}/../../dist`});
});

/**
 * ==========
 *  SocketIO
 * ==========
 */
const util = require('util');
const http = require('http');

const socketIO = require('socket.io');
const server = http.createServer(app);

const clients = {};
const players = new Set();
const playerMapping = {};
const Player = require('../both/socket/objects/Player');

let socket = null;

server.listen(port, err => {
  socket = socketIO.listen(server);
  setEventHandlers();
});

function setEventHandlers() {
  socket.sockets.on('connection', onSocketConnection);
  socket.sockets.on('disconnection', onSocketDisconnection);
}

function onSocketConnection(client) {
  util.log('player has connected: ' + client.id);

  client.on(events.JOIN_PLAYER, onJoinedNewPlayer);
  client.on(events.DISCONNECT, onDisconnectedClient);
  client.on(events.CHANGE_PLAYER_STATUS, onChangedPlayerStatus);

  clients[client.id] = client;
}

function onSocketDisconnection(client) {
  util.log('socket disconnected: ' + client.id);
  onRemovedPlayer(this.broadcast, client.id)
}

function onDisconnectedClient() {
  util.log('player has disconnected: ' + this.id);
  onRemovedPlayer(this.broadcast, this.id)
}

function onJoinedNewPlayer({name, tourType}) {
  util.log(`[New Player] id: ${this.id}`);

  const _newPlayer = new Player({id: this.id, name, tourType});

  // 全員にこのプレイヤーのことを教える
  this.broadcast.emit(events.JOIN_PLAYER, _newPlayer);

  // プレイヤーに他のプレイヤーのことを教える
  players.forEach(player => {
    this.emit(events.JOIN_PLAYER, player.toJSON());
  });

  addServerPlayer(_newPlayer);
}

function onChangedPlayerStatus(data) {
  util.log('[onChangedPlayerStatus]', data);

  const _targetPlayer = playerMapping[this.id];
  if (typeof _targetPlayer === 'undefined') {
    util.log(`Player not found: ${this.id}`);
    return;
  }
  _targetPlayer.update(data);

  this.broadcast.emit(events.CHANGE_PLAYER_STATUS, _targetPlayer.toJSON());
}

function onRemovedPlayer(broadcast, connectionId) {
  // いなくなったことを通知
  broadcast.emit(events.REMOVE_PLAYER, {id: connectionId});

  const _removedPlayer = playerMapping[connectionId];
  if (typeof _removedPlayer === 'undefined') {
    util.log('[onRemovedPlayer] Player Not Found: ' + connectionId);
    return;
  }

  removeServerPlayer(_removedPlayer);

  delete clients[connectionId];
  util.log('remain clients: ' + Object.keys(clients).length);
}

function addServerPlayer(player) {
  players.add(player);
  playerMapping[player.id] = player;
}

function removeServerPlayer(player) {
  players.delete(player);
  delete playerMapping[player.id];
}
