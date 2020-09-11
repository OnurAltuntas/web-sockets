
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;
const TILE_WIDTH = 64;
const TILE_HEIGHT = 64;

class Player {
  constructor(ctx) {

    this.id = 0;
    this.name = "";
    this.x = 0;
    this.y = 0;
    this.isDead = false;

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

    const x = CANVAS_WIDTH / 2 - 32;
    const y = CANVAS_HEIGHT / 2 - 32;

    if(!this.isDead){
      this.ctx.fillStyle = "red";
      this.ctx.fillRect(this.x, this.y, this.width,this.height);
      this.ctx.font = '18px comic sans';
      this.ctx.fillStyle = 'white';
      this.ctx.textAlign = "center";
      this.ctx.fillText(this.name, this.x + TILE_WIDTH / 2, this.y + 10);
    }

    };
}

export default Player;
