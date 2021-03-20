let grid, colorPallete, offsetX, offsetY, moved, gameover, lock;
let size = 30, gap = 2;
let gridBorder = 2 * gap;
let piecePos, pieceInGame, count, lvl = 1, speed;
let score = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(60);
  textAlign(CENTER, CENTER);
  background(0);
  noStroke();

  speed = 30;
  count = lvl;
  lock = false;

  gameover = false;
  offsetX = width / 2 - 5.5 * (size);
  offsetY = height / 2 - 9 * (size);
  grid = [[]];
  colorPallete = ["black", "turquoise", "chartreuse", "deeppink", "mediumslateblue", "coral", "yellow", "white"];

  piecePos = [0, 0];

  for (let x = 0; x < 6; x++) {
    grid[x] = [];
    for (let y = 0; y < 15; y++) {
      grid[x][y] = 0;
    }
  }

  drawGUI();
  drawTouchControls();
}

function draw() {
  // noLoop();
  if (!gameover) {
    drawGrid();
    moved = false;
    if (count == 0) {
      gravitate();
      if (!moved) {
        lock = true;
        let match = getMatches();
        if (match.length > 0) {
          score += match.length * (100 + (2 * lvl));
          for (let i = 0; i < match.length; i++) {
            setGridPos(match[i], 0);
          }
          drawGUI();
        } else {
          checkGameOver();
          addPiece();
          lock = false
        }
      }
      count = speed;
    } else {
      count--;
    }
  } else {
    fill("red");
    square(0, 0, 100, 5);
    noLoop();
  }
}

