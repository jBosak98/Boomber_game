const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io").listen(server);

server.listen(process.env.PORT || 8081, () => {
  console.log("Listening on " + server.address().port);
});

server.lastPlayerID = 0;
server.players = [];

io.on("connection", socket => {
  socket.on("newplayer", () => {
    socket.player = {
      id: server.lastPlayerID++,
      x: randomInt(100, 400),
      y: randomInt(100, 400)
    };
    socket.emit("allplayers", getAllPlayers());
    socket.broadcast.emit("newplayer", socket.player);

    socket.on("move", ({ x, y }) => {
      const movementSpeed = 2;
      socket.player.x += x * movementSpeed;
      socket.player.y += y * movementSpeed;
      io.emit("move", socket.player);
    });

    socket.on("disconnect", () => io.emit("remove", socket.player.id));
  });

  socket.on(
    "disconnect",
    () => socket.player && io.emit("remove", socket.player.id)
  );

  socket.on("test", () => console.log("test received"));
});

const getAllPlayers = () =>
  Object.keys(io.sockets.connected)
    .map(socketId => io.sockets.connected[socketId].player)
    .filter(player => player);

const randomInt = (low, high) => Math.floor(Math.random() * (high - low) + low);
