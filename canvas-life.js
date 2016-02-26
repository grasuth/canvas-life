//
// Canvas life simulation: Conway's life
//

//TODO: remove jQuery dependency, tidy up, organise.
//TODO: add options for symbol displayed, colors, decay over several rounds?

var Life=(function ($) {
  
  self = {};
  self.width = 0;
  self.height = 0;

  self.$canvas = null;
  self.$context = null;
  
  var aliveConst = 0xffffffff;
  var deadConst = 0xff000000;
    
  
  self.start = function() {
    var imgData, imgBuf;
    
    // find the canvas & get details
    self.$canvas = $('#universe');
    self.context = self.$canvas[0]
      .getContext('2d');
    self.width = self.$canvas.attr('width');
    self.height = self.$canvas.attr('height');
    console.log(self.width, self.height);  
    // create imgData from context
    imgData = self.context.createImageData(self.width, self.height);
    imgBuf = new Uint32Array(imgData.data.buffer);
    // initialize
    self.randomize(imgBuf);
    // display for a test
    self.context.putImageData(imgData, 0, 0);
    setInterval(function () {
      self.generation();
    }, 1000);
  };
  
  self.randomLife = function(likelyOn) {
    return (Math.random() < likelyOn);
  };
  
  //
  // return the value of a cell as a 1 for alive, 0 for dead
  //
  self.getCellLife = function(x, y, imgBuf) {
    var val = imgBuf[self.xyToWordOffset(x, y)];
    if (val > deadConst) {
      return 1;
    }
    else {
      return 0;
    }
  };
  
  //
  // Set cell to alive (true) or dead (false)
  //
  self.setCell = function (x, y, imgData, alive) {
    
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
  
  //
  // Calculate a generation from a cell
  //
  self.generateCell = function(x, y, inBuf, outBuf) {
    var alive = 0,
        iAmAlive = self.getCellLife(x, y, inBuf) > 0;
    
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
        outBuf[self.xyToWordOffset(x,y)] = deadConst;
      }
      else {
        // alive
        outBuf[self.xyToWordOffset(x,y)] = aliveConst;
      }
    }
    else {
      if (alive == 3) {
        outBuf[self.xyToWordOffset(x,y)] = aliveConst;        
      }
      else {
        outBuf[self.xyToWordOffset(x,y)] = deadConst;        
      }
    }
    
  };
  
  // do a generation of life
  self.generation = function() {    
    var currentImgData = self.context.getImageData(0, 0, self.width, self.height),
        currentImgBuf = new Uint32Array(currentImgData.data.buffer),
        newImgData = self.context.createImageData(self.width, self.height),
        newImgBuf = new Uint32Array(newImgData.data.buffer);
    
    for (y=0; y< self.height; y++) {
      for (x=0; x < self.width; x++) {
        self.generateCell(x, y, currentImgBuf, newImgBuf);
      }
    }
    self.context.putImageData(newImgData, 0, 0);
  };
  
  self.randomize = function(imgBuf) {
    for (var offset=0; offset<imgBuf.length; offset++) { //noprotect
        var alive = self.randomLife(0.05);
        if (alive) {
          imgBuf[offset] = aliveConst;
        }
        else {
          imgBuf[offset] = deadConst;
        }
    }
  };
    
  $(document).ready(function() {
    self.start();
  });

  return self;
  
})(jQuery);
