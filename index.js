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
let board;
let withStroke;
let debugging;

function preload() {
  Sprite.loadSprites('advanced-maze', sprites);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  board = new Board(50);

  withStroke = createCheckbox('Outlines?');
  debugging = createCheckbox('Debug?');
  // debugging.checked(true);
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
            rect(xoff + x - board.resolution / 2, yoff + y - board.resolution - br, board.resolution * 2, board.resolution);
            fill(0);
            stroke(255);
            text(cell.sprite.filename, xoff + x + board.resolution / 2, yoff + y - board.resolution - br / 2);
            text(`${i}, ${j}`, xoff + x + br, yoff + y - board.resolution + br / 2);

            if (cell.sprite.positions[TOP]) {
              text(TOP, x + br, y);
              text(cell.sprite.positions[TOP], x + br, y + offset);
            }
            if (cell.sprite.positions[BOTTOM]) {
              text(BOTTOM, x + br, y + br * 2);
              text(cell.sprite.positions[BOTTOM], x + br, y + br * 2 - offset);
            }
            if (cell.sprite.positions[LEFT]) {
              text(LEFT, x, y + br);
              text(cell.sprite.positions[LEFT], x, y + br + offset);
            }
            if (cell.sprite.positions[RIGHT]) {
              text(RIGHT, x + br * 2, y + br);
              text(cell.sprite.positions[RIGHT], x + br * 2, y + br + offset);
            }
            if (cell.sprite.userData.rotation) {
              text(cell.sprite.userData.rotation, x + br, y + br + offset);
            }
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

  for (let i = 0; i < floor(map(mouseX, 0, width, 1, 20)); i++)  board.step();
}
