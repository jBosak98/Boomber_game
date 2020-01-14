const Client = {};
Client.socket = io.connect("http://127.0.0.1:8081");
console.log("client created");

Client.sendTest = () => {
  console.log("text sent");
  Client.socket.emit("test");
};

Client.putBomb = () => {
  Client.socket.emit("putbomb");
};
Client.whoAmI = () => {
  Client.socket.emit("whoami");
};

Client.askNewPlayer = () => Client.socket.emit("newplayer");

Client.sendClick = ({ x, y }) => Client.socket.emit("move", { x, y });

Client.socket.on("whoami", player => whoAmI(player));

Client.socket.on("newplayer", ({ id, x, y }) => addNewPlayer({ id, x, y }));

Client.socket.on("bombexplosion", (bomb, players) => {
  bombExplosion(bomb, players);
});

Client.socket.on("newbomb", ({ id, x, y }) => addNewBomb({ id, x, y }));

Client.socket.on("allplayers", players => {
  Client.socket.on("putbomb", () => console.log("bomb"));

  players.forEach(({ id, x, y }) => addNewPlayer({ id, x, y }));

  Client.socket.on("move", ({ id, x, y }) => movePlayer({ id, x, y }));

  Client.socket.on("remove", id => removePlayer({ id }));
});
