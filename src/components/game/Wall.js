class Wall {
    constructor(ctx) {
  
      this.id = 0;
      this.x = 500;
      this.y = 0;
      this.secondPartY = 300;
  
      this.dirx = 0;
      this.diry = 0;
      this.targetX = 0;
      this.targetY = 0;
      this.width = 100;
      this.height = 150;
      this.ctx = ctx;
    }
  
    draw = () => {
  
      //this.x -= 1;  
      this.ctx.fillStyle = "orange";
      this.ctx.fillRect(this.x,  this.secondPartY, this.width,this.height);
      this.ctx.fillStyle = "orange";
      this.ctx.fillRect(this.x, this.y, this.width,this.height);
    

    };
  }
  
  export default Wall;
  