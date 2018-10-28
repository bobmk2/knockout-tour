const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const {findIndex} = require('lodash');

app.use(bodyParser.json());

const port = process.env.PORT || 5000;
const events = require('../both/socket/Events');

app.use(express.static(__dirname + '/../../public'));
app.use(express.static(__dirname + '/../../dist'));

const redis = require('redis');
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD
});

app.get('/hello-world', (req, res) => {
  res.json({hello: 'world'});
});

app.get('/dist/client.js', (req, res) => {
  res.sendFile('client.js', {root: `${__dirname}/../../dist`});
});

// DANGER
// 使いたいときだけ
//redisClient.del('pages'); // ページリセット

// ページ取得
app.get('/api/page/3Vy5nybuWrP3JiwjQ7jXBW2Ujri8hLkk', (req, res) => {
  return redisClient.lrange('pages', 0, -1, (err, data) => {
    data = data.map(d => JSON.parse(d));
    return res.status(200).json(data);
  })
});

// ページ追加
app.post('/api/page/Xm3W8uefdRHiQCxdJhVzRW7Le3yTAHJf', (req, res) => {
  const body = req.body;
  const page = new TourPage(body);

  if (page.isValid()) {
    return redisClient.lrange('pages', 0, -1, (err, data) => {
      data = data.map(d => JSON.parse(d));
      const foundSameUrl = data.filter(d => d.url === page.url)[0];

      // 同じのがあるのなら登録しない
      if (typeof foundSameUrl !== 'undefined') {
        return res.status(400).json({error: 'exists same url', page, exists: foundSameUrl})
      }
      return redisClient.rpush('pages', JSON.stringify(page.toJSON()), (err ,count) => {
        onUpdatedPageList();
        return res.status(200).json(Object.assign({ok: ":)"}, {page}, {count}));
      });
    });

  } else {
    return res.status(400).json({error: 'invalid', page});
  }
});

// ページ情報更新
app.put('/api/page/HPeGNrtwZVBZMSmTFPGB37mNBNaeH5Wg', (req, res) => {
  const body = req.body;

  const page = new TourPage(body);

  if (page.isValid()) {
    return redisClient.lrange('pages', 0, -1, (err, data) => {
      data = data.map(d => JSON.parse(d));
      const index = findIndex(data, s => s.url === page.url);

      // 同じのがあるのならそれを差し替える
      if (index !== -1) {
        data[index] = page.toJSON();
        return redisClient.del('pages', (err) => {
          return redisClient.rpush.apply(redisClient, ['pages'].concat(data.map(p => JSON.stringify(p))).concat((err, count) => {
            onUpdatedPageList();
            return res.status(200).json({ok: ':)', count})
          }));
        });
      } else {
        return res.status(404).json({error: 'not found same url page data', page});
      }
    });

  } else {
    return res.status(400).json({error: 'invalid', page});
  }
});

// ページ削除(URL指定)
app.delete('/api/page/PnsJDuDLD3WmQajeQJaK5FGXeU6h2Ebz', (req, res) => {
  const url = req.query.target;

  return redisClient.lrange('pages', 0, -1, (err, data) => {
    data = data.map(d => JSON.parse(d));
    const pages = data.filter(d => d.url !== url);

    // たぶん何かしらあると思うが一度全部消して全部登録
    return redisClient.del('pages', (err) => {
      return redisClient.rpush.apply(redisClient, ['pages'].concat(pages.map(p => JSON.stringify(p))).concat((err, count) => {
        onUpdatedPageList();
        return res.status(200).json({ok: ':)', count})
      }));
    });
  });
});



/*
redisClient.set('test', 1, redis.print);
redisClient.get('test', (err, res) => {
  console.log('redis.test => ',res)
})
redisClient.lpush('test1', {name: 'test1', message: '', at: (new Date().getTime() / 1000)}, (err, count) => {
  console.log(count)
});
*/

/**
 * ==========
 *  SocketIO
 * ==========
 */
const util = require('util');
const http = require('http');

const socketIO = require('socket.io');
const server = http.createServer(app);
const {cloneDeep} = require('lodash');

const clients = {};
const players = new Set();
const playerMapping = {};
const Player = require('../both/socket/objects/Player');
const TourPage = require('../both/socket/objects/TourPage');

