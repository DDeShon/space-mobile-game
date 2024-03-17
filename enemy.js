class Enemy {
  constructor(game) {
    this.game = game;
    this.spriteWidth = 100;
    this.spriteHeight = 100;
    this.sizeModifier = Math.random() * 0.3 + 0.8;
    this.width = this.spriteWidth * this.sizeModifier;
    this.height = this.spriteHeight * this.sizeModifier;
    this.x;
    this.y;
    this.speedX;
    this.speedY;
    this.frameX;
    this.frameY;
    this.lastFrame;
    this.minFrame;
    this.maxFrame;
    this.lives;
    this.free = true;

    this.states = [
      new Flying(game, this),
      new Phasing(game, this),
      new Imploding(game, this),
    ];
    this.currentState;
  }

  start() {
    this.x = Math.random() * this.game.width;
    this.y = -this.height;
    this.frameX = 0;
    this.frameY = Math.floor(Math.random() * 4);
    this.free = false;
  }

  setState(state) {
    this.currentState = this.states[state];
    this.currentState.start();
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

    // if (!this.isAlive()) this.setState(2);
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
        if (!this.game.gameOver) {
          this.game.lives--;
          this.game.sound.scream.play();
        }
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
      if (this.game.debug) {
        this.game.ctx.strokeRect(this.x, this.y, this.width, this.height);
        this.game.ctx.fillText(
          this.lives,
          this.x + this.width * 0.5,
          this.y + this.height * 0.5
        );
      }
    }
  }
}

class Beetlemorph extends Enemy {
  constructor(game) {
    super(game);
    this.image = document.getElementById("beetlemorph");
    this.lastFrame = 3;
    this.minFrame = 1;
  }

  start() {
    super.start();
    this.speedX = 0;
    this.speedY = Math.random() * 2 + 0.2;
    this.lives = 1;
  }

  hit() {
    super.hit();
    if (!this.isAlive()) this.setState(2);
  }

  update() {
    super.update();
    this.frameX = 0;
    if (!this.free) {
      if (this.isAlive()) {
        this.hit();
      }
    }
  }
}

class Lobstermorph extends Enemy {
  constructor(game) {
    super(game);
    this.image = document.getElementById("lobstermorph");
    this.lastFrame = 14;
    this.minFrame = 7;
  }

  start() {
    super.start();
    this.speedX = 0;
    this.speedY = Math.random() * 0.5 + 0.2;
    this.lives = 3;
  }

  hit() {
    super.hit();
    if (!this.isAlive()) this.setState(2);
  }

  update() {
    super.update();
    if (!this.free) {
      if (this.lives >= 3) {
        this.maxFrame = 0;
      } else if (this.lives === 2) {
        this.maxFrame = 3;
      } else if (this.lives === 1) {
        this.maxFrame = 7;
      }
      if (this.isAlive()) {
        this.hit();
        if (this.frameX < this.maxFrame && this.game.spriteUpdate) {
          this.frameX++;
        }
      }
    }
  }
}

class Phantommorph extends Enemy {
  constructor(game) {
    super(game);
    this.image = document.getElementById("phantommorph");
    this.lastFrame = 12;
    this.minFrame = 6;
    // this.states = [
    //   new Flying(game, this),
    //   new Phasing(game, this),
    //   new Imploding(game, this),
    // ];
    // this.currentState;
    this.switchTimer = 0;
    this.switchInterval = Math.random() * 2000 + 1000;
  }

  start() {
    super.start();
    this.speedX = Math.random() * 2 - 1;
    this.speedY = Math.random() * 0.5 + 0.2;
    this.lives = 1;
    this.setState(Math.floor(Math.random() * 2));
  }

  setState(state) {
    this.currentState = this.states[state];
    this.currentState.start();
  }

  handleFrames() {
    if (this.game.spriteUpdate) {
      if (this.frameX < this.maxFrame) {
        this.frameX++;
      } else {
        this.frameX = this.minFrame;
      }
    }
  }

  switch() {
    if (this.currentState === this.states[0]) {
      this.setState(1);
    } else {
      this.setState(0);
    }
  }

  hit() {
    super.hit();
    if (!this.isAlive()) this.setState(2);
  }

  update(deltaTime) {
    super.update();
    if (!this.free) {
      this.currentState.update();
      // move horizontally
      if (this.x <= 0 || this.x >= this.game.width - this.width) {
        this.speedX *= -1;
      }

      if (this.isAlive()) {
        if (this.switchTimer < this.switchInterval) {
          this.switchTimer += deltaTime;
        } else {
          this.switchTimer = 0;
          this.switch();
        }
      }
    }
  }
}

class EnemyState {
  constructor(game, enemy) {
    this.game = game;
    this.enemy = enemy;
  }
}

class Flying extends EnemyState {
  start() {
    this.enemy.minFrame = 0;
    this.enemy.maxFrame = 2;
    this.enemy.speedX = Math.random() * 2 - 1;
    this.enemy.speedY = Math.random() * 0.5 + 0.2;
    this.enemy.frameX = this.enemy.minFrame;
  }

  update() {
    this.enemy.hit();
    this.enemy.handleFrames();
  }
}

class Phasing extends EnemyState {
  start() {
    this.enemy.minFrame = 3;
    this.enemy.maxFrame = 5;
    this.enemy.speedX = Math.random() * 2 - 1;
    this.enemy.speedY = Math.random() * 0.5 + 0.2;
    this.enemy.frameX = this.enemy.minFrame;
  }

  update() {
    this.enemy.handleFrames();
    if (
      this.game.checkCollision(this.enemy, this.game.mouse) &&
      this.game.mouse.pressed
    ) {
      this.enemy.y += 25;
      this.enemy.speedX = 0;
      this.enemy.speedY = 2;
      this.game.sound.play(this.game.sound.slide);
    }
  }
}

class Imploding extends EnemyState {
  start() {
    this.enemy.minFrame = 6;
    this.enemy.maxFrame = this.enemy.lastFrame + 1;
    this.enemy.frameX = this.enemy.minFrame;
    this.game.sound.play(
      this.game.sound.boomSounds[Math.floor(Math.random() * 4)]
    );
  }

  update() {}
}
