const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const {findIndex} = require('lodash');

const Message = require('../both/socket/objects/Message');

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

// コメント投稿
app.post('/api/message/B9KjbXT58zJXGzYiirmF54rB8uVMuZm5', (req, res) => {
  try {
    const body = req.body;

    body.createdAt = new Date();
    const message = new Message(body);

    if (message.isValid()) {
      // あるかどうか確認(頻度的にきついのでメモリ上のデータ使う)
      const found = tourPageList.map(t => t.url === message.pageUrl)[0];
      if (typeof found !== 'undefined') {
        // まず合計メッセージ数を更新
        return redisClient.hincrby('message-counts', message.pageUrl, 1, (err, ok) => {
          if (err) {throw err}

          // 次にURLに紐づくメッセージとして内容を保存
          return redisClient.lpush(`messages_${message.pageUrl}`, JSON.stringify(message), (err, ok2) => {
            if (err) {throw err}

            // 最後にtourTypeに紐づくメッセージとして内容を保存
            console.log('key => ', `messages__tour__${message.tourType}`);

            return redisClient.lpush(`messages__tour__${message.tourType}`, JSON.stringify(message), (err, ok3) => {
              if (err) {throw err}

              return redisClient.hincrby('message-counts', `tour__${message.tourType}`, 1, (err, count) => {
                // 全体にbroadcastする
                onPostedMessage(message, count);

                return res.status(200).json({ok: ':)', message, pageMessageCount: ok, tourTypeMessageCount: count});
              });
            })
          });
        })
      } else {
        return res.status(404).json({error: 'not found same url page data', message});
      }
    } else {
      return res.status(400).json({error: 'invalid', message});
    }
  } catch (error) {
    res.status(500).json({error: 'unknown error'});
  }
});

// コメント内容取得(URL基準)
// TODO bad rest api path
app.get('/api/message_by_url/fURUKBrUJUZbgp7x8A75JYra9bPYHkjc', (req, res) => {
  try {
    const url = req.query.url;
    let from = req.query.from;
    let to = req.query.to;

    if (typeof url === 'undefined' || typeof from === 'undefined' || typeof to === 'undefined') {
      return res.status(400).json({error: 'invalid', query: {url, from, to}})
    }
    // TODO validate values

    from = parseInt(from);
    to = parseInt(to);

    const found = tourPageList.map(t => t.url === url)[0];
    if (typeof found !== 'undefined') {
      return redisClient.lrange(`messages_${url}`, from, to, (err, data) => {
        if (err) {throw err}

        return redisClient.hget('message-counts', url, (err, count) => {
          if (err) {throw err}

          data = data.map(d => JSON.parse(d));
          if (count === null) {
            count = 0;
          }

          return res.status(200).json({data, totalCount: count});
        });
      });
    } else {
      return res.status(404).json({error: 'not found same url page data', message});
    }
  } catch (error) {
    res.status(500).json({error: 'unknown error'});
  }
});

// コメント内容取得(ツアー単位)
app.get('/api/message_by_tour_type/gM26uDTbsSJfwZ5byp8xMddMPYJrUpyB', (req, res) => {
  try {
    const qTourType = req.query.tour_type;
    let from = req.query.from;
    let to = req.query.to;

    if (typeof qTourType === 'undefined' || typeof from === 'undefined' || typeof to === 'undefined') {
      return res.status(400).json({error: 'invalid', query: {tour_type: qTourType, from, to}});
    }

    const tourType = parseInt(qTourType);
    from = parseInt(from);
    to = parseInt(to);

    if (!([1,3,5].includes(tourType))) {
      return res.status(400).json({error: 'invalid tour type value', query: {tourType}});
    }

    console.log('key => ', `messages__tour__${tourType}`);
    return redisClient.lrange(`messages__tour__${tourType}`, from, to, (err, data) => {
      if (err) {throw err}
      const messages = data.map(d => JSON.parse(d));
      return redisClient.hget('message-counts', `tour__${tourType}`, (err, count) => {
        if (err) {throw err}
        if (count === null) {
          count = 0;
        }

        return res.status(200).json({data: messages, totalCount: count});
      });
    })
  } catch (error) {
    res.status(500).json({error: 'unknown error'});
  }
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

    return redisClient.hget('message-counts', `tour__1`, (err, count1) => {
      if (count1 === null) {count1 = 0;}
      return redisClient.hget('message-counts', `tour__3`, (err, count3) => {
        if (count3 === null) {count3 = 0;}
        return redisClient.hget('message-counts', `tour__5`, (err, count5) => {
          if (count5 === null) {count5 = 0;}

          // init
          const _now = new Date();
          const _one = cloneDeep(tourPageList[tourPageIdx[1]]);
          _one.startedAt = _now;
          _one.endedAt = new Date(_now.getTime() + oneMinTourInterval);
          _one.messageCount = parseInt(count1);

          const _three = cloneDeep(tourPageList[tourPageIdx[3]]);
          _three.startedAt = _now;
          _three.endedAt = new Date(_now.getTime() + threeMinTourInterval);
          _three.messageCount = parseInt(count3);

          const _five = cloneDeep(tourPageList[tourPageIdx[5]]);
          _five.startedAt = _now;
          _five.endedAt = new Date(_now.getTime() + fiveMinTourInterval);
          _five.messageCount = parseInt(count5);

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
      });
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
  emitAllClients(events.PAGE_INTERVAL, {tourType});
  interval[tourType] = true;

  try {
      setTimeout(() => {
        redisClient.hget('message-counts', `tour__${tourType}`, (err, count) => {
          if (err) {
            throw err
          }
          if (count === null) {
            count = 0;
          }

          interval[tourType] = false;

          const _now = new Date();

          const _nextTourPage = cloneDeep(tourPageList[tourPageIdx[tourType]]);

          // TODO WARN
          _nextTourPage.startedAt = new Date(_now.getTime());
          _nextTourPage.endedAt = new Date(_nextTourPage.startedAt.getTime() + (tourLengthMs));
          _nextTourPage.messageCount = count;

          currentPage[tourType] = _nextTourPage;

          emitAllClients(events.MOVE_PAGE, {tourType, tourPage: _nextTourPage.toEmitData()});
        });
      }, pageInterval);

  } catch (error) {
    util.log(error);
  }
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

function onPostedMessage(message, tourTypeTotalCount) {
  util.log('[onPostedMessage] ', message, tourTypeTotalCount);
  emitAllClients(events.POSTED_MESSAGE, {message, tourTypeTotalCount});
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
