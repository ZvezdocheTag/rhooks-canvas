import React, { Component } from 'react'

export class TrailTileAnimation extends Component {
  state = {
    context: null,
    canvas: null,
    grid: null,
    active: false,
    layout: {
      w: 0,
      h: 0
    }
  }

  createGrid = (canvas, ctx, { rows, cols }) => {
  // Populate grid
  var cellWidth = canvas.width / cols,
      cellHeight = canvas.height /rows,
      grid = [],
      y = 0, x;

  for(; y < rows; y++) {
    for(x = 0; x < cols; x++) {
      grid.push(new Rectangle(ctx, x * cellWidth, y * cellHeight, cellWidth, cellHeight, "#79f", 0.02));
    }
  }
  return grid;
  }

  componentDidMount() {
    const canvas = document.querySelector("canvas"),
      ctx = canvas.getContext("2d");
    const cols = 6,
      rows = 3
    this.setState({
      context: ctx,
      canvas,
      grid: this.createGrid(canvas, ctx, { cols,rows}),
      layout: {
        cols, rows,
        w: canvas.width,
        h: canvas.height
      }
    })
  }

  componentDidUpdate(p, s) {
    let index, x = 0, y = 0, 
    hasActive = true;
    const { layout: { w, h, cols, rows }, context, canvas } = this.state;
    const self = this;
    let grid = this.state.grid;


    if(context !== null) {

      function loop() {
        context.globalAlpha = 1;
        context.clearRect(0, 0, w, h);
        
        // trigger cells
        for(y = 0; y < rows; y++) {
          var gx = (x|0) - y;
          if (gx >= 0 && gx < cols) {
            index = y * cols + gx;
            grid[index].trigger();
          }
        }
        
        x += 0.333;
        
        hasActive = false;
        
        // update all
        for(var i = 0; i < grid.length; i++) {
          grid[i].update();
          if (!grid[i].done) {
            hasActive = true;
          };
        }
        
        if (hasActive) requestAnimationFrame(loop)
      }
  
      function clearLoop() {
        // context.setTransform(1,0,0,1,0,0);
        context.globalAlpha = 1;
        context.clearRect(0, 0, w, h);

        for(var i = 0; i < grid.length; i++) {
          grid[i].reset();
        }
      }
      if(this.state.active) {
        console.log(grid)
        loop();
      } else {
        clearLoop()
      }
    }

  }
  runAnimation = () => {
    this.setState({
      active: !this.state.active
    })
  }
  render() {
    // console.log(this.state)
    return (
      <div>
        <button onClick={this.runAnimation}>Run Animation</button>
        <canvas width="500" height="300"></canvas>
      </div>
    )
  }
}

// Square-monkey object
 
function Rectangle(ctx, x, y, w, h, color, speed) {
  this.ctx = ctx;
  this.x = x;
  this.y = y;
  this.height = h;
  this.width = w;
  this.color = color;
  
  this.alpha = 0;                        // current alpha for this instance
  this.speed = speed;                    // increment for alpha per frame
  this.triggered = false;                // is running
  this.done = false;                     // has finished
}
  // prototype methods that will be shared
Rectangle.prototype = {

  trigger: function() {                  // start this rectangle
    this.triggered = true
  },
  
  update: function() {
    if (this.triggered && !this.done) {  // only if active
      this.alpha += this.speed;          // update alpha
      this.done = (this.alpha >= 1);     // update status
    }

    this.ctx.fillStyle = this.color;     // render this instance
    this.ctx.globalAlpha = Math.min(1, this.alpha);
    this.ctx.fillRect(this.x -5 , this.y - 5, this.width, this.height);
  },

  reset: function() {
    if (this.triggered && this.done) { 
      this.alpha -= this.speed;          // update alpha
      this.done = (this.alpha <= 0);                       // current alpha for this instance 
      this.triggered = false;                // is running
      this.done = false; 
    }

        this.ctx.globalAlpha = Math.min(1, this.alpha);
    this.ctx.fillRect(this.x -5 , this.y - 5, this.width, this.height);
  }
};