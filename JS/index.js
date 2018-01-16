

var imageFromPath = function (path) {
    var img = new Image();
    img.src = path;
    return img;
}

var Paddle = function () {
    var image = imageFromPath('images/paddle.png');
    var obj = {
        image: image,
        x: 100,
        y: 420,
        speed: 10,
    }
    obj.moveLeft = function () {
        obj.x -= obj.speed;
    }
    obj.moveRight = function () {
        obj.x += obj.speed;
    }
    obj.collide = function (ball) {
        
        if (ball.y + ball.image.height > obj.y) {
            // console.log("p")
            
            if (ball.x > obj.x && ball.x < obj.x + obj.image.width) {
                return true;
            }
        }
        return false;
    }
    return obj;

}

var Ball = function () {
    var image = imageFromPath('images/ball.png');
    var obj = {
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
    obj.move = function (game,paddle) {
        if (obj.launched) {
            //console.log("move");
            if (obj.x < 0 || obj.x > game.canvas.width) {
                obj.speedX = -obj.speedX;
            }
            /**TODO:
             * 修改 gameover 判定
             */
            if (obj.y < 0|| obj.y > game.canvas.height) {
                obj.speedY = -obj.speedY;
            }
            obj.x += obj.speedX;
            obj.y += obj.speedY;
            // if (obj.y>paddle.y) {
            //     console.log("gameover");
            //     return
            // }
        }
    }

    return obj;

}

var Game = function () {
    var game = {
        actions: {},
        keydown: {},
    }

    var canvas = document.querySelector('#id-canvas');
    var context = canvas.getContext('2d');
    game.canvas = canvas;
    game.context = context;
    //draw
    game.drawImage = function (gameImage) {
        game.context.drawImage(gameImage.image, gameImage.x, gameImage.y);
    }
    //events
    window.addEventListener('keydown', function (event) {

        game.keydown[event.which] = true;
    });
    window.addEventListener('keyup', function (event) {
        game.keydown[event.which] = false;
    });
    game.registerAction = function (key, callback) {
        game.actions[key] = callback;
    }
    //timer
    setInterval(function () {

        // events
        var actions = Object.keys(game.actions);
        //console.log(actions)
        for (var i = 0; i < actions.length; i++) {
            var key = actions[i];

            if (game.keydown[key]) {
                game.actions[key]();
            }
        }

        game.update();
        // clear
        context.clearRect(0, 0, canvas.width, canvas.height);
        // draw
        game.draw();
    }, 1000 / 59.999)
    return game;
}



var main = function () {
    var game = Game();
    var paddle = Paddle();
    var ball = Ball();
    //event
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
        ball.move(game,paddle);
        if (paddle.collide(ball)) {
            ball.speedY = -ball.speedY
        }
    }
    game.draw = function () {
        //draw
        game.drawImage(paddle);
        game.drawImage(ball);
    }
}

main();









