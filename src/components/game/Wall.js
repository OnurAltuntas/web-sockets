class Wall {
    constructor(ctx) {
  
      this.id = 0;
      this.x = 200;
      this.y = 0;
  
      this.dirx = 0;
      this.diry = 0;
      this.targetX = 0;
      this.targetY = 0;
      this.width = 50;
      this.height = 200;
      this.ctx = ctx;
    }
  
    draw = () => {
  
      //this.x -= 1;
      this.ctx.fillStyle = "black";
      this.ctx.fillRect(this.x, this.y, this.width,this.height);
    };
  }
  
  export default Wall;
  