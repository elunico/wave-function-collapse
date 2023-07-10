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
  loadSprites('maze');
}

function loadSprites(name) {
  let path = `sprites/${name}`;
  loadJSON(`${path}/schema.json`, schema => {
    console.log(schema);
    for (let key of Object.keys(schema.images)) {
      let connections = schema.images[key]['connects_on'];
      let image = loadImage(`${path}/${key}`);
      let s = new Sprite(image, key);
      for (let pos of connections) {
        s.acceptsPosition(pos);
      }
      sprites.push(s);
    }
    console.log("Done");
  });
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  board = new Board(25);

  withStroke = createCheckbox('Outlines?');
  debugging = createCheckbox('Debug?');
}

function draw() {
  background(0);

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
    for (let i = 0; i < board.columns; i++) {
      for (let j = 0; j < board.rows; j++) {
        let cell = board.grid[i][j];
        if (cell.sprite != -1 && cell.sprite) {
          let x = i * board.resolution;
          let y = j * board.resolution;
          if (mouseX > x && mouseX < x + board.resolution && mouseY > y && mouseY < y + board.resolution) {
            let br = board.resolution / 2;
            textAlign(CENTER, CENTER);
            // circle(x + br, y + br, br);
            noStroke();
            text(cell.sprite.filename, x + br, y + br);
            if (cell.sprite.positions[TOP]) {
              text(TOP, x + br, y);
            }
            if (cell.sprite.positions[BOTTOM]) {
              text(BOTTOM, x + br, y + br * 2);
            }
            if (cell.sprite.positions[LEFT]) {
              text(LEFT, x, y + br);
            }
            if (cell.sprite.positions[RIGHT]) {
              text(RIGHT, x + br * 2, y + br);
            }
          }
        }
      }
    }
  }

  for (let i = 0; i < floor(map(mouseX, 0, width, 1, 20)); i++)  board.step();
}
