class Enemy {
  constructor(game) {
    this.game = game;
    this.spriteWidth = 100;
    this.spriteHeight = 100;
    this.sizeModifier = 2;
    this.width = this.spriteWidth * this.sizeModifier;
    this.height = this.spriteHeight * this.sizeModifier;
    this.x;
    this.y;
    this.speedX;
    this.speedY;
    this.frameX;
    this.frameY;
    this.lastFrame;
    this.free = true;
  }

  start() {
    this.x = Math.random() * this.game.width;
    this.y = -this.height;
    this.frameX = 0;
    this.frameY = Math.floor(Math.random() * 4);
    this.free = false;
  }

  reset() {
    this.free = true;
  }

  isAlive() {
    return this.lives >= 1;
  }

  hit() {
    // check collision
    if (
      this.game.checkCollision(this, this.game.mouse) &&
      this.game.mouse.pressed &&
      !this.game.mouse.fired
    ) {
      this.lives--;
      this.game.mouse.fired = true;
    }
  }

  update() {
    if (!this.free) {
      // float in
      if (this.y < 0) this.y += 5;

      // make sure the enemy is always visible
      if (this.x > this.game.width - this.width) {
        this.x = this.game.width - this.width;
      }
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.y > this.game.height) {
        this.reset();
        this.game.lives--;
      }

      if (!this.isAlive()) {
        if (this.game.spriteUpdate) {
          this.frameX++;
          if (this.frameX > this.lastFrame) {
            this.reset();
            if (!this.game.gameOver) this.game.score++;
          }
        }
      }
    }
  }

  draw() {
    if (!this.free) {
      this.game.ctx.drawImage(
        this.image,
        this.frameX * this.spriteWidth,
        this.frameY * this.spriteHeight,
        this.spriteWidth,
        this.spriteHeight,
        this.x,
        this.y,
        this.width,
        this.height
      );
      // this.game.ctx.strokeRect(this.x, this.y, this.width, this.height);
      // this.game.ctx.fillText(
      //   this.lives,
      //   this.x + this.width * 0.5,
      //   this.y + this.height * 0.5
      // );
    }
  }
}

class Beetlemorph extends Enemy {
  constructor(game) {
    super(game);
    this.image = document.getElementById("beetlemorph");
  }

  start() {
    super.start();
    this.speedX = 0;
    this.speedY = Math.random() * 2 + 0.2;
    this.lives = 1;
    this.lastFrame = 3;
  }

  update() {
    super.update();
    if (!this.free) {
      if (this.isAlive()) {
        this.hit();
      }
    }
  }
}
