const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io").listen(server);

server.listen(process.env.PORT || 8081, () => {
  console.log("Listening on " + server.address().port);
});

server.lastPlayerID = 0;

server.bombs = [];

io.on("connection", socket => {
  socket.on("newplayer", () => {
    socket.player = {
      hp: 100,
      id: server.lastPlayerID++,
      x: randomInt(100, 400),
      y: randomInt(100, 400)
    };
    socket.emit("allplayers", getAllPlayers());
    socket.broadcast.emit("newplayer", socket.player);

    socket.on("whoami", () => socket.emit("whoami", socket.player));

    socket.on("move", ({ x, y }) => {
      const movementSpeed = 2;
      socket.player.x += x * movementSpeed;
      socket.player.y += y * movementSpeed;
      io.emit("move", socket.player);
    });
    socket.on("putbomb", async () => {
      if (!socket.bomb || (socket.bomb && socket.bomb.expired)) {
        socket.bomb = {
          id: socket.player.id,
          x: socket.player.x,
          y: socket.player.y
        };
        socket.emit("newbomb", socket.bomb);
        socket.broadcast.emit("newbomb", socket.bomb);
        await refreshBombs({ bomb: socket.bomb, socket });
      }
    });
    socket.on("disconnect", () => io.emit("remove", socket.player.id));
  });

  socket.on(
    "disconnect",
    () => socket.player && io.emit("remove", socket.player.id)
  );

  socket.on("test", () => console.log("test received"));
});
const refreshBombs = async ({ bomb, socket }) => {
  setTimeout(() => {
    bomb.expired = true;
    const players = getAllPlayers().map(p => {
      if (
        (Math.abs(bomb.x - p.x) < 150 && Math.abs(bomb.y - p.y) < 12.5) ||
        (Math.abs(bomb.y - p.y) < 150 && Math.abs(bomb.x - p.x) < 12.5)
      )
        p.hp -= 100;
      return p;
    });
    socket.emit("bombexplosion", bomb, players);
    socket.broadcast.emit("bombexplosion", bomb, players);
  }, 3000);
};

const getAllBombs = () =>
  Object.keys(io.sockets.connected)
    .map(socketId => io.sockets.connected[socketId].bomb)
    .filter(bomb => bomb);

const getAllPlayers = () =>
  Object.keys(io.sockets.connected)
    .map(socketId => io.sockets.connected[socketId].player)
    .filter(player => player);

const randomInt = (low, high) => Math.floor(Math.random() * (high - low) + low);
