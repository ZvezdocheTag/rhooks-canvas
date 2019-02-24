import React, { Component, Fragment } from 'react'
import *  as d3 from 'd3'



export class StepsTileAnimation extends Component {
  state = {
    context: null,
    canvas: null,
    grid: null,
    active: false,
    layout: {
      w: this.props.w,
      h: this.props.h,
      cols: 6,
      rows: 3
    }
  }

  componentDidMount() {
    var canvas = document.querySelector("canvas"),
      ctx = canvas.getContext("2d");

    this.setState({
      context: ctx,
      canvas,
    })
  }

  componentDidUpdate(p, s) {
    const { context, canvas,  layout: { cols,rows } } = this.state;
    var cellWidth = canvas.width / cols,
    cellHeight = canvas.height /rows,
    grid = [],
    axis = [],
    y = 0, x;
    let currentPoint = 0;

    if(context !== null) {
      context.clearRect(0, 0, canvas.width, canvas.height);

      for(; y < rows; y++) {
        for(x = 0; x < cols; x++) {
          // grid.push(new Rectangle(ctx, x * cellWidth, y * cellHeight, cellWidth, cellHeight, "#79f", 0.02));
          context.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
          context.globalAlpha = 0;
          grid.push(context)
          axis.push({x: x * cellWidth, y: y * cellHeight, w: cellWidth, h: cellHeight, index: { x, y }})
        }
      }

      if(this.props.isActive) {
        currentPoint = fadeIn(context, currentPoint, grid.length, axis)
      }
    }

  }
  
  render() {
    return (<canvas />)
  }
}

// Мыслить в плане банального js не в контексте реакта или canvas
// animation settings
const duration = 1050;
const ease = d3.easeCubic;
let timerA = null;

function fadeIn(ctx, cp, gridLength, axis) {
  timerA = d3.timer((elapsed) => {
    const t = Math.min(1, ease(elapsed / duration));
    ctx.globalAlpha = Math.min(1, t)
    ctx.fillRect(axis[cp].x, axis[cp].y, axis[cp].w, axis[cp].h);

    if (t > 0.9) {
      timerA.stop()
      cp = (cp + 1);

      if(cp < gridLength - 1) {
        fadeIn(ctx, cp, gridLength, axis)
      }
    };
  })

  return cp;
}
