const CONFIG = {
  gridSize: 20,
  cellSize: 25,
  gameSpeed: 150,
  colors: {
    background: '#1a1a2e',
    snake: '#4cc9f0',
    snakeHead: '#4895ef',
    food: '#f8961e',
    specialFood: '#f72585',
    obstacle: '#2f3640',
    grid: '#16213e',
    text: '#ffffff',
    textSecondary: '#a5a5a5'
  }
};

// ==================== ESTADOS ====================
const GameState = {
  MENU: 'menu',
  PLAYING: 'playing',
  PAUSED: 'paused',
  GAME_OVER: 'game_over',
  LEVEL_COMPLETE: 'level_complete',
  ADVENTURE_COMPLETE: 'adventure_complete'
};

// ==================== NIVELES ====================
const LEVELS = [
  // Nivel 1: Fácil - Sin obstáculos
  {
    id: 1,
    name: 'Bosque Tranquilo',
    description: 'Empieza tu aventura en un bosque sencillo',
    speed: 150,
    foodCount: 3,
    obstacles: [],
    targetScore: 10,
    snakeLength: 3,
    backgroundColor: '#1a1a2e'
  },
  // Nivel 2: Medio - Algunas rocas
  {
    id: 2,
    name: 'Montañas Rocosas',
    description: 'Evita las rocas mientras creces',
    speed: 130,
    foodCount: 4,
    obstacles: [
      { x: 5, y: 5 }, { x: 5, y: 6 }, { x: 5, y: 7 },
      { x: 15, y: 5 }, { x: 15, y: 6 }, { x: 15, y: 7 }
    ],
    targetScore: 20,
    snakeLength: 3,
    backgroundColor: '#16213e'
  },
  // Nivel 3: Difícil - Más obstáculos
  {
    id: 3,
    name: 'Cueva Oscura',
    description: 'Navega por la cueva con cuidado',
    speed: 110,
    foodCount: 5,
    obstacles: [
      { x: 3, y: 3 }, { x: 3, y: 4 }, { x: 3, y: 5 },
      { x: 17, y: 3 }, { x: 17, y: 4 }, { x: 17, y: 5 },
      { x: 8, y: 8 }, { x: 8, y: 9 }, { x: 8, y: 10 }
    ],
    targetScore: 35,
    snakeLength: 3,
    backgroundColor: '#0f3460'
  },
  // Nivel 4: Experto - Laberinto
  {
    id: 4,
    name: 'Laberinto del Dragón',
    description: 'Encuentra la salida del laberinto',
    speed: 100,
    foodCount: 6,
    obstacles: [
      { x: 5, y: 0 }, { x: 5, y: 1 }, { x: 5, y: 2 }, { x: 5, y: 3 },
      { x: 5, y: 6 }, { x: 5, y: 7 }, { x: 5, y: 8 }, { x: 5, y: 9 },
      { x: 5, y: 11 }, { x: 5, y: 12 }, { x: 5, y: 13 }, { x: 5, y: 14 },
      { x: 0, y: 10 }, { x: 1, y: 10 }, { x: 2, y: 10 }, { x: 3, y: 10 }, { x: 4, y: 10 },
      { x: 6, y: 10 }, { x: 7, y: 10 }, { x: 8, y: 10 }, { x: 9, y: 10 },
      { x: 11, y: 10 }, { x: 12, y: 10 }, { x: 13, y: 10 }, { x: 14, y: 10 },
      { x: 16, y: 10 }, { x: 17, y: 10 }, { x: 18, y: 10 }, { x: 19, y: 10 }
    ],
    targetScore: 50,
    snakeLength: 3,
    backgroundColor: '#0a192f'
  },
  // Nivel 5: Maestro - Desafío final
  {
    id: 5,
    name: 'Infierno del Gusano',
    description: 'El desafío definitivo',
    speed: 80,
    foodCount: 8,
    obstacles: [
      { x: 2, y: 2 }, { x: 2, y: 18 },
      { x: 18, y: 2 }, { x: 18, y: 18 },
      { x: 2, y: 10 }, { x: 18, y: 10 },
      { x: 10, y: 2 }, { x: 10, y: 18 }
    ],
    targetScore: 75,
    snakeLength: 3,
    backgroundColor: '#050a1e'
  }
];

