import React, { Component,createRef } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import io from "socket.io-client";


const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;


class Player {
  constructor(ctx) {

    // TODO serverdan al 

    this.id = 0;
    this.x = 0;
    this.y = 0;

    this.dirx = 0;
    this.diry = 0;
    this.targetX = 0;
    this.targetY = 0;
    this.width = 50;
    this.height = 50;
    this.health = 100;
    this.ctx = ctx;
  }

  draw = () => {
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
  };
}



class Game {
  constructor(ctx, socket) {
     console.log('init');
     this.socket = socket;
     this.ctx = ctx;
     
     this.players = [];
 
     
    
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
 };

 draw = () => {
   this.ctx.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);

   for (let i = 0; i < this.players.length; i++) {
     const player = this.players[i];
     player.draw();
   }

 };
}



export default class App extends Component {
  constructor(props) {
    super(props);

    this.canvasRef = createRef();
    this.state = {
      CURRENT_STEP:'',
      isGameRunning:false,
    }

    this.game = new Game ();
    this.lastLoop = null;

  }

  start = () =>{
    var socket = io("https://dude-its-a-game.herokuapp.com/");

    if(!this.state.isGameRunning){
      this.game = new Game(this.getCtx(), socket);
      this.loop();  
    }
    this.setState(state =>({isGameRunning: !state.isGameRunning}));
  }

  getCtx = () => this.canvasRef.current.getContext("2d");

  loop = () => {
    requestAnimationFrame(() =>{ 
      const now = Date.now();
      //if(now - this.lastLoop > ( 1000 / 30 ))
        this.game.update();
      
        this.game.draw();
        
        this.lastLoop = Date.now();

        if(this.state.isGameRunning){
          this.loop();
        }
      
    })
  }


  render() {
    return (
      <div>

      <button onClick={this.start} >Start</button>
      <canvas
      ref={this.canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      style={{ backgroundColor: "grey" }}
    />
    
      </div>
    );
  }
}
