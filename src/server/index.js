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
const TourPage = require('../both/socket/objects/TourPage');

const oneMinTourInterval = 10000;
const threeMinTourInterval = 30000;
const fiveMinTourInterval = 50000;

const pageInterval = 10000;

const tourPageList = [
  new TourPage({thumbnail: 'https://wired.jp/wp-content/uploads/2017/08/Google_G_Logo-TA.jpg', title: 'Test1', url: 'https://google.com'}),
  new TourPage({thumbnail: 'https://s.yimg.jp/images/top/sp2/cmn/logo-170307.png', title: 'Test2', url: 'https://www.yahoo.co.jp/'}),
  new TourPage({thumbnail: 'http://ap-land.com/wp-content/uploads/2014/09/sns.jpg', title: 'Test3', url: 'https://twitter.com'})
];

const tourPageIdx = {
  1: 0,
  3: 1,
  5: 2
};

const interval = {
  1: false,
  3: false,
  5: false
};

setInterval(() => {
  nextPage(1);
}, oneMinTourInterval);

setInterval(() => {
  nextPage(3);
}, threeMinTourInterval);

setInterval(() => {
  nextPage(5);
}, fiveMinTourInterval);

function nextPage(tourType) {
  let _nextTourIdx = tourPageIdx[tourType] + 1;
  if (_nextTourIdx >= tourPageList.length) {
    _nextTourIdx = 0;
  }
  tourPageIdx[tourType] = _nextTourIdx;
  onChangedPage(tourType);
}

function onChangedPage(tourType) {
  const _nextTourPage = tourPageList[tourPageIdx[tourType]];
  _nextTourPage.startedAt = new Date();

  emitAllClients(events.PAGE_INTERVAL, {tourType, intervalSec: pageInterval});
  interval[tourType] = true;
  setTimeout(() => {
    interval[tourType] = false;
    emitAllClients(events.MOVE_PAGE, {tourType, tourPage: _nextTourPage});
  }, pageInterval);
}

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

  const initialData = {
    tourPages: {
      1: tourPageList[tourPageIdx[1]],
      3: tourPageList[tourPageIdx[3]],
      5: tourPageList[tourPageIdx[5]]
    },
    interval,
    players: Array.from(players)
  };

  client.emit(events.INITIAL_CLIENT, initialData);
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
  if (existsPlayer(this.id)) {
    util.log('this user has been logined.', {id: this.id});
    return;
  }
  util.log(`[New Player]`, {id: this.id, name, tourType});

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

  delete clients[connectionId];

  const _removedPlayer = playerMapping[connectionId];
  if (typeof _removedPlayer === 'undefined') {
    util.log('[onRemovedPlayer] Player Not Found: ' + connectionId);
    return;
  }

  removeServerPlayer(_removedPlayer);

  util.log('remain clients: ' + Object.keys(clients).length);
}

function existsPlayer(id) {
  return playerMapping.hasOwnProperty(id);
}

function addServerPlayer(player) {
  players.add(player);
  playerMapping[player.id] = player;
  console.log('addServerPlayer', player, playerMapping)
}

function removeServerPlayer(player) {
  players.delete(player);
  delete playerMapping[player.id];
}

function emitAllClients(event, value) {
  console.log('[EMIT ALL CLIENTS] events: ' + event);
  console.log(value);

  Object.keys(clients).forEach(key => {
    const client = clients[key];
    client.emit(event, value);
  });
}
