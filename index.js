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
  Sprite.loadSprites('advanced-maze');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  board = new Board(40);

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
        if (cell.sprite != -1 && cell.sprite) {
          let x = i * board.resolution;
          let y = j * board.resolution;
          if (mouseX > x && mouseX < x + board.resolution && mouseY > y && mouseY < y + board.resolution) {
            fill(255, 100);
            rect(x, y, board.resolution, board.resolution);
            fill(0);
            stroke(255);
            let br = board.resolution / 2;
            textAlign(CENTER, CENTER);
            // circle(x + br, y + br, br);
            text(cell.sprite.filename, x + br, y + br - 15);
            if (cell.sprite.positions[TOP]) {
              text(TOP, x + br, y);
              text(cell.sprite.positions[TOP], x + br, y + 15);
            }
            if (cell.sprite.positions[BOTTOM]) {
              text(BOTTOM, x + br, y + br * 2);
              text(cell.sprite.positions[BOTTOM], x + br, y + br * 2 - 15);

            }
            if (cell.sprite.positions[LEFT]) {
              text(LEFT, x, y + br);
              text(cell.sprite.positions[LEFT], x, y + br + 15);
            }
            if (cell.sprite.positions[RIGHT]) {
              text(RIGHT, x + br * 2, y + br);
              text(cell.sprite.positions[RIGHT], x + br * 2, y + br + 15);
            }
            if (cell.sprite.userData.rotation) {
              text(cell.sprite.userData.rotation, x + br, y + br + 15);
            }
          }
        }
      }
    }
  }

  for (let i = 0; i < floor(map(mouseX, 0, width, 1, 20)); i++)  board.step();
}
