## MEMO

### Env

```shell
$ node -v
v8.12.0

$ npm -v
6.4.1
```

### Reload browser

```shell
$ npm install -g browser-sync
$ browser-sync start --server --files ./dist/**/* --files ./public/**/*
```

### Reload Server

```shell
$ npm install -g nodemon
$ nodemon -V --watch src/server --watch public -e js,jsx,html --delay 1500ms index.js
```
