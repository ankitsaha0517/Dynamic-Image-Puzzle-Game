const container = document.getElementById("puzzle-container");
const startBtn = document.getElementById("startBtn");
const moveCountDisplay = document.getElementById("moveCount");
const buttons = document.querySelectorAll(".difficulty button");
const reset = document.getElementById("resetBtn");
reset.disabled = true;
reset.classList.add("pushed");
const difficultyLevel = document.getElementById("difficulty-level");
let loadImgBtn = document.getElementById("loadImageBtn");
let newImgURI = document.getElementById("imageUrl");
const timerDisplay = document.getElementById("timer");

const messageBox = document.getElementById("message");
const userBox = document.querySelector(".user-input");

let timerInterval;
let timeRemaining = 1;
let timeLimit = 60;

let imageUrl =
  "https://i.pinimg.com/736x/39/86/91/398691f123726a5763e9c47980964fff.jpg";
let gridSize = 4;

let tiles = [];
let moveCount = 0;
let draggedTile = null;



//create tiles
function createTiles() {

  container.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
  container.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

  tiles = [];

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const index = row * gridSize + col;
      const tile = document.createElement("div");
      tile.className = "tile";
      tile.draggable = true;

      tile.style.width = `100%`;
      tile.style.height = `100%`;

      tile.style.backgroundImage = `url(${imageUrl})`;
      tile.style.backgroundSize = `${gridSize * 100}% ${gridSize * 100}%`;
      tile.style.backgroundPosition = `${(col * 100) / (gridSize - 1)}% ${(row * 100) / (gridSize - 1)}%`;

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
          messageBox.innerText = "🎉 Congratulation 🎉";
          messageBox.style.display = "flex";
        }, 1000);
        let Overlay = document.getElementById("overlay");
        Overlay.style.display = "block";
        userBox.style.filter = "brightness(0.5)";
        party();
        play();
        stopTimer();
        resetGame();
        setTimeout(() => {
          hideMesBox()
        }, 6000);
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
    let Overlay = document.getElementById("overlay");
    Overlay.style.display = "none";
    reset.disabled = false;
    reset.classList.remove("pushed");
    createTiles();
    renderTiles();
    shuffle(tiles);
    tiles.forEach(addDragListeners);
    renderTiles();
    moveCount = 0;
    moveCountDisplay.textContent = moveCount;
    push();
    startTimer(timeLimit);
    userBox.style.filter = "brightness(1)";
  });
}
startGame();
// Load the image and create tiles
const img = new Image();
img.src = imageUrl;
img.onload = () => {
  createTiles();
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

      createTiles();
      renderTiles();

      moveCount = 0;
      moveCountDisplay.textContent = moveCount;
    });
  });
}

//reset game
function resetGame() {
  reset.addEventListener("click", () => {
    let Overlay = document.getElementById("overlay");
    buttons.forEach((btn) => btn.classList.remove("active"));
    gridSize = 4;
    buttons[0].classList.add("active");
    createTiles();
    renderTiles();
    moveCount = 0;
    moveCountDisplay.textContent = moveCount;
    play();
    restartTimer();
    Overlay.style.display = "none";
    reset.disabled = true;
    reset.classList.add("pushed");
    userBox.style.filter = "brightness(1)";
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
      createTiles();
      renderTiles();
      moveCount = 0;
      moveCountDisplay.textContent = moveCount;
      newImgURI.value = "";
    };
  });
}

function push() {
  startBtn.classList.add("pushed");
  startBtn.disabled = true;
  loadImgBtn.classList.add("pushed");
  loadImgBtn.disabled = true;
  newImgURI.style.pointerEvents = "none";
  newImgURI.classList.add("pushed");

  buttons.forEach((btn) => {
    btn.style.pointerEvents = "none";
    btn.classList.add("pushed");
  });
}
function play() {
  startBtn.disabled = false;
  loadImgBtn.disabled = false;
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
  messageBox.innerText = "Time Up ⏰ Try again";
  messageBox.style.display = "flex";
  userBox.style.filter = "brightness(0.5)";

  setTimeout(() => {
    hideMesBox();
  }, 3000);
}

function restartTimer() {
  stopTimer(); // Stop the countdown if it's running
  timeRemaining = 0;
  updateTimerDisplay(); // Show 00:00
}
function party() {
  var count = 200;
  var defaults = {
    origin: { y: 0.7 },
  };

  function fire(particleRatio, opts) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });
  fire(0.2, {
    spread: 60,
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
  var duration = 3 * 1000;
  var animationEnd = Date.now() + duration;
  var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  var interval = setInterval(function () {
    var timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    var particleCount = 50 * (timeLeft / duration);
    // since particles fall down, start a bit higher than random
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
    });
  }, 250);

  var end = Date.now() + 3 * 1000;

  // go Buckeyes!
  var colors = ["#bb0000", "#ffffff"];

  (function frame() {
    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: colors,
    });
    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: colors,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

function hideMesBox() {
  messageBox.style.display = "none";
  userBox.style.filter = "brightness(1)";
}

loadImg();
difficultyBtn();
resetGame();