function drawGrid() {
  fill(30);
  rect(offsetX - gridBorder, offsetY - gridBorder, 6 * (size + gap) + gridBorder * 2 - gap,
    13 * (size + gap) + gridBorder * 2 - gap, 5);
  for (let x = 0; x < 6; x++) {
    for (let y = 0; y < 13; y++) {
      fill(colorPallete[(grid[x][12 - y])]);
      square((size + gap) * x + offsetX, (size + gap) * y + offsetY, size, 5);
      // fill("white");
      // text(x + " " + (12 - y), (size + gap) * x + offsetX, (size + gap) * y + offsetY, size, size)
    }
  }

}
function drawGUI() {
  fill(30);
  rect(offsetX + 6 * (gap + size) + gridBorder + gap, offsetY - gridBorder, 4 * (size + gap) + gridBorder * 2 - gridBorder- 2*gap,
    6 * (size + gap) + gridBorder * 2 - gap, 5);
  fill(0);
  rect(offsetX + 6 * (gap + size) + 2*gridBorder + gap, offsetY - gridBorder + gridBorder, 4 * (size + gap) - gridBorder - 2*gap,
    6 * (size + gap) - gap, 5);
  fill(60);
  textAlign(LEFT);
  text("Score: " + score, offsetX + 7 * (gap + size) + 2 * gridBorder, offsetY + gridBorder, 3 * (gap + size), (size + gap));
}
function gravitate() {
  for (let x = 0; x < 6; x++) {
    for (let y = 1; y < 15; y++) {
      if (grid[x][y] != 0) {
        if (grid[x][y - 1] == 0) {
          grid[x][y - 1] = grid[x][y]
          grid[x][y] = 0;
          moved = true
        }
      }
    }
  }
  if (moved && pieceInGame) {
    piecePos = [piecePos[0], piecePos[1] - 1]
  }
}
function addPiece() {
  if (grid[3][12] == 0) {
    pieceInGame = true
    grid[3][14] = floor(random(1, 7));
    grid[3][13] = floor(random(1, 7));
    grid[3][12] = floor(random(1, 7));
    piecePos = [3, 12];
  } else {
    gameover = true
  }
}
function checkGameOver() {
  for (let i = 13; i < 15; i++) {
    for (let j = 0; j < 0; j++) {
      if (grid[i][j] != 0) {
        gameover = true;
        return;
      }
    }
  }
}
function keyPressed() {
  let x = piecePos[0], y = piecePos[1];
  if (!lock) {
    if (keyCode === LEFT_ARROW && (x - 1 >= 0)) {
      if (grid[x - 1][y] == 0) {
        grid[x - 1][y] = grid[x][y];
        grid[x - 1][y + 1] = grid[x][y + 1];
        grid[x - 1][y + 2] = grid[x][y + 2];

        grid[x][y] = 0;
        grid[x][y + 1] = 0;
        grid[x][y + 2] = 0;

        piecePos = [piecePos[0] - 1, piecePos[1]];
      }

    } else if (keyCode === RIGHT_ARROW && (x + 1 < 6)) {
      if (grid[x + 1][y] == 0) {
        grid[x + 1][y] = grid[x][y];
        grid[x + 1][y + 1] = grid[x][y + 1];
        grid[x + 1][y + 2] = grid[x][y + 2];

        grid[x][y] = 0;
        grid[x][y + 1] = 0;
        grid[x][y + 2] = 0;

        piecePos = [piecePos[0] + 1, piecePos[1]];
      }
    } else if (keyCode === DOWN_ARROW && (y - 1 >= 0)) {
      if (grid[x][y - 1] == 0) {
        grid[x][y - 1] = grid[x][y];
        grid[x][y] = grid[x][y + 1];
        grid[x][y + 1] = grid[x][y + 2];

        grid[x][y + 2] = 0;

        piecePos = [piecePos[0], piecePos[1] - 1];
      }

    } else if (keyCode === 32 || keyCode === 38) {
      if (pieceInGame) {
        aux = grid[x][y]
        grid[x][y] = grid[x][y + 1];
        grid[x][y + 1] = grid[x][y + 2];
        grid[x][y + 2] = aux;
      }
    } else if (keyCode === ESCAPE) {
      noLoop();
    } else if (keyCode === ENTER) {
      loop();
    }
  }
}
function getMatches() {
  let matches = [];
  for (let x = 0; x < 6; x++) {
    for (let y = 0; y < 15; y++) {
      matches = matches.concat(getMatchesPos([x, y]));
    }
  }
  // print(matches);

  let stringArray = matches.map(JSON.stringify);
  let uniqueStringArray = new Set(stringArray);
  matches = Array.from(uniqueStringArray, JSON.parse);

  return matches;
}
function getMatchesPos(pos) {
  let val = getGridPos(pos);
  let matches = [];
  for (let i = 2; i < 6; i++) {
    if (val == getGridPos(nextPos(pos, i)) && val != 0) {
      let m = getMatchesDir(nextPos(pos, i), i);
      if (m.length > 1)
        matches = matches.concat(m);
    }
  }

  if (matches.length >= 2) {
    matches = [pos].concat(matches);
    return matches;
  } else {
    return [];
  }

}
function nextPos(pos, dir) {
  let result;
  let x = pos[0], y = pos[1];
  switch (dir) {
    // case 1:
    //   result = [x - 1, y];
    //   break;
    case 2:
      result = [x - 1, y + 1];
      break;
    case 3:
      result = [x, y + 1];
      break;
    case 4:
      result = [x + 1, y + 1];
      break;
    case 5:
      result = [x + 1, y];
      break;
  }
  return result
}
function getMatchesDir(pos, dir) {
  if (getGridPos(pos) == getGridPos(nextPos(pos, dir))) {
    return [pos].concat(getMatchesDir(nextPos(pos, dir), dir));
  } else {
    return [pos];
  }
}
function getGridPos(pos) {
  let x = pos[0], y = pos[1];
  if (x > 5 || y > 14 || x < 0 || y < 0) {
    return 0;
  } else {
    return grid[x][y];
  }
}
function setGridPos(pos, value) {
  let x = pos[0], y = pos[1];
  grid[x][y] = value;
}
function drawTouchControls() {
  fill(30);
  rect(offsetX - gridBorder, offsetY + 13 * (gap + size) + gridBorder + gap, 5 * (size + gap) + gridBorder - gap,
    3 * (size + gap) + gridBorder * 2 - gap, 5);
  rect(offsetX + 5 * (gap + size), offsetY + 13 * (gap + size) + gridBorder + gap, 5 * (size + gap) + gridBorder * 2 - gap,
    3 * (size + gap) + gridBorder * 2 - gap, 5);

  fill(0);
  rect(offsetX, offsetY + 13 * (gap + size) + 2 * gridBorder + gap, 5 * (size + gap) - gridBorder - gap,
    3 * (size + gap) - gap, 5);
  rect(offsetX + 5 * (gap + size) + gridBorder, offsetY + 13 * (gap + size) + 2 * gridBorder + gap, 5 * (size + gap) - gridBorder + gap,
    3 * (size + gap) - gap, 5);

  fill(30);
  textSize(size * 3);
  textAlign(CENTER);
  text("<", offsetX, offsetY + 13 * (gap + size)+ gridBorder + gap, 5.5 * (size + gap),
    3 * (size + gap));
  text(">", offsetX + 5 * (gap + size) + gridBorder, offsetY + 13 * (gap + size)+ gridBorder + gap, 5.5 * (size + gap),
    3 * (size + gap));

  // ⭯
}