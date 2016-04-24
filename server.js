(() => {
  "use strict";

  const express = require('express');
  const http = require('http');
  const WebSocketServer = require('ws').Server;
  const app = express();
  const port = process.env.PORT || 8080;
  let questions = [];

  app.use(express.static(__dirname + '/'));
  const server = http.createServer(app);

  server.listen(port);

  const wss = new WebSocketServer({
    "server": server
  });

  wss.on("connection", (ws) => {
    broadcast(questions);
    ws.on('message', (question) => {

      questions.push(question);
      questions = questions.slice(-5);
      if (question === "--clear") {
        questions = [];
      }

      broadcast(questions);
    });

    ws.on("close", () => {
      console.log("connection closed");
    });
  });

  function broadcast(questions) {
    wss.clients.forEach((client) => {
      client.send(JSON.stringify(questions));
    });
  }
})();