// ==================== AVENTURAS ====================
const ADVENTURES = [
  {
    id: 'classic',
    name: 'Aventura Clásica',
    description: 'Juega los niveles tradicionales',
    levels: [0, 1, 2, 3, 4],
    icon: '🏆',
    color: '#4cc9f0'
  },
  {
    id: 'speed',
    name: 'Modo Velocidad',
    description: 'Todos los niveles a máxima velocidad',
    levels: [0, 1, 2, 3, 4],
    speedMultiplier: 0.7,
    icon: '⚡',
    color: '#f8961e'
  },
  {
    id: 'survival',
    name: 'Supervivencia',
    description: 'Un solo nivel sin fin',
    levels: [0],
    infinite: true,
    icon: '💀',
    color: '#f72585'
  },
  {
    id: 'labyrinth',
    name: 'Laberinto',
    description: 'Solo niveles con obstáculos',
    levels: [3, 4],
    icon: '🧭',
    color: '#4895ef'
  }
];

// ==================== ESTADO GLOBAL ====================
let gameState = GameState.MENU;
let currentAdventure = null;
let currentLevelIndex = 0;
let currentLevel = null;
let snake = [];
let food = [];
let specialFood = null;
let obstacles = [];
let direction = { x: 1, y: 0 };
let nextDirection = { x: 1, y: 0 };
let score = 0;
let highScores = {};
let gameLoopId = null;
let canvas, ctx;
let lastUpdateTime = 0;
let gameSpeed = CONFIG.gameSpeed;

// ==================== INICIALIZACIÓN ====================
function init() {
  canvas = document.getElementById('gameCanvas');
  ctx = canvas.getContext('2d');
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  loadHighScores();
  showMenu();
  document.addEventListener('keydown', handleKeyDown);
  setupButtons();
}

function resizeCanvas() {
  const size = Math.min(window.innerWidth, window.innerHeight) * 0.9;
  canvas.width = size;
  canvas.height = size;
  CONFIG.cellSize = Math.floor(size / CONFIG.gridSize);
}

function setupButtons() {
  const buttons = {
    startButton: () => startAdventure('classic'),
    adventureButton: showAdventureSelect,
    settingsButton: showSettings,
    backButton: showMenu,
    resumeButton: resumeGame,
    restartButton: restartLevel,
    menuButton: () => { gameState = GameState.MENU; showMenu(); },
    nextButton: nextLevel
  };

  Object.entries(buttons).forEach(([id, handler]) => {
    const btn = document.getElementById(id);
    if (btn) btn.addEventListener('click', handler);
  });
}

// ==================== MENÚ ====================
function showMenu() {
  gameState = GameState.MENU;
  clearInterval(gameLoopId);

  document.getElementById('menu').style.display = 'block';
  document.getElementById('adventureSelect').style.display = 'none';
  document.getElementById('levelSelect').style.display = 'none';
  document.getElementById('gameUI').style.display = 'none';
  document.getElementById('pauseMenu').style.display = 'none';
  document.getElementById('levelComplete').style.display = 'none';
  document.getElementById('gameOver').style.display = 'none';
  document.getElementById('adventureComplete').style.display = 'none';
  document.getElementById('settings').style.display = 'none';

  updateHighScoresDisplay();
}

function showAdventureSelect() {
  document.getElementById('menu').style.display = 'none';
  document.getElementById('adventureSelect').style.display = 'block';

  const adventureList = document.getElementById('adventureList');
  adventureList.innerHTML = '';

  ADVENTURES.forEach(adventure => {
    const btn = document.createElement('button');
    btn.className = 'adventure-button';
    btn.style.backgroundColor = adventure.color;
    btn.innerHTML = `<span>${adventure.icon}</span><div><strong>${adventure.name}</strong><p>${adventure.description}</p></div>`;
    btn.onclick = () => startAdventure(adventure.id);
    adventureList.appendChild(btn);
  });
}

function startAdventure(adventureId) {
  currentAdventure = ADVENTURES.find(a => a.id === adventureId);

  if (!currentAdventure.levels.length) {
    showLevelSelect();
    return;
  }

  startLevel(currentAdventure.levels[0]);
}

function showLevelSelect() {
  document.getElementById('adventureSelect').style.display = 'none';
  document.getElementById('levelSelect').style.display = 'block';

  const levelList = document.getElementById('levelList');
  levelList.innerHTML = '';

  LEVELS.forEach((level, index) => {
    const btn = document.createElement('button');
    btn.className = 'level-button';
    btn.innerHTML = `<strong>Nivel ${level.id}</strong><p>${level.name}</p>`;
    btn.onclick = () => {
      currentAdventure = ADVENTURES.find(a => a.id === 'custom');
      startLevel(index);
    };
    levelList.appendChild(btn);
  });
}

