(() => {
  "use strict";

  const express = require('express');
  const http = require('http');
  const WebSocketServer = require('ws').Server;
  const app = express();
  const port = process.env.PORT || 8080;
  const questions = [];

  app.use(express.static(__dirname + '/'));
  const server = http.createServer(app);

  server.listen(port);

  const wss = new WebSocketServer({
    "server": server
  });

  wss.on("connection", (ws) => {

    ws.send(JSON.stringify(questions));

    ws.on('message', (question) => {
      questions.push(question);
      ws.send(JSON.stringify(questions));
    });

    ws.on("close", () => {
      console.log("connection closed");
    });
  });
})();
