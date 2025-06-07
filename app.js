const container = document.getElementById("puzzle-container");
const startBtn = document.getElementById("startBtn");
const moveCountDisplay = document.getElementById("moveCount");
const buttons = document.querySelectorAll(".difficulty button");
const reset = document.getElementById("resetBtn");
const difficultyLevel = document.getElementById("difficulty-level");

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
startBtn.addEventListener("click", () => {
  shuffle(tiles);
  tiles.forEach(addDragListeners);
  renderTiles();
  moveCount = 0;
  moveCountDisplay.textContent = moveCount;
});



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
        difficultyLevel.innerHTML = button.innerHTML;
        console.log(button.innerHTML);
      } else if (button.innerHTML === "MEDIUM") {
        gridSize = 6;
        difficultyLevel.innerHTML = button.innerHTML;
      } else {
        gridSize = 8;
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
    buttons.forEach((button) => {
      buttons.forEach((btn) => btn.classList.remove("active"));
    });
    createTiles(32, 32);
    renderTiles();

    moveCount = 0;
    moveCountDisplay.textContent = moveCount;
  });
}

function loadImg() {
  let loadImgBtn = document.getElementById("loadImageBtn");
  let newImgURI = document.getElementById("imageUrl");
  loadImgBtn.addEventListener("click", () => {
    imageUrl = newImgURI.value;
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      createTiles(32, 32);
      renderTiles();
      
      moveCount = 0;
      moveCountDisplay.textContent = moveCount;
      newImgURI.value = ""
    };
  });
}

loadImg();
difficultyBtn();
resetGame();
