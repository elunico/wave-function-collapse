# Wave Function Collapse
Inspired by and adapted from [the Coding Train video on Wave Function Collapse](https://www.youtube.com/watch?v=rI_y2GAlQFM)

More information about the Wave Function Collapse algorithm can be [found here](https://github.com/mxgmn/WaveFunctionCollapse) in the repository of the person who I believe pioneered this algorithm in the context of generative graphics.

This sketch uses a default style for the generated tiles. They are maze-like although no care is taken to ensure a valid or even sensible maze is created, it is simply generating a 2D texture.

The sketch can be adapted to use any set of tiles as follows:
  1.  **Draw the tiles**. The program has so far only been tested with tiles of 100px by 100px dimensions but should, in theory work with any size. Note that it is recommended that you draw enough tiles to prevent a condition where there is no valid tile for a paritcular configuration. There is currently no backtracking in the algorithm, and while this is planned, the program will halt if it cannot find a tile that satisfies its environment.
  2.  **Create the folder and schema**. You must create a folder in the `sprites/` directory with the name you wish to address your tile set by. In addition, inside that newly created folder, you will need to include a `schema.json` file that details how the tiles can be hooked together. See below for the requirements of this JSON file.
  3.  **Change the line**. Finally you can change line 154 in the `preload()` function from `loadSprites('maze');` to `loadSprites('your-folder-name-here');` and then run the sketch

  4.  ## Creating the `schema.json` File

  5.  The `schema.json` file for a set of tiles has the following structure:
  6.  A `global` key containing the width and height of each tile and how many there are (currently all unused fields)
  7.  A `tiles` key which keys an object of the following structure
      -  The keys of this object are the names of the tile image files on disk
      - The values of these keys are also objects which contain a single `connects_on` key which is a list of 1, 2, 4, or 8 corresponding to *tile in the file* being able to connect **on it's own** top, right, bottom, or left respectively.

You can find examples of these files in the sprites directory

## Known bugs
None that I know of. Feel free to open an issue.

## Future Plans
 - [x]  If many cells tie for least entropy choose a random one rather than the first one every time
 - [x]  Precompute entropy for every cell once, then only recompute for the neighbors of the cell and the new cell
 - [ ]  Implement backtracking
 - [ ]  Allow live selection of tile sets
 - [ ]  Determine rotational variants using rotation and the data provided in the `schema.json` file so rotated versions of tiles are not needed if possible
 - [ ]  Ditto for flipping if possible
 - [ ]  Currently matching is completely binary you can only match or not match at a particular side. I would like to make it so that some times can match with other tiles but not all tiles on a particular side
 - [ ]  Possibly implement a socket style of matching
 - [ ]  Determine possible connections using image processing obviating the need for the `tiles` part of the `schema.json`
