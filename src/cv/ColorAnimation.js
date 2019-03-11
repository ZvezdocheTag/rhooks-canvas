import React, { Component } from 'react'
import *  as d3 from 'd3'

export class ColorAnimation extends Component {
  state = {
    context: null,
    canvas: null,
    layout: {
      w: this.props.w,
      h: this.props.h,
      cols: 6,
      rows: 3
    }
  }

  canvasRef = React.createRef();

  componentDidMount() {
    var canvas = this.canvasRef.current,
      ctx = canvas.getContext("2d");

    this.setState({
      ctx: ctx,
      canvas,
    })
  }

  componentDidUpdate(p, s) {
    const { ctx, canvas,  layout: { cols,rows } } = this.state;
    let cellWidth = canvas.width / cols,
    cellHeight = canvas.height /rows,
    grid = [],
    axis = [],
    y = 0, x;

    let currentPoint = 0;

    if(ctx !== null) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = `rgba(255,0,0,1)`;
      ctx.fillRect(50, 50, 50, 50);
      // ctx.globalAlpha = 0.1;
      
      if(this.props.isActive) {
        animation(ctx)
      }
    }

  }
  
  render() {
    return (<canvas ref={this.canvasRef}/>)
  }
}

// Мыслить в плане банального js не в контексте реакта или canvas
// animation settings
const duration = 200;
const ease = d3.easeCubic;
let timerA = null;

function animation(ctx) {
  timerA = d3.timer((elapsed) => {
    // const t = Math.min(1, ease(elapsed / duration));
    const t = Math.min(166, ease(elapsed / duration));

    console.log(elapsed, ease(elapsed / duration), t, "WE")
    // ctx.globalAlpha = Math.min(1, t)
    let r,g,b;

    r = g = b = t;
    const alpha = 1;
    const rgba = `rgba(${r}, ${g}, ${b}, ${alpha})`;
    ctx.fillStyle = rgba;
    ctx.fillRect(50, 50, 50, 50);

    if (t > 163) {
      timerA.stop()
    };
  })

}
