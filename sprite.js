
class Sprite {

  static rotate(image, edges, degrees) {
    // rotate the image
    let graphics = createGraphics(image.width, image.height);
    graphics.background(0);
    graphics.translate(image.width / 2, image.height / 2);
    graphics.rotate(-radians(degrees));
    graphics.image(image, -image.width / 2, -image.height / 2);
    // rotate the edges
    // [ 1 Top, 2 Right, 4 Down, 8 Left ]
    // 90 degree counter clockwise rotation takes top to left, right to top etc.

    for (let i = 0; i < floor(degrees / 90); i++) {
      let newEdges = {};
      newEdges["1"] = edges["2"];
      newEdges["2"] = edges["4"];
      newEdges["4"] = edges["8"];
      newEdges["8"] = edges["1"];
      edges = newEdges;
    }

    return { image: graphics, edges };

  }

  static addSprite(image, key, edges, userData) {
    let s = new Sprite(image, key, userData);
    for (let pos of Object.keys(edges)) {
      s.acceptsPosition(pos, edges[pos]);
    }
    sprites.push(s);
  }

  static loadSprites(directoryName) {
    let path = `sprites/${directoryName}`;
    loadJSON(`${path}/schema.json`, schema => {
      console.log(schema);
      for (let key of Object.keys(schema.images)) {
        let edges = schema.images[key]['classes'];
        loadImage(`${path}/${key}`, image => {
          let rotations = schema.images[key].rotates;
          for (let degrees of rotations) {
            let result = Sprite.rotate(image, edges, degrees);
            Sprite.addSprite(result.image, `${key}-r${degrees}`, result.edges, { rotation: degrees });
          }
          // sprite creation
          Sprite.addSprite(image, key, edges);
        });
      }
    });
  }

  constructor(image, filename, userData) {
    this.userData = userData || {};
    if (!image) {
      throw new TypeError("Image for sprite cannot be null");
    }
    this.image = image;
    this.filename = filename;
    this.positions = { 1: null, 2: null, 4: null, 8: null };
  }

  acceptsTop(clazz) {
    this.positions[TOP] = clazz;
    return this;
  }

  acceptsBottom(clazz) {
    this.positions[BOTTOM] = clazz;
    return this;
  }

  acceptsLeft(clazz) {
    this.positions[LEFT] = clazz;
    return this;
  }

  acceptsRight(clazz) {
    this.positions[RIGHT] = clazz;
    return this;
  }

  acceptsPosition(position, clazz) {
    position = Number(position);

    switch (position) {
      case TOP: this.acceptsTop(clazz); break;
      case BOTTOM: this.acceptsBottom(clazz); break;
      case LEFT: this.acceptsLeft(clazz); break;
      case RIGHT: this.acceptsRight(clazz); break;
    }
  }

  /**
   * This method determines whether this sprite on position side can connect to otherSprite on the inverse of position's side
   *
   * For example sprite1.canConnect(sprite2, LEFT) will return true iff. sprite1's left side and sprite2's right side are compatible
   *             spriteA.canConnect(spriteB, TOP) will return true iff. spriteA's top side is compatible with spriteB's bottom side
   * @param {Sprite} otherSprite the sprite on which the connection is to be made
   * @param {Number} position the position (TOP, RIGHT, BOTTOM, or LEFT) to connect from this Sprite's perspective
   * @returns {Boolean} true iff. the sprites can connect on the specified side
   */
  canConnect(otherSprite, position) {
    if (position === undefined) {
      throw new TypeError("Must connect with position");
    }

    return (this.positions[position] == otherSprite.positions[inversePosition(position)]);
  }
}