function showSettings() {
  document.getElementById('menu').style.display = 'none';
  document.getElementById('settings').style.display = 'block';
}

// ==================== NIVEL ====================
function startLevel(levelIndex) {
  currentLevel = LEVELS[levelIndex];
  currentLevelIndex = levelIndex;

  // Aplicar velocidad de la aventura si existe
  gameSpeed = currentAdventure?.speedMultiplier
    ? currentLevel.speed * currentAdventure.speedMultiplier
    : currentLevel.speed;

  // Posición inicial de la serpiente
  const startX = Math.floor(CONFIG.gridSize / 2);
  const startY = Math.floor(CONFIG.gridSize / 2);

  snake = [];
  for (let i = 0; i < currentLevel.snakeLength; i++) {
    snake.push({ x: startX - i, y: startY });
  }

  // Crear comida
  food = [];
  for (let i = 0; i < currentLevel.foodCount; i++) {
    createFood();
  }

  // Crear obstáculos
  obstacles = JSON.parse(JSON.stringify(currentLevel.obstacles));

  // Reiniciar puntuación
  score = 0;
  direction = { x: 1, y: 0 };
  nextDirection = { x: 1, y: 0 };

  // Cambiar color de fondo
  document.body.style.backgroundColor = currentLevel.backgroundColor;

  // Estado del juego
  gameState = GameState.PLAYING;

  // Mostrar UI del juego
  document.getElementById('menu').style.display = 'none';
  document.getElementById('adventureSelect').style.display = 'none';
  document.getElementById('levelSelect').style.display = 'none';
  document.getElementById('settings').style.display = 'none';
  document.getElementById('gameUI').style.display = 'block';
  document.getElementById('pauseMenu').style.display = 'none';
  document.getElementById('levelComplete').style.display = 'none';
  document.getElementById('gameOver').style.display = 'none';
  document.getElementById('adventureComplete').style.display = 'none';

  // Actualizar información
  updateLevelInfo();
  updateScore();

  // Iniciar game loop
  lastUpdateTime = performance.now();
  gameLoopId = setInterval(gameLoop, 16);

  // Enfocar canvas
  canvas.focus();
}

function updateLevelInfo() {
  document.getElementById('levelName').textContent = `${currentLevel.name} - Nivel ${currentLevel.id}`;
  document.getElementById('levelTarget').textContent = `Objetivo: ${currentLevel.targetScore} pts`;
}

// ==================== GAME LOOP ====================
function gameLoop() {
  if (gameState !== GameState.PLAYING) return;

  const now = performance.now();
  if (now - lastUpdateTime >= gameSpeed) {
    lastUpdateTime = now;
    updateGame();
  }

  render();
}

function updateGame() {
  // Actualizar dirección
  direction = { ...nextDirection };

  // Calcular nueva posición de la cabeza
  const head = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y
  };

  // Verificar colisiones
  if (checkCollision(head)) {
    gameOver();
    return;
  }

  // Mover serpiente
  snake.unshift(head);

  // Verificar si comió comida normal
  let foodEaten = false;
  for (let i = 0; i < food.length; i++) {
    if (food[i].x === head.x && food[i].y === head.y) {
      foodEaten = true;
      food.splice(i, 1);
      createFood();
      score += 10;
      updateScore();
      break;
    }
  }

  // Verificar comida especial
  if (specialFood && specialFood.x === head.x && specialFood.y === head.y) {
    foodEaten = true;
    score += 50;
    specialFood = null;
    updateScore();

    // Crear nueva comida especial ocasionalmente
    if (Math.random() < 0.3) {
      createSpecialFood();
    }
  }

  // Si no comió, quitar cola
  if (!foodEaten) {
    snake.pop();
  }

  // Verificar si completó el nivel
  if (score >= currentLevel.targetScore) {
    levelComplete();
  }

  // Crear comida especial ocasionalmente
  if (!specialFood && Math.random() < 0.01) {
    createSpecialFood();
  }
}

function checkCollision(head) {
  // Colisión con paredes
  if (head.x < 0 || head.x >= CONFIG.gridSize || head.y < 0 || head.y >= CONFIG.gridSize) {
    return true;
  }

  // Colisión con serpiente
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === head.x && snake[i].y === head.y) {
      return true;
    }
  }

  // Colisión con obstáculos
  for (const obstacle of obstacles) {
    if (obstacle.x === head.x && obstacle.y === head.y) {
      return true;
    }
  }

  return false;
}

