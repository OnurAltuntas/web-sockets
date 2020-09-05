import React, { Component,createRef } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import io from "socket.io-client";
const Game = require("../src/components/game/Game");


const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;



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
    var socket = io();

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
