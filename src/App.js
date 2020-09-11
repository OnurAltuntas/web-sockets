import React, { Component,createRef } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import io from "socket.io-client";
import Game from "../src/components/game/Game"


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
    var socket = io("http://localhost:5000/");

    if(!this.state.isGameRunning){
      this.game = new Game(this.getCtx(), socket);
      this.loop();  
    }
    this.setState(state =>({isGameRunning: !state.isGameRunning}));


    socket.emit('PLAYER_NAME_UPDATE', { name: this.state.name });
    /* if (!this.state.isGameRunning) {
      this.game = new Game(this.getCtx(), socket);
      this.loop();
    }
    this.setState(state => ({nameEntered: true, isGameRunning: !state.isGameRunning})); */
  
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
      <div style={{height: '100%'}}>
        {!this.state.nameEntered && (
          <div style={{height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'black'}}>
            <input type="text" onChange={(evt) => this.setState({name: evt.target.value.substring(0, 6).toLowerCase()})} />
            <button disabled={!this.state.name} onClick={this.start}>START!</button>
          </div>
        )}
        <div style={{height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'black'}}>
          <canvas ref={this.canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
          </canvas>
        </div>
      </div>
    );
  }
}
