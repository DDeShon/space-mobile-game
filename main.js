class Game {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.width = this.canvas.width;
    this.height = this.canvas.height;

    this.enemyPool = [];
    this.numberOfEnemies = 50;
    this.createEnemyPool();
    this.enemyTimer = 0;
    this.enemyInterval = 1000;

    this.score;
    this.lives;
    this.winningScore = 3;
    this.message1 = "Run!";
    this.message2 = "Or get eaten!";
    this.message3 = 'Press "ENTER" or "R" to start!';
    this.gameOver;

    this.mouse = {
      x: undefined,
      y: undefined,
      width: 1,
      height: 1,
      pressed: false,
      fired: false,
    };

    this.start();

    window.addEventListener("resize", (e) => {
      this.resize(e.target.innerWidth, e.target.innerHeight);
    });

    window.addEventListener("mousedown", (e) => {
      this.mouse.x = e.x;
      this.mouse.y = e.y;
      this.mouse.pressed = true;
      this.mouse.fired = false;
    });

    window.addEventListener("mouseup", (e) => {
      this.mouse.x = e.x;
      this.mouse.y = e.y;
      this.mouse.pressed = false;
    });

    window.addEventListener("touchstart", (e) => {
      this.mouse.x = e.changedTouches[0].pageX;
      this.mouse.y = e.changedTouches[0].pageY;
      this.mouse.pressed = true;
      this.mouse.fired = false;
    });

    window.addEventListener("touchend", (e) => {
      this.mouse.x = e.changedTouches[0].pageX;
      this.mouse.y = e.changedTouches[0].pageY;
      this.mouse.pressed = false;
    });
  }

  start() {
    this.resize(window.innerWidth, window.innerHeight);
    this.score = 0;
    this.lives = 10;
    this.gameOver = false;
  }

  resize(width, height) {
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.width = width;
    this.height = height;
    this.ctx.fillStyle = "white";
    this.ctx.strokeStyle = "white";
    this.ctx.font = "30px Bangers";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
  }

  checkCollision(rect1, rect2) {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  }

  createEnemyPool() {
    for (let i = 0; i < this.numberOfEnemies; i++) {
      this.enemyPool.push(new Enemy(this));
    }
  }

  getEnemy() {
    for (let i = 0; i < this.enemyPool.length; i++) {
      if (this.enemyPool[i].free) return this.enemyPool[i];
    }
  }

  handleEnemies(deltaTime) {
    if (this.enemyTimer < this.enemyInterval) {
      this.enemyTimer += deltaTime;
    } else {
      this.enemyTimer = 0;
      const enemy = this.getEnemy();
      if (enemy) enemy.start();
    }
  }

  triggerGameOver() {
    if (!this.gameOver) {
      this.gameOver = true;
      if (this.lives < 1) {
        this.message1 = "Aargh!";
        this.message2 = "The crew was eaten!";
      } else if (this.score >= this.winningScore) {
        this.message1 = "Well done!";
        this.message2 = "You have escaped the swarm!";
      }
    }
  }

  drawStatusText() {
    this.ctx.save();
    this.ctx.textAlign = "left";
    this.ctx.fillText("Score:  " + this.score, 20, 40);
    for (let i = 0; i < this.lives; i++) {
      this.ctx.fillRect(20 + 15 * i, 60, 10, 20);
    }
    if (this.lives < 1 || this.score >= this.winningScore) {
      this.triggerGameOver();
    }
    if (this.gameOver) {
      this.ctx.textAlign = "center";
      this.ctx.font = "80px Bangers";
      this.ctx.fillText(this.message1, this.width * 0.5, this.height * 0.5);
      this.ctx.fillText(this.message2, this.width * 0.5, this.height * 0.5);
      this.ctx.fillText(this.message3, this.width * 0.5, this.height * 0.5);
    }
    this.ctx.restore();
  }

  render(deltaTime) {
    this.drawStatusText();
    this.handleEnemies(deltaTime);
    this.enemyPool.forEach((enemy) => {
      enemy.update();
      enemy.draw();
    });
  }
}

window.addEventListener("load", function () {
  const canvas = this.document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const game = new Game(canvas, ctx);

  let lastTime = 0;
  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.render(deltaTime);
    requestAnimationFrame(animate);
  }
  this.requestAnimationFrame(animate);
});
