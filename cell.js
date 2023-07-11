class Cell {
  constructor(row, col) {
    this.row = row;
    this.col = col;
    this.sprite = -1;
  }

  setSprite(sprite) {
    if (!sprite) {
      throw new TypeError("Sprite cannot be falsely");
    }
    this.sprite = sprite;
  }
}
