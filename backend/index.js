const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io").listen(server);

server.listen(process.env.PORT || 8081, () => {
  console.log("Listening on " + server.address().port);
});

io.on("connection", socket => {
  socket.on("newplayer", () => {
    socket.player = {
      id: 1,
      x: 5,
      y: 10
    };
  });

  socket.on("disconnect", () => {
    io.emit("remove", socket.player.id);
  });

  socket.on("test", () => {
    console.log("test received");
  });
});
