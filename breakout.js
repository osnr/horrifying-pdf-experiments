// Core Breakout game. Logic derived from:
// https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript/Finishing_up

global.mouseX = CANVAS_WIDTH/2;

var score = 0;
var lives = 3;

var x = CANVAS_WIDTH/2;
var y = 430;

var dx = 2;
var dy = -2;

var score = 0;
var lives = 3;

var bricks = [];
for (var c = 0; c < BRICK_COLUMN_COUNT; c++) {
  bricks[c] = [];
  for (var r = 0; r < BRICK_ROW_COUNT; r++) {
    bricks[c][r] = {
      x: r*(BRICK_WIDTH + BRICK_PADDING) + BRICK_OFFSET_LEFT,
      y: c*(BRICK_HEIGHT + BRICK_PADDING) + BRICK_OFFSET_BOTTOM,
      status: 1,
      field: this.getField('brick' + c + ',' + r)
    };
  }
}

function collisionDetection() {
  for (var c = 0; c < BRICK_COLUMN_COUNT; c++) {
    for (var r = 0; r < BRICK_ROW_COUNT; r++) {
      var b = bricks[c][r];
      if (b.status != 1) continue;

      if (x > b.x && x < b.x + BRICK_WIDTH &&
          y > b.y && y < b.y + BRICK_HEIGHT) {
        dy = -dy;
        b.status = 0;
        score++;
        if (score == BRICK_ROW_COUNT * BRICK_COLUMN_COUNT) {
          app.alert("YOU WIN, CONGRATS!");
        }
      }
    }
  }
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
  for (var c = 0; c < BRICK_COLUMN_COUNT; c++) {
    for (var r = 0; r < BRICK_ROW_COUNT; r++) {
      if (bricks[c][r].status == 1) {
        bricks[c][r].field.display = display.visible;
      } else {
        bricks[c][r].field.display = display.hidden;
      }
    }
  }
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

  } else if (y + dy < PADDLE_OFFSET_BOTTOM + PADDLE_HEIGHT) {
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