const express = require('express');
const app = express();

const port = process.env.PORT || 5000;

app.use(express.static(__dirname + '/../../public'));
app.use(express.static(__dirname + '/../../dist'));

app.get('/hello-world', (req, res) => {
  res.json({hello: 'world'});
});

const http = require('http');

const server = http.createServer(app);
server.listen(port, err => {});
