const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const PORT = process.env.PORT || 3000;

const router = require("./router");
const app = express();
const server = http.createServer(app);

const io = socketIo(server); // < Interesting!

/* io.on("connection", (socket) => {
  console.log("We have a new connection");

  socket.on("disconnect", () => {
    console.log("user just had left");
  });
}); */

var position = {
	x : 200,
	y : 200
}

io.on("connection", (socket) => {
  socket.emit("position", position);
  socket.on("move", (data) => {
	  console.log("yazdir" + data);
    switch (data) {
      case "left":
        position.x -=5;
        io.emit("position", position);
        break;
      case "right":
        position.x += 5;
        io.emit("position", position);
        break;
      case "up":
        position.y -= 5;
        io.emit("position", position);
        break;
      case "down":
        position.y += 5;
        io.emit("position", position);
        break;
    }
  });
});

app.use(router);

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
