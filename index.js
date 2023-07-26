const TOP = 1, RIGHT = 2, BOTTOM = 4, LEFT = 8;

function inversePosition(position) {
  switch (position) {
    case LEFT:
      return RIGHT;
    case TOP:
      return BOTTOM;
    case BOTTOM:
      return TOP;
    case RIGHT:
      return LEFT;
  }
}

let sprites = [];
let broken = false;
let board;
let withStroke;
let debugging;

function keyPressed() {
  if (key == 's') {
    const size = prompt("Enter size of board between 10 and 150");
    const amount = Number(size);
    board = new Board(isNaN(amount) ? 50 : constrain(amount, 10, 150));
  }
}

function preload() {
  Sprite.loadSprites('advanced-maze', sprites);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  board = new Board(50);

  withStroke = createCheckbox('Outlines?');
  debugging = createCheckbox('Debug?');
  if (window.location.host.includes('localhost') || window.location.host.includes('127.0.0.1')) {
    debugging.checked(true);
  }
}

function draw() {
  background(51);
  // for (let i = 0; i < sprites.length; i++) {
  //   stroke(0);
  //   // rect(0, i * 26, sprites[i].image.width, sprites[i].height);
  //   image(sprites[i].image, 0, sprites[i].image.height * i);
  // }

  for (let i = 0; i < board.columns; i++) {
    for (let j = 0; j < board.rows; j++) {
      let cell = board.grid[i][j];
      if (cell.sprite != -1 && cell.sprite) {
        if (withStroke.checked()) {
          stroke(0);
        } else {
          noStroke();
        }
        rect(i * board.resolution, j * board.resolution, board.resolution, board.resolution);
        image(cell.sprite.image, i * board.resolution, j * board.resolution, board.resolution, board.resolution);
      }
    }
  }

  if (debugging.checked()) {
    textSize(18);
    for (let i = 0; i < board.columns; i++) {
      for (let j = 0; j < board.rows; j++) {
        let cell = board.grid[i][j];
        let x = i * board.resolution;
        let y = j * board.resolution;
        let rcount = 0;
        if (board.cache[Board.key(i, j)]) {
          if (board.cache[Board.key(i, j)] && board.cache[Board.key(i, j)].count == 0) {
            debugging.checked(true);
            broken = true; 
            fill(255, 0, 0, 150);
            noStroke();
            rect(x, y, board.resolution, board.resolution);
          } else {
            rcount = board.cache[Board.key(i, j)].count;
          }
        }
        if (cell.sprite != -1 && cell.sprite) {
          if (mouseX > x && mouseX < x + board.resolution && mouseY > y && mouseY < y + board.resolution) {
            let xoff = 0, yoff = 0;
            if (floor(mouseX / board.resolution) >= (board.columns - 1)) {
              xoff = -2 * board.resolution / 3;
            }
            if (mouseX < board.resolution) {
              xoff = 2 * board.resolution / 3;
            }
            if (mouseY < board.resolution * 2) {
              yoff = board.resolution * 3;
            }
            fill(255, 150);
            rect(x, y, board.resolution, board.resolution);
            let br = board.resolution / 2;
            const offset = 15;
            textAlign(CENTER, CENTER);
            fill(255, 220, 200);
            stroke(0);
            let minBoxSize = 60;
            let boxedX, boxedY;
            if (board.resolution < minBoxSize / 2) {
              boxedX = x - minBoxSize;
              boxedY = y - 75;

            } else {
              boxedX = xoff + x - max(board.resolution, minBoxSize);
              boxedY = yoff + y - max(board.resolution, minBoxSize) - 15;
            }
            rect(boxedX + br, boxedY, max(board.resolution, minBoxSize) * 2, max(board.resolution, minBoxSize));
            fill(0);
            stroke(255);
            text(cell.sprite.filename, br + boxedX + max(board.resolution, minBoxSize), boxedY + max(board.resolution, minBoxSize) / 3);
            text(`${i}, ${j}`, br + boxedX + max(board.resolution, minBoxSize), boxedY + 2 * max(board.resolution, minBoxSize) / 3);

            if (cell.sprite.positions[TOP]) {
              text(TOP, x + br - offset / 2, y + 5);
              text(cell.sprite.positions[TOP], x + br + offset / 2, y + 5);
            }
            if (cell.sprite.positions[BOTTOM]) {
              text(BOTTOM, x + br - offset / 2, y + br * 2 - 5);
              text(cell.sprite.positions[BOTTOM], x + br + offset / 2, y + br * 2 - 5);
            }
            if (cell.sprite.positions[LEFT]) {
              text(LEFT, x + 5, y + br - offset / 2);
              text(cell.sprite.positions[LEFT], x + 5, y + br + offset / 2);
            }
            if (cell.sprite.positions[RIGHT]) {
              text(RIGHT, x + br * 2 - 5, y + br - offset / 2);
              text(cell.sprite.positions[RIGHT], x + br * 2 - 5, y + br + offset / 2);
            }
            // if (cell.sprite.userData.rotation) {
            // text(xoff + cell.sprite.userData.rotation, x - board.resolution / 2, yoff + y - board.resolution - br,);
            // }
          }
        } else {
          let x = i * board.resolution;
          let y = j * board.resolution;
          if (mouseX > x && mouseX < x + board.resolution && mouseY > y && mouseY < y + board.resolution) {
            fill(255, 100);
            rect(x, y, board.resolution, board.resolution);
            fill(0);
            stroke(255);
            let br = board.resolution / 2;
            textAlign(CENTER, CENTER);
            text(`${i}, ${j}`, x + br, y + br);
            text(`${rcount}`, x + br, y + br + 15);
          }
        }
      }
    }
  }

  for (let i = 0; i < floor(map(mouseX, 0, width, 1, 20)) && !broken; i++)  board.step();
}
