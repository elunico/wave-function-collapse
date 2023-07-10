let spritefile;
let sprites = [];

// const LEFT = 1, TOP = 2, RIGHT = 4, BOTTOM = 8;
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

class Sprite {
  constructor(image, filename) {
    this.image = image;
    this.filename = filename;
    this.positions = { 1: false, 2: false, 4: false, 8: false };
  }

  acceptsTop() { this.positions[TOP] = true; return this; }
  acceptsBottom() { this.positions[BOTTOM] = true; return this; }
  acceptsLeft() { this.positions[LEFT] = true; return this; }
  acceptsRight() { this.positions[RIGHT] = true; return this; }

  acceptsPosition(position) {
    position = Number(position);
    console.log(position);
    switch (position) {
      case TOP: this.acceptsTop(); break;
      case BOTTOM: this.acceptsBottom(); break;
      case LEFT: this.acceptsLeft(); break;
      case RIGHT: this.acceptsRight(); break;
    }
  }

  canConnect(otherSprite, position) {
    if (position === undefined) {
      throw new TypeError("Must connect with position");
    }
    return (this.positions[position] && otherSprite.positions[inversePosition(position)]) || (!this.positions[position] && !otherSprite.positions[inversePosition(position)]);
  }
}

class Cell {
  constructor(row, col) {
    this.row = row;
    this.col = col;
    this.sprite = -1;
  }
}

class Board {
  constructor(resolution) {
    this.resolution = resolution;
    this.columns = width / resolution;
    this.rows = height / resolution;
    this.grid = []; //Array(this.columns).fill(Array(this.rows).fill(new Cell()));
    for (let i = 0; i < this.columns; i++) {
      this.grid[i] = [];
      for (let j = 0; j < this.rows; j++) {
        this.grid[i][j] = (new Cell(j, i));
      }
    }
    this.started = false;
    this.cache = {};
    this.dirty = true;
  }

  static key(i, j) {
    let s = i <= 9 ? `0${i}` : `${i}`;
    let r = j <= 9 ? `0${j}` : `${j}`;

    return `(${s}, ${r})`;
  }

  next(i, j) {
    let options = [...sprites];

    // Look up, down, left, and right to find filled in tiles
    // eliminate tiles that do not match their neighbors
    if (i > 0 && this.grid[i - 1][j].sprite != -1) {
      for (let n = options.length - 1; n >= 0; n--) {
        if (!options[n].canConnect(this.grid[i - 1][j].sprite, LEFT)) {
          options.splice(n, 1);
        }
      }
    }
    if (i < this.columns - 1 && this.grid[i + 1][j].sprite != -1) {
      for (let n = options.length - 1; n >= 0; n--) {
        if (!options[n].canConnect(this.grid[i + 1][j].sprite, RIGHT)) {
          options.splice(n, 1);
        }
      }
    }
    if (j > 0 && this.grid[i][j - 1].sprite != -1) {
      for (let n = options.length - 1; n >= 0; n--) {
        if (!options[n].canConnect(this.grid[i][j - 1].sprite, TOP)) {
          options.splice(n, 1);
        }
      }
    }
    if (j < this.rows - 1 && this.grid[i][j + 1].sprite != -1) {
      for (let n = options.length - 1; n >= 0; n--) {
        if (!options[n].canConnect(this.grid[i][j + 1].sprite, BOTTOM)) {
          options.splice(n, 1);
        }
      }
    }

    this.cache[Board.key(i, j)] = { count: options.length, i, j, cell: this.grid[i][j] };
    return { sprite: random(options), count: options.length, done: false };
  }

  leastEntropy() {
    this.precomputeEntropy();
    this.dirty = false;
    let leastCount = Infinity;
    let least;
    for (let obj of Object.values(this.cache)) {
      if (obj.count < leastCount && this.grid[obj.i][obj.j].sprite == -1) {
        least = obj.cell;
        leastCount = obj.count;
      }
    }
    return least;
  }

  precomputeEntropy() {
    // TODO: while many cells need recomputation cells next to empty cells do
    // not have their entropy change and there may be the opportunity for
    // optimization instead of recalculating the board each frame
    for (let i = 0; i < this.columns; i++) {
      for (let j = 0; j < this.rows; j++) {
        this.next(i, j);
      }
    }
  }


}

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

let redraw = false;

function setup() {
  createCanvas(800, 600);
  board = new Board(25);

  withStroke = createCheckbox('Outlines?');
  debugging = createCheckbox('Debug?');
  // COMMENT OUT FOR MORE RANDOMNESS
  // board.grid[0][0].sprite = sprites[0];
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




  let nextCandidate = board.leastEntropy();
  if (nextCandidate) {
    let { sprite } = board.next(nextCandidate.col, nextCandidate.row);
    board.grid[nextCandidate.col][nextCandidate.row].sprite = sprite;
  }
}
