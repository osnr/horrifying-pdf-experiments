// Core Breakout game. Logic derived from:
// https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript/Finishing_up

// Collision detection is not so great.

var score;
var lives;

var x;
var y;

var dx;
var dy;

var bands;
var bricks;
var bricksRemaining;

function init() {
  // Page open event (and so this script file) might get called again,
  // so head it off here.
  if (global.initialized) return;
  global.initialized = true;

  score = 0;
  lives = 3;

  x = CANVAS_WIDTH/2;
  y = 430;

  dx = 2;
  dy = 2;

  bands = [];
  bricks = [];
  
  global.count = 3;

  global.mouseX = CANVAS_WIDTH/2;
  global.paused = false;

  initBricks();

  // Hide all the mouse-X detection bands until the game starts.
  // The user can then see the callout telling them to move their mouse
  // during the countdown.
  for (var bx = 0; bx < CANVAS_WIDTH; bx++) {
    bands[bx] = this.getField('band' + bx);
    bands[bx].display = display.hidden;
  }

  countdown();
}

function initBricks() {
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
  bricksRemaining = BRICK_ROW_COUNT * BRICK_COLUMN_COUNT;
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
        bricksRemaining--;
        if (bricksRemaining === 0) {
          app.alert("YOU WIN, CONGRATS!");
          dx *= 1.1;
          dy *= 1.1;
          initBricks();
        }
      }
    }
  }
}

var ball = this.getField('ball');
function drawBall() {
  // Rect changes are almost the only changes you can carry out on a
  // Field in Chrome's subset of PDF JS:
  // https://pdfium.googlesource.com/pdfium/+/chromium/2524/fpdfsdk/src/javascript/Field.cpp#2356
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

var countdownField = this.getField('countdown');
function draw() {
  if (global.paused) {
    countdownField.display = display.visible;
    countdownField.value = 'Paused';
    return;
  }

  countdownField.display = display.hidden;

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

      if (lives === 0) {
        app.alert("GAME OVER");
        score = 0;
        lives = 3;
        x = CANVAS_WIDTH/2;
        y = 430;

        dx = 2;
        dy = 2;
        initBricks();

      } else {
        x = CANVAS_WIDTH / 2;
        y = CANVAS_BOTTOM + CANVAS_HEIGHT - 30;
        if (dx < 0) dx = -dx;
        if (dy > 0) dy = -dy;
      }
    }
  }
  x += dx;
  y += dy;
}

// This 'whole' thing blanks out the whole screen while we render,
// because Chrome doesn't expect us to actually move objects around,
// so if you do it naively you get terrible artifacts. Breaks Acrobat,
// though (or at least they're too slow for this to work nicely).
var whole = this.getField('whole');
function wrappedDraw() {
  try {
    whole.display = display.visible;
    draw();
    whole.display = display.hidden;

  } catch (e) {
    app.alert(e.toString())
  }
}

function start() {
  for (var bx = 0; bx < CANVAS_WIDTH; bx++) {
      bands[bx].display = display.visible;
  }
  // TODO Some kind of speed regulation.
  app.setInterval('wrappedDraw()', 15);
}

function countdown() {
  countdownField.value = global.count.toString();

  global.count--;
  if (global.count < 0) {
    start();
  } else {
    app.setTimeOut('countdown()', 1000);
  }
}

init();
