const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');

const GRID_SIZE = 18;
const TILE_COUNT = 20; // 360 / 18 = 20 cells

let snake = [
  { x: 180, y: 180 },
  { x: 162, y: 180 },
  { x: 144, y: 180 }
];

let dx = GRID_SIZE;
let dy = 0;
let score = 0;
let food = createFood();
let gameInterval = null;
let changingDirection = false;

// Controls
document.addEventListener('keydown', handleKeyPress);

// Mobile On-screen Controls
document.getElementById('btnUp').addEventListener('click', () => changeDirection('UP'));
document.getElementById('btnDown').addEventListener('click', () => changeDirection('DOWN'));
document.getElementById('btnLeft').addEventListener('click', () => changeDirection('LEFT'));
document.getElementById('btnRight').addEventListener('click', () => changeDirection('RIGHT'));

// Swipe gestures for touch screens
let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
}, { passive: true });

canvas.addEventListener('touchend', (e) => {
  if (!touchStartX || !touchStartY) return;
  
  let touchEndX = e.changedTouches[0].clientX;
  let touchEndY = e.changedTouches[0].clientY;

  let diffX = touchEndX - touchStartX;
  let diffY = touchEndY - touchStartY;

  if (Math.abs(diffX) > Math.abs(diffY)) {
    if (diffX > 30) changeDirection('RIGHT');
    else if (diffX < -30) changeDirection('LEFT');
  } else {
    if (diffY > 30) changeDirection('DOWN');
    else if (diffY < -30) changeDirection('UP');
  }

  touchStartX = 0;
  touchStartY = 0;
}, { passive: true });

function main() {
  if (hasGameEnded()) {
    alert(`¡Juego Terminado! Tu puntaje fue: ${score}`);
    resetGame();
    return;
  }

  changingDirection = false;
  clearCanvas();
  drawFood();
  moveSnake();
  drawSnake();
}

function resetGame() {
  snake = [
    { x: 180, y: 180 },
    { x: 162, y: 180 },
    { x: 144, y: 180 }
  ];
  dx = GRID_SIZE;
  dy = 0;
  score = 0;
  scoreEl.textContent = score;
  food = createFood();
}

function clearCanvas() {
  ctx.fillStyle = '#0f3460';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
  snake.forEach((part, index) => {
    ctx.fillStyle = index === 0 ? '#4eef90' : '#2eaf60';
    ctx.beginPath();
    // Render circle correctly inside grid cell
    ctx.arc(
      part.x + GRID_SIZE / 2,
      part.y + GRID_SIZE / 2,
      GRID_SIZE / 2 - 1,
      0,
      Math.PI * 2
    );
    ctx.fill();
  });
}

function moveSnake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);

  const hasEatenFood = snake[0].x === food.x && snake[0].y === food.y;
  if (hasEatenFood) {
    score += 10;
    scoreEl.textContent = score;
    food = createFood();
  } else {
    snake.pop();
  }
}

function hasGameEnded() {
  for (let i = 4; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
  }

  const hitLeftWall = snake[0].x < 0;
  const hitRightWall = snake[0].x >= canvas.width;
  const hitToptWall = snake[0].y < 0;
  const hitBottomWall = snake[0].y >= canvas.height;

  return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall;
}

function createFood() {
  let foodX, foodY;
  while (true) {
    foodX = Math.floor(Math.random() * TILE_COUNT) * GRID_SIZE;
    foodY = Math.floor(Math.random() * TILE_COUNT) * GRID_SIZE;
    
    // Check if food is placed on snake body
    let onSnake = snake.some(part => part.x === foodX && part.y === foodY);
    if (!onSnake) break;
  }
  return { x: foodX, y: foodY };
}

function drawFood() {
  ctx.fillStyle = '#e94560';
  ctx.beginPath();
  ctx.arc(
    food.x + GRID_SIZE / 2,
    food.y + GRID_SIZE / 2,
    GRID_SIZE / 2 - 1,
    0,
    Math.PI * 2
  );
  ctx.fill();
}

function handleKeyPress(event) {
  const keyPressed = event.keyCode;
  const LEFT_KEY = 37;
  const RIGHT_KEY = 39;
  const UP_KEY = 38;
  const DOWN_KEY = 40;

  if (keyPressed === LEFT_KEY) changeDirection('LEFT');
  if (keyPressed === UP_KEY) changeDirection('UP');
  if (keyPressed === RIGHT_KEY) changeDirection('RIGHT');
  if (keyPressed === DOWN_KEY) changeDirection('DOWN');
}

function changeDirection(direction) {
  if (changingDirection) return;

  const goingUp = dy === -GRID_SIZE;
  const goingDown = dy === GRID_SIZE;
  const goingRight = dx === GRID_SIZE;
  const goingLeft = dx === -GRID_SIZE;

  if (direction === 'LEFT' && !goingRight) {
    dx = -GRID_SIZE;
    dy = 0;
    changingDirection = true;
  }
  if (direction === 'UP' && !goingDown) {
    dx = 0;
    dy = -GRID_SIZE;
    changingDirection = true;
  }
  if (direction === 'RIGHT' && !goingLeft) {
    dx = GRID_SIZE;
    dy = 0;
    changingDirection = true;
  }
  if (direction === 'DOWN' && !goingUp) {
    dx = 0;
    dy = GRID_SIZE;
    changingDirection = true;
  }
}

// Start Game Loop
setInterval(main, 100);
