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

  drawStatusText() {
    this.ctx.save();
    this.ctx.textAlign = "left";
    this.ctx.fillText("Score: ", 20, 35);
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
