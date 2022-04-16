// 从地址生成图片
const imageFromPath = function (path) {
  const img = new Image();
  img.src = path;
  return img;
}

// 控制打板
const Paddle = function () {
  const image = imageFromPath('images/paddle.png');
  const obj = {
    image,
    x: 100,
    y: 520,
    speed: 10
  };
  obj.moveLeft = function () {
    obj.x -= obj.speed;
  }
  obj.moveRight = function () {
    obj.x += obj.speed;
  }
  obj.collide = function (ball) {
    if (ball.y + ball.image.height > obj.y) {
      if (ball.x > obj.x && ball.x < obj.x + obj.image.width) {
        return true;
      }
    }
    return false;
  }
  return obj;

}

// 控制球
const Ball = function () {
  const image = imageFromPath('images/ball.png');
  const obj = {
    image: image,
    x: 0,
    y: 0,
    speedX: 6,
    speedY: 6,
    launched: false,
  }
  obj.launch = function () {
    obj.launched = true;
  }
  obj.move = function (game, paddle) {
    if (obj.launched) {
      if (obj.x < 0 || obj.x > game.canvas.width) {
        obj.speedX = -obj.speedX;
      }
      if (obj.y < 0 || obj.y > game.canvas.height) {
        obj.speedY = -obj.speedY;
      }
      obj.x += obj.speedX;
      obj.y += obj.speedY;
      if (obj.y > paddle.y) {
        console.log("game over");
        return;
      }
    }
  }

  return obj;

}

// 游戏
const Game = function () {
  const game = {
    actions: {},
    keydown: {},
  }

  const canvas = document.querySelector('#canvas');
  const context = canvas.getContext('2d');
  game.canvas = canvas;
  game.context = context;
  game.drawImage = function (gameImage) {
    game.context.drawImage(gameImage.image, gameImage.x, gameImage.y);
  }
  window.addEventListener('keydown', function (event) {
    game.keydown[event.which] = true;
  });
  window.addEventListener('keyup', function (event) {
    game.keydown[event.which] = false;
  });
  game.registerAction = function (key, callback) {
    game.actions[key] = callback;
  }
  game.run = function () {
    const actions = Object.keys(game.actions);
    for (let i = 0; i < actions.length; i++) {
      const key = actions[i];

      if (game.keydown[key]) {
        game.actions[key]();
      }
    }

    game.update();
    context.clearRect(0, 0, canvas.width, canvas.height);
    game.draw();
    window.requestAnimationFrame(game.run);
  }

  return game;
}

// 主函数
const main = function () {
  const game = Game();
  const paddle = Paddle();
  const ball = Ball();
  game.registerAction('37', function () {
    paddle.moveLeft();
  })
  game.registerAction('39', function () {
    paddle.moveRight();
  })
  game.registerAction('32', function () {
    ball.launch();
  })
  game.update = function () {
    ball.move(game, paddle);
    if (paddle.collide(ball)) {
      ball.speedY = -ball.speedY;
    }
  }
  game.draw = function () {
    game.drawImage(paddle);
    game.drawImage(ball);
  }
  window.requestAnimationFrame(game.run);
}

main();
