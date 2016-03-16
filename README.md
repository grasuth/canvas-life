# Conway's Life using Canvas

A JavaScript object for playing Conway's Game of Life in a browser canvas.

This started life as a quick experiment with the capabilities of canvas -- and what better way 
than to run [Conway's Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life)
in the browser.  This implements the B3/S23 standard version in a pretty simple
way.

# Install

All you need is `lib/canvas-life.js` loaded in the browser.

# API

Once you have a canvas element, you can call the `CanvasLife` 
constructor to return a `CanvasLife` object, then call `start()`
to generate a random field of cells and start generations.

## Options

The following options can be provided in an options object in the constructor:

```
  options = {
    aliveValue: 0xff00ff00, // Canvas pixel value for live cells in canvas 
                            // - default is green.
    deadValue: 0xff000000,  // Canvas pixel value for dead cells 
                            //- default is black.
    initialRandomProbability: 0.1, // Probability that a cell is randomly 
                                   // alive at start.
    generationsPerSecond: 10 // number of generations to calculate/animate
                             //per second.
  };

```

## Basic use

```
  var canvas = document.getElementById('canvas-id'),
      options = {},
      life = CanvasLife(canvasElement, options);
  
  life.start();
```


# Example

See `example/index.html` for a simple example.

# License

See `LICENSE` file.  MIT, basically.