const oneMinTourInterval = 60000;
const threeMinTourInterval = 20000;
const fiveMinTourInterval = 300000;

const pageInterval = 10000;

let tourPageList = [];

const tourPageIdx = {
  1: -1,
  3: -1,
  5: -1
};

const currentPage = {
  1: null,
  3: null,
  5: null
};

const interval = {
  1: false,
  3: false,
  5: false
};

let socket = null;

function onUpdatedPageList() {
  console.log('[onUpdatedPageList]');
  // ページリストを取得して更新する
  return redisClient.lrange('pages', 0, -1, (err, data) => {
    const pages = data.map(d => new TourPage(JSON.parse(d)));
    tourPageList = pages;
  });
}

function initialize() {
  // ページリストを取得する
  return redisClient.lrange('pages', 0, -1, (err, data) => {
    const pages = data.map(d => new TourPage(JSON.parse(d)));
    tourPageList = pages;

    // 3で割って、開始位置に使う
    // @memo
    // 1min => 0
    // 3min => (seprate)
    // 5min => (seprate * 2)
    const separate = Math.ceil(pages.length / 3);
    const oneIdx = 0;
    const threeIdx = separate >= pages.length ? pages.length - 1 : separate;
    const fiveIdx = (separate * 2) >= pages.length ? pages.length - 1 :separate * 2;

    tourPageIdx[1] = oneIdx;
    tourPageIdx[3] = threeIdx;
    tourPageIdx[5] = fiveIdx;

    console.log('[initialize] Page indexes', tourPageIdx);

    // init
    const _now = new Date();
    const _one = cloneDeep(tourPageList[tourPageIdx[1]]);
    _one.startedAt = _now;
    _one.endedAt = new Date(_now.getTime() + oneMinTourInterval);

    const _three = cloneDeep(tourPageList[tourPageIdx[3]]);
    _three.startedAt = _now;
    _three.endedAt = new Date(_now.getTime() + threeMinTourInterval);

    const _five = cloneDeep(tourPageList[tourPageIdx[5]]);
    _five.startedAt = _now;
    _five.endedAt = new Date(_now.getTime() + fiveMinTourInterval);

    currentPage[1] = _one;
    currentPage[3] = _three;
    currentPage[5] = _five;

    console.log('[initialize] Current Pages', currentPage)

    setInterval(() => {
      nextPage(1, oneMinTourInterval);
    }, (oneMinTourInterval + pageInterval));

    setInterval(() => {
      nextPage(3, threeMinTourInterval);
    }, (threeMinTourInterval + pageInterval));

    setInterval(() => {
      nextPage(5, fiveMinTourInterval);
    }, (fiveMinTourInterval + pageInterval));

    // 終わったのでサーバ立てる
    server.listen(port, err => {
      socket = socketIO.listen(server);
      setEventHandlers();
    });
  });
}

// 初期化
initialize();

function nextPage(tourType, tourLengthMs) {
  let _nextTourIdx = tourPageIdx[tourType] + 1;
  if (_nextTourIdx >= tourPageList.length) {
    _nextTourIdx = 0;
  }
  tourPageIdx[tourType] = _nextTourIdx;
  onChangedPage(tourType, tourLengthMs);
}

function onChangedPage(tourType, tourLengthMs) {
  const _nextTourPage = cloneDeep(tourPageList[tourPageIdx[tourType]]);

  // TODO WARN
  const _now = new Date();
  _nextTourPage.startedAt = new Date(_now.getTime() + pageInterval);
  _nextTourPage.endedAt = new Date(_nextTourPage.startedAt.getTime() + (tourLengthMs));

  currentPage[tourType] = _nextTourPage;

  emitAllClients(events.PAGE_INTERVAL, {tourType});
  interval[tourType] = true;
  setTimeout(() => {
    interval[tourType] = false;
    emitAllClients(events.MOVE_PAGE, {tourType, tourPage: _nextTourPage.toEmitData()});
  }, pageInterval);
}

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
      1: currentPage[1].toEmitData(),
      3: currentPage[3].toEmitData(),
      5: currentPage[5].toEmitData()
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
