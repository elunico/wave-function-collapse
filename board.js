
class Board {
  constructor(resolution) {
    this.resolution = resolution;
    this.columns = floor(width / resolution);
    this.rows = floor(height / resolution);
    this.grid = [];
    for (let i = 0; i < this.columns; i++) {
      this.grid[i] = [];
      for (let j = 0; j < this.rows; j++) {
        this.grid[i][j] = (new Cell(j, i));
      }
    }
    this.cache = {};
    this.dirty = true;
  }

  static key(i, j) {
    let s = i <= 9 ? `0${i}` : `${i}`;
    let r = j <= 9 ? `0${j}` : `${j}`;

    return `(${s}, ${r})`;
  }

  _gatherOptions(i, j) {
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
    return { options, count: options.length };
  }

  computeEntropy(i, j) {
    let { count } = this._gatherOptions(i, j);
    this.cache[Board.key(i, j)] = { count: count, i, j, cell: this.grid[i][j] };
    return count;
  }

  superpositionAt(i, j) {
    return this._gatherOptions(i, j).options;
  }

  leastEntropy() {
    this.precomputeEntropy();
    let leastCount = Infinity;
    let leasts = [];
    for (let obj of Object.values(this.cache)) {
      if (obj.count < leastCount && this.grid[obj.i][obj.j].sprite == -1) {
        leasts = [obj.cell];
        leastCount = obj.count;
      } else if (obj.count == leastCount && this.grid[obj.i][obj.j].sprite == -1) {
        leasts.push(obj.cell);
      }
    }
    return random(leasts);
  }

  step() {
    let nextCandidate = board.leastEntropy();
    if (nextCandidate) {
      let sprites = board.superpositionAt(nextCandidate.col, nextCandidate.row);
      if (sprites.length) {
        board.grid[nextCandidate.col][nextCandidate.row].setSprite(random(sprites));
        this.updateNeighborEntropy(nextCandidate.col, nextCandidate.row);
      }
    }
  }

  updateNeighborEntropy(col, row) {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        let c = constrain(col + i, 0, this.columns - 1);
        let r = constrain(row + j, 0, this.rows - 1);
        this.computeEntropy(c, r);
      }
    }
  }

  precomputeEntropy() {
    if (this.dirty) {
      for (let i = 0; i < this.columns; i++) {
        for (let j = 0; j < this.rows; j++) {
          this.computeEntropy(i, j);
        }
      }
      this.dirty = false;
    }
  }
}
