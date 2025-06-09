const container = document.getElementById("puzzle-container");
const startBtn = document.getElementById("startBtn");
const moveCountDisplay = document.getElementById("moveCount");
const buttons = document.querySelectorAll(".difficulty button");
const reset = document.getElementById("resetBtn");
const difficultyLevel = document.getElementById("difficulty-level");
let loadImgBtn = document.getElementById("loadImageBtn");
let newImgURI = document.getElementById("imageUrl");

const timerDisplay = document.getElementById("timer");
let timerInterval;
let timeRemaining = 1;
let timeLimit = 60;

let imageUrl =
  "https://i.pinimg.com/736x/39/86/91/398691f123726a5763e9c47980964fff.jpg";
let gridSize = 4;

let tiles = [];
let moveCount = 0;
let draggedTile = null;
let tileWidth, tileHeight;

function createTiles(imageWidth, imageHeight) {
  tileWidth = Math.floor(imageWidth / gridSize);
  tileHeight = Math.floor(imageHeight / gridSize);

  container.style.gridTemplateColumns = `repeat(${gridSize}, ${tileWidth}vw)`;
  container.style.gridTemplateRows = `repeat(${gridSize}, ${tileHeight}vw)`;

  tiles = [];

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const index = row * gridSize + col;
      const tile = document.createElement("div");
      tile.className = "tile";
      tile.draggable = true;
      tile.style.width = `${tileWidth}vw`;
      tile.style.height = `${tileHeight}vw`;
      tile.style.backgroundImage = `url(${imageUrl})`;
      tile.style.backgroundSize = `${imageWidth}vw ${imageHeight}vw`;
      tile.style.backgroundPosition = `-${col * tileWidth}vw -${
        row * tileHeight
      }vw`;
      tile.dataset.originalIndex = index;
      tile.style.cursor = "grab";
      tiles.push(tile);
    }
  }
}

//drag fnc
function addDragListeners(tile) {
  tile.addEventListener("dragstart", () => {
    draggedTile = tile;
  });

  tile.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  tile.addEventListener("drop", () => {
    if (draggedTile && draggedTile !== tile) {
      const fromIndex = tiles.indexOf(draggedTile);
      const toIndex = tiles.indexOf(tile);
      [tiles[fromIndex], tiles[toIndex]] = [tiles[toIndex], tiles[fromIndex]];
      renderTiles();
      moveCount++;
      moveCountDisplay.textContent = moveCount;

      if (isPuzzleSolved()) {
        setTimeout(() => {
          alert("🎉 Congratulations! Puzzle Solved!");
        }, 100);
        play();
        stopTimer();
      }
    }
  });
}

//render the tiles in the container
function renderTiles() {
  container.innerHTML = "";
  tiles.forEach((tile) => container.appendChild(tile));
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Check if the puzzle is solved
function isPuzzleSolved() {
  return tiles.every(
    (tile, index) => Number(tile.dataset.originalIndex) === index
  );
}

// Start button event listener
function startGame() {
  startBtn.addEventListener("click", () => {
    shuffle(tiles);
    tiles.forEach(addDragListeners);
    renderTiles();
    moveCount = 0;
    moveCountDisplay.textContent = moveCount;
    push();
    startTimer(timeLimit);
  });
}
startGame();
// Load the image and create tiles
const img = new Image();
img.src = imageUrl;
img.onload = () => {
  createTiles(32, 32);
  renderTiles();
};

//diffculty btn
function difficultyBtn() {
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      if (button.innerHTML === "EASY") {
        gridSize = 4;

        timeLimit = 60; // 1 min
        difficultyLevel.innerHTML = button.innerHTML;
        console.log(button.innerHTML);
      } else if (button.innerHTML === "MEDIUM") {
        gridSize = 6;
        timeLimit = 120;
        difficultyLevel.innerHTML = button.innerHTML;
      } else {
        gridSize = 8;
        timeLimit = 180;
        difficultyLevel.innerHTML = button.innerHTML;
      }

      createTiles(32, 32);
      renderTiles();

      moveCount = 0;
      moveCountDisplay.textContent = moveCount;
    });
  });
}

//reset game
function resetGame() {
  reset.addEventListener("click", () => {
    // buttons.forEach((button) => {
    buttons.forEach((btn) => btn.classList.remove("active"));
    // });
    gridSize = 4;
    buttons[0].classList.add("active");
    createTiles(32, 32);
    renderTiles();

    moveCount = 0;
    moveCountDisplay.textContent = moveCount;
    play();
    restartTimer()
  });
}

function loadImg() {
  loadImgBtn.addEventListener("click", () => {
    imageUrl = newImgURI.value;
    if (!imageUrl) {
      return;
    }
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      createTiles(32, 32);
      renderTiles();
      moveCount = 0;
      moveCountDisplay.textContent = moveCount;
      newImgURI.value = "";
    };
  });
}

function push() {
  startBtn.classList.add("pushed");
  loadImgBtn.classList.add("pushed");
  newImgURI.style.pointerEvents = "none";
  newImgURI.classList.add("pushed");

  buttons.forEach((btn) => {
    btn.style.pointerEvents = "none";
    btn.classList.add("pushed");
  });
}
function play() {
  startBtn.style.pointerEvents = "all";
  loadImgBtn.style.pointerEvents = "all";
  newImgURI.style.pointerEvents = "all";
  startBtn.classList.remove("pushed");
  loadImgBtn.classList.remove("pushed");
  newImgURI.classList.remove("pushed");

  buttons.forEach((btn) => {
    btn.style.pointerEvents = "all";
    btn.classList.remove("pushed");
  });
}

function startTimer(limitInSeconds) {
  clearInterval(timerInterval);
  timeRemaining = limitInSeconds;
  updateTimerDisplay();

  timerInterval = setInterval(() => {
    timeRemaining--;
    updateTimerDisplay();

    if (timeRemaining <= 0) {
      onTimeUp();
      clearInterval(timerInterval);
    }
  }, 1000);

  if (timeRemaining <= 0) {
  }
}

function stopTimer() {
  clearInterval(timerInterval);
}

function updateTimerDisplay() {
  const minutes = String(Math.floor(timeRemaining / 60)).padStart(2, "0");
  const seconds = String(timeRemaining % 60).padStart(2, "0");
  timerDisplay.textContent = `${minutes}:${seconds}`;
}

function onTimeUp() {
  let Overlay = document.getElementById("overlay");
  Overlay.style.display = "block";
}
function restartTimer() {
  stopTimer(); // Stop the countdown if it's running
  timeRemaining = 0;
  updateTimerDisplay(); // Show 00:00
}
loadImg();
difficultyBtn();
resetGame();
