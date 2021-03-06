const http = require('http');
const PouchDB = require('pouchdb')
  .plugin(require('pouchdb-debug'))
PouchDB.debug.enable("pouch-stream-multi-sync")
const PouchSync = require('pouch-websocket-sync');

const server = http.createServer();
const wss = PouchSync.createServer(server, onRequest);

wss.on('error', function (err) {
  console.error(err.stack);
});


const db = new PouchDB('todos-server');
let dumb = {
  "completed": false,
  "text": "test",
}
setInterval(() => {
  db.allDocs({
    include_docs: true
  }).then(res => {
    console.log("res.rows.length: ", res.rows.length)
  })
  dumb.text = new Date().toString()
  db.post(dumb)
}, 30000)




server.listen(3001, function () {
  console.log((new Date()) + ' Server is listening on', server.address());
});

function onRequest(credentials, dbName, callback) {
  // console.log("dbName: ", dbName)
  if (dbName == 'todos-server') {
    callback(null, db);
  } else {
    callback(new Error('database not allowed'));
  }
}