function createFood() {
  let newFood;
  let attempts = 0;

  do {
    newFood = {
      x: Math.floor(Math.random() * CONFIG.gridSize),
      y: Math.floor(Math.random() * CONFIG.gridSize)
    };
    attempts++;

    if (attempts > 100) {
      // Si no encuentra espacio, poner en posición fija
      newFood = { x: 0, y: 0 };
      break;
    }
  } while (isPositionOccupied(newFood.x, newFood.y));

  food.push(newFood);
}

function createSpecialFood() {
  let newFood;
  let attempts = 0;

  do {
    newFood = {
      x: Math.floor(Math.random() * CONFIG.gridSize),
      y: Math.floor(Math.random() * CONFIG.gridSize)
    };
    attempts++;

    if (attempts > 100) {
      return;
    }
  } while (isPositionOccupied(newFood.x, newFood.y));

  specialFood = newFood;

  // Quitar comida especial después de 10 segundos
  setTimeout(() => {
    if (specialFood && specialFood.x === newFood.x && specialFood.y === newFood.y) {
      specialFood = null;
    }
  }, 10000);
}

function isPositionOccupied(x, y) {
  // Verificar serpiente
  for (const segment of snake) {
    if (segment.x === x && segment.y === y) {
      return true;
    }
  }

  // Verificar comida
  for (const f of food) {
    if (f.x === x && f.y === y) {
      return true;
    }
  }

  // Verificar comida especial
  if (specialFood && specialFood.x === x && specialFood.y === y) {
    return true;
  }

  // Verificar obstáculos
  for (const obstacle of obstacles) {
    if (obstacle.x === x && obstacle.y === y) {
      return true;
    }
  }

  return false;
}

function updateScore() {
  document.getElementById('score').textContent = `Puntuación: ${score}`;
  document.getElementById('highScore').textContent = `Récord: ${getHighScore(currentLevel.id)}`;
}

// ==================== ESTADOS DEL JUEGO ====================
function pauseGame() {
  if (gameState === GameState.PLAYING) {
    gameState = GameState.PAUSED;
    clearInterval(gameLoopId);
    document.getElementById('pauseMenu').style.display = 'block';
  }
}

function resumeGame() {
  if (gameState === GameState.PAUSED) {
    gameState = GameState.PLAYING;
    lastUpdateTime = performance.now();
    gameLoopId = setInterval(gameLoop, 16);
    document.getElementById('pauseMenu').style.display = 'none';
  }
}

function restartLevel() {
  if (currentLevel) {
    startLevel(currentLevelIndex);
  }
}

function gameOver() {
  gameState = GameState.GAME_OVER;
  clearInterval(gameLoopId);

  // Guardar high score
  saveHighScore(currentLevel.id, score);

  document.getElementById('gameOverScore').textContent = score;
  document.getElementById('gameOver').style.display = 'block';
  document.getElementById('gameUI').style.display = 'none';
}

function levelComplete() {
  gameState = GameState.LEVEL_COMPLETE;
  clearInterval(gameLoopId);

  // Guardar high score
  saveHighScore(currentLevel.id, score);

  document.getElementById('levelCompleteScore').textContent = score;
  document.getElementById('levelComplete').style.display = 'block';
  document.getElementById('gameUI').style.display = 'none';
}

function nextLevel() {
  if (currentAdventure && currentAdventure.levels.length > currentLevelIndex + 1) {
    currentLevelIndex++;
    startLevel(currentAdventure.levels[currentLevelIndex]);
  } else if (currentAdventure && !currentAdventure.infinite) {
    // Aventura completada
    gameState = GameState.ADVENTURE_COMPLETE;
    document.getElementById('levelComplete').style.display = 'none';
    document.getElementById('adventureComplete').style.display = 'block';
    document.getElementById('adventureCompleteName').textContent = currentAdventure.name;
  } else {
    // Modo infinito - reiniciar nivel
    startLevel(currentLevelIndex);
  }
}

