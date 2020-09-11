import Player from "./Player";
import Wall from "./Wall";
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;

class Game {
   constructor(ctx, socket) {
      console.log('init');
      this.socket = socket;
      this.ctx = ctx;
      
      this.players = [];
      this.walls = [];
      
     
   }


      onKeyDown = event => {
         const keyCode = event.keyCode;
         // LEFT
         if (keyCode === 65) {
           this.socket.emit('PLAYER_DIRECTION_UPDATE', { dirx: -1 });
         }
         // RIGHT
         else if (keyCode === 68) {
           this.socket.emit('PLAYER_DIRECTION_UPDATE', { dirx: 1 });
         }
         // UP
         if (keyCode === 87) {
           this.socket.emit('PLAYER_DIRECTION_UPDATE', { diry: -1 });
         }
         // DOWN
         else if (keyCode === 83) {
           this.socket.emit('PLAYER_DIRECTION_UPDATE', { diry: 1 });
         }
       }
     
       onKeyUp = event => {
         const keyCode = event.keyCode;
         // LEFT - right
         if (keyCode === 65 || keyCode === 68) {
           this.socket.emit('PLAYER_DIRECTION_UPDATE', { dirx: 0 });
         }
         // UP - down
         if (keyCode === 83 || keyCode === 87) {
           this.socket.emit('PLAYER_DIRECTION_UPDATE', { diry: 0 });
         }
      }

  update = () => {
   window.addEventListener('keydown', this.onKeyDown);
   window.addEventListener('keyup', this.onKeyUp);
   //players update
   this.socket.on('PLAYERS_UPDATE', (players) => {
      const newPlayers = [];
      for (var i = 0; i < players.length; i++) {
        const newPlayer = new Player(this.ctx, this);
        newPlayer.id = players[i].id;
      /*   newPlayer.name = players[i].name;
        newPlayer.health = players[i].health;
        newPlayer.isDead = players[i].isDead;
        newPlayer.coins = players[i].coins;
        newPlayer.medkits = players[i].medkits; */
        newPlayer.x = players[i].x;
        newPlayer.y = players[i].y;
       /*  newPlayer.type = players[i].type; */
        newPlayers.push(newPlayer);
      }
      this.players = newPlayers;
    });
    //walls update
    this.socket.on('WALLS_UPDATE', (walls) => {
    const newWalls = [];
    for (var i = 0; i < walls.length; i++) {
      const newWall = new Wall(this.ctx, this);
    /*   newPlayer.name = players[i].name;
      newPlayer.health = players[i].health;
      newPlayer.isDead = players[i].isDead;
      newPlayer.coins = players[i].coins;
      newPlayer.medkits = players[i].medkits; */
      newWall.x = walls[i].x;
      newWall.y = walls[i].y;
      /*  newPlayer.type = players[i].type; */
      newWalls.push(newWall);
    }
    this.walls = newWalls;
    });
  };

  draw = () => {
    this.ctx.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);

    for (let i = 0; i < this.players.length; i++) {
      const player = this.players[i];
      player.draw();
    }

    for (let i = 0; i < this.walls.length; i++) {
      const wall = this.walls[i];
      wall.draw();
    }

  };
}

export default Game;
