
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
