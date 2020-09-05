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

module.exports = Player;
