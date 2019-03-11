import React, { Component } from 'react'

export class RectAnimation extends Component {
  state = {
    context: null,
    canvas: null,
    grid: null,
    active: false,
    layout: {
      cols: 10,
      rows: 5,
      w: 0,
      h: 0
    }
  }

  componentDidMount() {
    const canvas = document.querySelector("canvas"),
      ctx = canvas.getContext("2d");

    this.setState({
      context: ctx,
      canvas,
      layout: {
        ...this.state.layout,
        w: canvas.width,
        h: canvas.height
      }
    })
  }

  componentDidUpdate(p, s) {
    const { active, context, canvas,  layout: { cols,rows }, grid } = this.state;

    if(context !== null) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      if(active) {
        createGrid(canvas, context, { cols,rows}, 1)
      } 
    }

  }
  
  runAnimation = () => {
    this.setState({
      active: !this.state.active
    })
  }
  render() {
    console.log(this.state)
    return (
      <div>
        <button onClick={this.runAnimation}>Run Animation</button>
        <canvas width="500" height="300"></canvas>
      </div>
    )
  }
}



function createGrid (canvas, ctx, { rows, cols }, opacity) {
  // Populate gridlet 
  let cellWidth = canvas.width / cols,
        cellHeight = canvas.height /rows,
        grid = [],
        y = 0, x;
        var alpha = 0;

  for(; y < rows; y++) {
    for(x = 0; x < cols; x++) {

      // console.log(ctx, "I", x)
      function fadeOut() {
          if (alpha >= 1) {
              return;
          } 
          console.log(alpha, x)
          requestAnimationFrame(fadeOut);
          ctx.clearRect(0,0, canvas.width, canvas.height);
          ctx.globalAlpha = Math.min(1, alpha);

          ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth - 2, cellHeight - 2);

          alpha += 0.01
      }

      fadeOut()
    }
  }

}

// function fadeOut() {
//   if (alpha >= 1) {
//       return;
//   }         
      
//   requestAnimationFrame(fadeOut);
//   ctx.clearRect(0,0, canvas.width, canvas.height);
//   ctx.globalAlpha = alpha;

//   ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth - 2, cellHeight - 2);

//   alpha += 0.01;
// }