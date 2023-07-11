# Wave Function Collapse
Inspired by and adapted from [the Coding Train video on Wave Function Collapse](https://www.youtube.com/watch?v=rI_y2GAlQFM)

More information about the Wave Function Collapse algorithm can be [found here](https://github.com/mxgmn/WaveFunctionCollapse) in the repository of the person who I believe pioneered this algorithm in the context of generative graphics.

This sketch uses a default style for the generated tiles. They are maze-like although no care is taken to ensure a valid or even sensible maze is created, it is simply generating a 2D texture.

The sketch can be adapted to use any set of tiles as follows:
  1.  **Draw the tiles**. The program has so far only been tested with tiles of 100px by 100px dimensions but should, in theory work with any size. Note that it is recommended that you draw enough tiles to prevent a condition where there is no valid tile for a paritcular configuration. There is currently no backtracking in the algorithm, and while this is planned, the program will halt if it cannot find a tile that satisfies its environment.
  2.  **Create the folder and schema**. You must create a folder in the `sprites/` directory with the name you wish to address your tile set by. In addition, inside that newly created folder, you will need to include a `schema.json` file that details how the tiles can be hooked together. See below for the requirements of this JSON file.
  3.  **Change the line**. Finally you can change line 154 in the `preload()` function from `loadSprites('maze');` to `loadSprites('your-folder-name-here');` and then run the sketch

## Creating the `schema.json` File

  1.  The `schema.json` file for a set of tiles has the following structure:
  2.  A `global` key containing the width and height of each tile and how many there are (currently all unused fields, but might be used in the future)
  3.  A `images` key which contains many keys, each one being the name of an image file which contains a single tile. These image filename keys map to objects
      -  These objects must have 2 keys: a "classes" key and a "rotates" key.
          -  The "classes" key maps to an object with the keys "1", "2", "4", and "8" representing the top, right, bottom, and left side of the tile respectively. Each of these keys maps to a single letter string indicating which class that side of the tile is. Tiles can only be placed in spaces where all 4 of their sides match the class of the corresponding side of the tiles around them.
          -  The "rotates" key maps to an array. This array can be empty if the tile cannot be rotated or can contain any number of degree measurements by which the tile can be rotated before placement.

You can find examples of these files in the sprites directory

## Known bugs
None that I know of. Feel free to open an issue.

## Future Plans
 - [x]  If many cells tie for least entropy choose a random one rather than the first one every time
 - [x]  Precompute entropy for every cell once, then only recompute for the neighbors of the cell and the new cell
 - [ ]  Implement backtracking
 - [ ]  Allow live selection of tile sets
 - [x]  Determine rotational variants using rotation and the data provided in the `schema.json` file so rotated versions of tiles are not needed if possible
 - [ ]  Ditto for flipping if possible
 - [x]  Currently matching is completely binary you can only match or not match at a particular side. I would like to make it so that some times can match with other tiles but not all tiles on a particular side
 - [x]  Possibly implement a socket style of matching
 - [ ]  Possibly implement a socket style of matching using only parts of the sides so that there is more variety in how the tiles can be linked together
 - [ ]  Determine possible connections using image processing or pixel color selection obviating the need for the `tiles` part of the `schema.json`
