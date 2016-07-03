global.mouseX = CANVAS_WIDTH/2;

var score = 0;
var lives = 3;

var x = CANVAS_WIDTH/2;
var y = 430;

var dx = 2;
var dy = -2;

var brickRowCount = 5;
var brickColumnCount = 3;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var score = 0;
var lives = 3;

var bricks = [];
for(c=0; c<brickColumnCount; c++) {
  bricks[c] = [];
  for(r=0; r<brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

function collisionDetection() {
  // for(c=0; c<brickColumnCount; c++) {
  //   for(r=0; r<brickRowCount; r++) {
  //     var b = bricks[c][r];
  //     if(b.status == 1) {
  //       if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
  //         dy = -dy;
  //         b.status = 0;
  //         score++;
  //         if(score == brickRowCount*brickColumnCount) {
  //           alert("YOU WIN, CONGRATS!");
  //           document.location.reload();
  //         }
  //       }
  //     }
  //   }
  // }
}

var ball = this.getField('ball');
function drawBall() {
  ball.rect = [
    x, y, x + BALL_WIDTH, y + BALL_HEIGHT
  ];
}

function paddleX() {
  return global.mouseX - PADDLE_WIDTH/2;
}

var paddle = this.getField('paddle');
function drawPaddle() {
  paddle.rect = [
    paddleX(),
    paddle.rect[1],
    paddleX() + PADDLE_WIDTH,
    paddle.rect[3]
  ]
}

function drawBricks() {
  // for(c=0; c<brickColumnCount; c++) {
  //   for(r=0; r<brickRowCount; r++) {
  //     if(bricks[c][r].status == 1) {
  //       var brickX = (r*(brickWidth+brickPadding))+brickOffsetLeft;
  //       var brickY = (c*(brickHeight+brickPadding))+brickOffsetTop;
  //       bricks[c][r].x = brickX;
  //       bricks[c][r].y = brickY;
  //       ctx.beginPath();
  //       ctx.rect(brickX, brickY, brickWidth, brickHeight);
  //       ctx.fillStyle = "#0095DD";
  //       ctx.fill();
  //       ctx.closePath();
  //     }
  //   }
  // }
}

var scoreField = this.getField('score');
function drawScore() {
  scoreField.value = "Score: " + score;
}
var livesField = this.getField('lives');
function drawLives() {
  livesField.value = 'Lives: ' + lives;
}

function draw() {
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  
  collisionDetection();

  if (x + dx > CANVAS_WIDTH - BALL_WIDTH || x + dx < 0) {
    dx = -dx;
  }

  if (y + dy > CANVAS_BOTTOM + CANVAS_HEIGHT - BALL_HEIGHT) {
    dy = -dy;

  } else if (y + dy < CANVAS_BOTTOM + PADDLE_HEIGHT) {
    if (x + BALL_WIDTH > paddleX() && x < paddleX() + PADDLE_WIDTH) {
      dy = -dy;

    } else {
      lives--;

      if (lives == 0) {
        app.alert("GAME OVER");

      } else {
        x = CANVAS_WIDTH / 2;
        y = CANVAS_BOTTOM + CANVAS_HEIGHT - 30;
        dx = 2;
        dy = -2;
      }
    }
  }
  x += dx;
  y += dy;
}

var whole = this.getField('whole');
function testDraw() {
  try {
    whole.display = display.visible;
    draw();
    whole.display = display.hidden;

  } catch (e) {
    app.alert(e.toString())
  }
}
app.setInterval('testDraw()', 15);