// ==================== CONTROLES ====================
function handleKeyDown(e) {
  switch (e.key) {
    case 'ArrowUp':
      if (direction.y === 0) nextDirection = { x: 0, y: -1 };
      break;
    case 'ArrowDown':
      if (direction.y === 0) nextDirection = { x: 0, y: 1 };
      break;
    case 'ArrowLeft':
      if (direction.x === 0) nextDirection = { x: -1, y: 0 };
      break;
    case 'ArrowRight':
      if (direction.x === 0) nextDirection = { x: 1, y: 0 };
      break;
    case ' ':
      if (gameState === GameState.PLAYING) {
        pauseGame();
      } else if (gameState === GameState.PAUSED) {
        resumeGame();
      }
      break;
    case 'Escape':
      if (gameState === GameState.PLAYING) {
        pauseGame();
      } else if (gameState === GameState.PAUSED) {
        resumeGame();
      } else {
        showMenu();
      }
      break;
  }
}

// ==================== RENDERIZADO ====================
function render() {
  // Limpiar canvas
  ctx.fillStyle = currentLevel ? currentLevel.backgroundColor : CONFIG.colors.background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Dibujar grid
  ctx.strokeStyle = CONFIG.colors.grid;
  ctx.lineWidth = 0.5;

  for (let i = 0; i < CONFIG.gridSize; i++) {
    ctx.beginPath();
    ctx.moveTo(i * CONFIG.cellSize, 0);
    ctx.lineTo(i * CONFIG.cellSize, canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i * CONFIG.cellSize);
    ctx.lineTo(canvas.width, i * CONFIG.cellSize);
    ctx.stroke();
  }

  // Dibujar obstáculos
  ctx.fillStyle = CONFIG.colors.obstacle;
  for (const obstacle of obstacles) {
    ctx.fillRect(
      obstacle.x * CONFIG.cellSize,
      obstacle.y * CONFIG.cellSize,
      CONFIG.cellSize,
      CONFIG.cellSize
    );
  }

  // Dibujar comida
  ctx.fillStyle = CONFIG.colors.food;
  for (const f of food) {
    ctx.beginPath();
    ctx.arc(
      f.x * CONFIG.cellSize + CONFIG.cellSize / 2,
      f.y * CONFIG.cellSize + CONFIG.cellSize / 2,
      CONFIG.cellSize / 2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  // Dibujar comida especial
  if (specialFood) {
    ctx.fillStyle = CONFIG.colors.specialFood;
    ctx.beginPath();
    ctx.arc(
      specialFood.x * CONFIG.cellSize + CONFIG.cellSize / 2,
      specialFood.y * CONFIG.cellSize + CONFIG.cellSize / 2,
      CONFIG.cellSize / 2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Efecto de brillo
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(
      specialFood.x * CONFIG.cellSize + CONFIG.cellSize / 2,
      specialFood.y * CONFIG.cellSize + CONFIG.cellSize / 2,
      CONFIG.cellSize / 2 + 4,
      0,
      Math.PI * 2
    );
    ctx.stroke();
  }

  // Dibujar serpiente
  for (let i = 0; i < snake.length; i++) {
    const segment = snake[i];
    ctx.fillStyle = i === 0 ? CONFIG.colors.snakeHead : CONFIG.colors.snake;

    // Dibujar segmento
    ctx.fillRect(
      segment.x * CONFIG.cellSize,
      segment.y * CONFIG.cellSize,
      CONFIG.cellSize,
      CONFIG.cellSize
    );

    // Dibujar ojos en la cabeza
    if (i === 0) {
      ctx.fillStyle = '#ffffff';
      const eyeSize = CONFIG.cellSize / 6;

      // Posición de los ojos según la dirección
      const eyeOffsetX = direction.x === 1 ? CONFIG.cellSize / 4 :
                        direction.x === -1 ? CONFIG.cellSize * 0.75 :
                        CONFIG.cellSize / 2;
      const eyeOffsetY = direction.y === 1 ? CONFIG.cellSize / 4 :
                        direction.y === -1 ? CONFIG.cellSize * 0.75 :
                        CONFIG.cellSize / 2;

      // Ojo izquierdo
      ctx.fillRect(
        segment.x * CONFIG.cellSize + eyeOffsetX - eyeSize / 2,
        segment.y * CONFIG.cellSize + eyeOffsetY - eyeSize / 2,
        eyeSize,
        eyeSize
      );

      // Ojo derecho
      ctx.fillRect(
        segment.x * CONFIG.cellSize + (CONFIG.cellSize - eyeOffsetX) - eyeSize / 2,
        segment.y * CONFIG.cellSize + eyeOffsetY - eyeSize / 2,
        eyeSize,
        eyeSize
      );
    }
  }
}

// ==================== HIGH SCORES ====================
function loadHighScores() {
  highScores = JSON.parse(localStorage.getItem('gusanitoxmega_highscores')) || {};
}

function saveHighScore(levelId, score