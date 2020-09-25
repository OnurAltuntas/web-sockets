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

    socket.on('disconnect', () => {
      this.setState({isGameRunning: false});
      setTimeout(window.location.reload, 10000);
    });

    // var socket = io('https://selman-nnn.herokuapp.com');
    socket.emit('PLAYER_NAME_UPDATE', { name: this.state.name });
    if (!this.state.isGameRunning) {
      this.game = new Game(this.getCtx(), socket);
      this.loop();
    }
    this.setState(state => ({nameEntered: true, isGameRunning: !state.isGameRunning}));
  
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

      <h1 className="logo">
      Flappy Online
      </h1>

      <div className="root-div">
      {!this.state.nameEntered && (
        <div className ="input" style={{height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'grey'}}>
          <input type="text" style={{border: 3,borderRadius:20,height:40,width:200,paddingLeft:70}}  onChange={(evt) => this.setState({name: evt.target.value.substring(0, 6).toLowerCase()})} />
          <button style={{border: 3,borderRadius:10,height:40,width:50,paddingLeft:10,paddingRight:50}} disabled={!this.state.name} onClick={this.start}>START!</button>
        </div>
      )}
       
        <div className="canvas-div"  >
          <canvas ref={this.canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
          </canvas>
        </div>
      </div>

       
    
      </div>
    );
  }
}
