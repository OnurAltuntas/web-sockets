const express = require("express");
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");
const { clear } = require("console");
const PORT = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);
const io = socketIo(server); // < Interesting!

//Set static folder
//app.use(express.static(path.join(__dirname,"build")))

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;

var Player = function (game, id) {
  this.game = game;
  // TODO serverdan al

  this.id = id;
  this.isDead = false;
  this.name = "";
  this.x = 0;
  this.y = 0;

  this.dirx = 0;
  this.diry = 0;
  this.targetX = 0;
  this.targetY = 0;
  this.width = 30;
  this.height = 30;
  this.health = 100;

  Player.prototype.update = function update() {
    this.targetX += this.dirx * 2;
    this.targetY += this.diry * 2;

    this.x = this.x + (this.targetX - this.x) * 0.5;
    this.y = this.y + (this.targetY - this.y) * 0.5;
  };
};

var Wall = function (game) {
  this.game = game;
  this.id = 0;
  this.x = 500;
  this.yList = [-70, -60, -50, -40, -30, -10, 0];
  this.y = this.yList[Math.floor(Math.random() * this.yList.length)];
  this.secondPartY = this.y + 250;

  this.dirx = 100;
  this.diry = 0;
  this.targetX = 0;
  this.targetY = 0;
  this.width = 100;
  this.height = 100;

  Wall.prototype.update = function update() {
    this.x -= 2;
  };
};

var Game = function Game() {
  this.players = []; //new Player(ctx);
  this.walls = [];
  this.isStarted = false;
  this.winnerId = null;
  this.name = null;
  this.gameOver = false;
  this.gameEndedAt = null;
  this.aliveCount = null;

  Game.prototype.addPlayer = function addPlayer(id) {
    this.players.push(new Player(this, id));
  };
  Game.prototype.addWall = function addWall() {
    this.walls.push(new Wall(this));
  };

  Game.prototype.update = function update() {
    this.isStarted = true;
    /* if (this.players.length === 2) {
      this.isStarted = true;
    } */
    if (!this.isStarted)
    return;


    //Burada gameOver yapılması lazım
    console.log(this.walls.length);

    const alivePlayerCount = this.players.filter(player => !player.isDead).length;
    for (var m = 0; m < this.players.length; m++) {
      const player = this.players[m];
  
      if (alivePlayerCount === 1 && !player.isDead) {
        console.log(player.isDead);
        this.winnerId = player.id;
        this.gameOver = true;
        this.gameEndedAt = Date.now();
      }
  
      if (!this.gameOver) {
        player.update();
      }
    }

    const now = Date.now();

    for (let k = 0; k < this.walls.length; k++) {
      const wall = this.walls[k];
      if (wall.x < 0) this.walls.splice(k, 1);
      wall.update();
    }

    this.players.map((player) => {
      this.walls.map((wall) => {
        if (
          player.x < wall.x + wall.width &&
          player.x + player.width > wall.x &&
          player.y < wall.y + wall.height &&
          player.y + player.height > wall.y
        ) {
          player.isDead = true;
          this.players.filter((item) => {
            item.id !== player.id;
          });
        }
        if (
          player.x < wall.x + wall.width &&
          player.x + player.width > wall.x &&
          player.y < wall.secondPartY + wall.height &&
          player.y + player.height > wall.secondPartY
        ) {
          player.isDead = true;
          this.players.filter((item) => {
            item.id !== player.id;
          });
        }
      });
    });
  };
};

var game = new Game();

const wallInterval = setInterval(() => {
  game.addWall();
}, 2000);

const interval = setInterval(() => {
  if (game.gameOver && Date.now() - game.gameEndedAt > 10000) {
    game = new Game();

  } else if (game.players.length) {
   
    game.update();
  }
    //Belki bundandır
    io.sockets.emit(
      "WALLS_UPDATE",
      game.walls.map((wall) => ({
        x: wall.x,
        y: wall.y,
        secondPartY: wall.secondPartY,
      }))
    );
  
}, 1000 / 60);


const playerInterval = setInterval(() => {
  io.sockets.emit(
    "PLAYERS_UPDATE",
    game.players.map((player) => ({
      id: player.id,
      isDead: player.isDead,
      name: player.name,
   
      x: player.x,
      y: player.y,
    }))
  );

  if (game.gameOver) {
    io.sockets.emit('GAME_STATE_UPDATE', {
      gameOver: game.gameOver,
      winnerId: game.winnerId,
    });
  }

}, 1000 / 30);

io.on("connection", function (socket) {
  console.log("user connected!" + socket.id);
  game.addPlayer(socket.id);

  console.log("number of players : " + game.players.length);

  setInterval(() => {
    if (game.gameOver) {
      socket && socket.disconnect(true);
    }
  }, 1000);

  

  socket.on("disconnect", function () {
    clearInterval(playerInterval);

    game.players = game.players.filter((player) => player.id !== socket.id);
    console.log("user disconnected!" + socket.id);
    console.log("number of players:" + game.players.length);
  });

  socket.on("PLAYER_DIRECTION_UPDATE", function (data) {
    const player = game.players.filter((player) => player.id == socket.id);

    /* console.log(player.dirx);
    console.log(player.diry); */

    if (data.dirx !== undefined) player[0].dirx = data.dirx;
    if (data.diry !== undefined) player[0].diry = data.diry;
  });

  socket.on("PLAYER_NAME_UPDATE", function (data) {
    const player = game.players.filter((player) => player.id === socket.id);
    player[0].name = data.name;
  });
});

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
