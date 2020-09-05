const express = require("express");
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");
const PORT = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);
const io = socketIo(server); // < Interesting!


//Set static folder
app.use(express.static(path.join(__dirname,"build")))


const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;

var Player = function (game, id) {
  this.game = game;
  // TODO serverdan al

  this.id = id;
  this.x = 0;
  this.y = 0;

  this.dirx = 0;
  this.diry = 0;
  this.targetX = 0;
  this.targetY = 0;
  this.width = 50;
  this.height = 50;
  this.health = 100;

  Player.prototype.update = function update() {
    this.targetX += this.dirx * 2;
    this.targetY += this.diry * 2;

    this.x = this.x + (this.targetX - this.x) * 0.5;
    this.y = this.y + (this.targetY - this.y) * 0.5;
  };
};

var Game = function Game() {
  this.players = []; //new Player(ctx);

  Game.prototype.addPlayer = function addPlayer(id) {
    this.players.push(new Player(this, id));
  };

  Game.prototype.update = function update() {

    for (let m = 0; m < this.players.length; m++) {
      const player = this.players[m];
      player.update();
    }
  };
};


var game = new Game();

const interval = setInterval(() => {
  game.update();
}, 1000 / 60);

io.on("connection", function (socket) {
  console.log("user connected!" + socket.id);
  game.addPlayer(socket.id);
  console.log("number of players : " + game.players.length);

 const playerInterval = setInterval(()=>{
  io.sockets.emit('PLAYERS_UPDATE', game.players.map(player => ({
    id: player.id,
   /*  name: player.name,
    isDead: player.isDead,
    health: player.health,
    coins: player.coins,
    medkits: player.medkits, */
    x: player.x,
    y: player.y,
  })));
 },1000/ 30)

  socket.on("disconnect", function () {
    clearInterval(playerInterval);

    game.players = game.players.filter((player) => player.id !== socket.id);
    console.log("user disconnected!" + socket.id);
    console.log("number of players:" + game.players.length);
  });

  socket.on('PLAYER_DIRECTION_UPDATE',function(data){
    const player = game.players.filter((player) => player.id == socket.id);

    console.log(player.dirx);
    console.log(player.diry);


  
      if(data.dirx !== undefined) 
      player[0].dirx = data.dirx;
      if(data.diry !== undefined)
      player[0].diry = data.diry;
  
  });
});

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
