const rulesBtn = document.getElementById("rules-btn");
const closeBtn = document.getElementById("close-btn");
const rules = document.getElementById("rules");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let score = 0;

const brickRowCount = 9;
const brickColumnCount = 5;

// CREATE BALL PROPS
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 10,
  speed: 4,
  dx: 4,
  dy: -4,
};

// CREATE PADDLE PROPS
const paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 20,
  w: 80,
  h: 10,
  speed: 8,
  dx: 0,
};

// CREATE BRICK PROPS
const brickInfo = {
  w: 70,
  h: 20,
  padding: 10,
  offsetX: 45,
  offsetY: 60,
  visible: true,
};

// CREATE BRICKS
const bricks = [];
for (let i = 0; i < brickRowCount; i++) {
  bricks[i] = [];
  for (let j = 0; j < brickColumnCount; j++) {
    const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
    const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
    bricks[i][j] = { x, y, ...brickInfo };
  }
}

// DRAW BALL ON CANVAS
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
  ctx.fillStyle = "#7E3517";
  ctx.fill();
  ctx.closePath();
}

// DRAW PADDLE ON CANVAS
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.fillStyle = "#7E3517";
  ctx.fill();
  ctx.closePath();
}

// DRAW SCORE ON CANVAS
function drawScore() {
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
}

// DRAW BRICKS ON CANVAS
function drawBricks() {
  bricks.forEach((column) => {
    column.forEach((brick) => {
      ctx.beginPath();
      ctx.rect(brick.x, brick.y, brick.w, brick.h);
      ctx.fillStyle = brick.visible ? "#7E3517" : "transparent";
      ctx.fill();
      ctx.closePath();
    });
  });
}

// MOVE PADDLE ON CANVAS
function movePaddle() {
  paddle.x += paddle.dx;

  // WALL DETECTION
  if (paddle.x + paddle.w > canvas.width) {
    paddle.x = canvas.width - paddle.w;
  }

  if (paddle.x < 0) {
    paddle.x = 0;
  }
}

// MOVE BALL ON CANVAS
function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  // WALL COLLISION (RIGHT/LEFT)
  if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
    ball.dx *= -1; // ball.dx = ball.dx * -1
  }

  // WALL COLLISION (TOP/BOTTOM)
  if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
    ball.dy *= -1;
  }

  // PADDLE COLLISION
  if (
    ball.x - ball.size > paddle.x &&
    ball.x + ball.size < paddle.x + paddle.w &&
    ball.y + ball.size > paddle.y
  ) {
    ball.dy = -ball.speed;
  }

  // BRICK COLLISION
  bricks.forEach((column) => {
    column.forEach((brick) => {
      if (brick.visible) {
        if (
          ball.x - ball.size > brick.x && // LEFT BRICK SIDE CHECK
          ball.x + ball.size < brick.x + brick.w && // RIGHT BRICK SIDE CHECK
          ball.y + ball.size > brick.y && // TOP BRICK SIDE CHECK
          ball.y - ball.size < brick.y + brick.h // BOTTOM BRICK SIDE CHECK
        ) {
          ball.dy *= -1;
          brick.visible = false;

          increaseScore();
        }
      }
    });
  });

  // HIT BOTTOM WALL - LOSE
  if (ball.y + ball.size > canvas.height) {
    showAllBricks();
    score = 0;
  }
}

// INCREASE SCORE
function increaseScore() {
  score++;

  if (score % (brickRowCount * brickRowCount) === 0) {
    showAllBricks();
  }
}

// MAKE ALL BRICKS APPEAR
function showAllBricks() {
  bricks.forEach((column) => {
    column.forEach((brick) => (brick.visible = true));
  });
}

// DRAW EVERYTHING
function draw() {
  // CLEAR CANVAS
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBall();
  drawPaddle();
  drawScore();
  drawBricks();
}

// UPDATE CANVAS DRAWING AND ANIMATION
function update() {
  movePaddle();
  moveBall();

  // DRAW EVERYTHING
  draw();

  requestAnimationFrame(update);
}

update();

// KEYDOWN EVENT
function keyDown(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    paddle.dx = paddle.speed;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    paddle.dx = -paddle.speed;
  }
}

// KEYUP EVENT
function keyUp(e) {
  if (
    e.key === "Right" ||
    e.key === "ArrowRight" ||
    e.key === "Left" ||
    e.key === "ArrowLeft"
  ) {
    paddle.dx = 0;
  }
}

// KEYBOARD EVENT HANDLERS
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

// RULES AND CLOSE EVENT HANDLERS
rulesBtn.addEventListener("click", () => rules.classList.add("show"));
closeBtn.addEventListener("click", () => rules.classList.remove("show"));
