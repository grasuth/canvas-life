//TODO: add options for symbol displayed, colors, decay over several rounds?
/**
 * CanvasLife
 * 
 * constructor:
 * 
 * @param {DOM Element} canvas Canvas element to hold the life universe
 * 
 * @param {object} options  Options to override default settings
 * 
 */
var CanvasLife = (function (canvas, options) {
  
  var self = {};
    
  self.defaultOptions = {
    aliveValue: 0xff00ff00,
    deadValue: 0xff000000,
    initialRandomProbability: 0.1,
    generationsPerSecond: 10
  };
 
  self.options = resolveObject(options || {}, self.defaultOptions);
  
  self.canvas = canvas;
  self.context = canvas.getContext('2d');
  
  self.width = canvas.width;
  self.height = canvas.height;

  self.generationCount = 0;
  
  /**
   * @name resolveObject
   * 
   * @description
   * 
   * Simple object resolution for options setting. Saves loading a library
   * just for this.
   * 
   * Returns an object made from default values overridden by changes.
   * Properties not already in default are not included.
   * 
   * @param {object} changes Object giving properties that are changed from the
   * default fallback.
   * 
   * @param {object} fallback Object containing default properties.
   * 
   * @returns {object} Resolved object with resolved values from fallback and
   * changes.
   */
  function resolveObject(changes, fallback) {
    var resolved = {};
    
    for (var optionName in fallback) {
      if (fallback.hasOwnProperty(optionName)) {
        if (changes.hasOwnProperty(optionName)) {
          resolved[optionName] = changes[optionName];
        } else {
          resolved[optionName] = fallback[optionName];
        }
      }
    }
    
    return resolved; 
  }
    
  
  /**
   * Return the value of a cell as a 1 for alive, 0 for dead
   * 
   * @param {int} x The x axis index for the cell
   * 
   * @param {int} y The y axis index for the cell
   * 
   * @returns {int} 0 if cell is currently dead, 1 if cell is alive
   */
  self.getCellLife = function(x, y, imgBuf) {
    var val = imgBuf[self.xyToWordOffset(x, y)];
    
    return val > self.options.deadValue  ? 1 : 0;
  };
  
  self.xyToWordOffset = function (x, y) {
    if (y < 0) {
      y = self.height -1;
    }
    else if (y >= self.height) {
      y = 0;
    }
    if (x < 0) {
      x = self.width - 1;
    }
    else if (x >= self.width) {
      x = 0;
    }
    return x + (y * self.width);
  };
  
  /**
   * Calculate a generateion for a cell
   * 
   * @param {int} x The x coordinate of the cell
   * 
   * @param {int} y The y coordinate of the cell
   * 
   * @param {Uint32Array} inBuf The last generation universe
   * 
   * @param {Uint32Array} outBuf The next generation universe
   */
  self.generateCell = function(x, y, inBuf, outBuf) {
    var alive = 0,
        iAmAlive = self.getCellLife(x, y, inBuf) > 0;
        
    // fairly stupid but explicit way of checking
    alive += self.getCellLife(x-1, y-1, inBuf);
    alive += self.getCellLife(x-1, y, inBuf);
    alive += self.getCellLife(x-1, y+1, inBuf);
    alive += self.getCellLife(x, y-1, inBuf);
    alive += self.getCellLife(x, y+1, inBuf);
    alive += self.getCellLife(x+1, y-1, inBuf);
    alive += self.getCellLife(x+1, y, inBuf);
    alive += self.getCellLife(x+1, y+1, inBuf);
    
    if (iAmAlive) {
      if (alive < 2 || alive > 3) {
        // dead
        outBuf[self.xyToWordOffset(x,y)] = self.options.deadValue;
      }
      else {
        // alive
        outBuf[self.xyToWordOffset(x,y)] = self.options.aliveValue;
      }
    }
    else {
      if (alive === 3) {
        outBuf[self.xyToWordOffset(x,y)] = self.options.aliveValue;
      }
      else {
        outBuf[self.xyToWordOffset(x,y)] = self.options.deadValue;
      }
    }
  };
  
  // do a generation of life
  self.generation = function() {    
    var currentImgData = self.context.getImageData(0, 0, self.width, self.height),
        currentImgBuf = new Uint32Array(currentImgData.data.buffer),
        newImgData = self.context.createImageData(self.width, self.height),
        newImgBuf = new Uint32Array(newImgData.data.buffer);
    
    for (var y=0; y< self.height; y++) {
      for (var x=0; x < self.width; x++) {
        self.generateCell(x, y, currentImgBuf, newImgBuf);
      }
    }
    
    self.generationCount += 1;
    
    self.context.putImageData(newImgData, 0, 0);
  };
  
  
  
  self.randomLife = function(likelyOn) {
    return (Math.random() < likelyOn);
  };
  
  /**
   * Randomize the given universe with a starting position
   *
   * @param imgBuf An image buffer to randomize
   */
  self.randomize = function(imgBuf) {
    for (var offset=0; offset<imgBuf.length; offset++) { //noprotect
      var alive = self.randomLife(self.options.initialRandomProbability);
      
      imgBuf[offset] = alive 
        ? self.options.aliveValue
        : self.options.deadValue;
    }
  };
  
  self.start = function() {
    var imgData
      , imgBuf;
    
    // Create imgData from context
    imgData = self.context.createImageData(self.width, self.height);
    imgBuf = new Uint32Array(imgData.data.buffer);
    
    // Initialize with randomly distributed cells
    self.randomize(imgBuf);
    
    // Display starting state
    self.context.putImageData(imgData, 0, 0);
   
    // start generating 
    setInterval(function () {
      self.generation();
    }, 1000/self.options.generationsPerSecond);
  };

  return self;
});
