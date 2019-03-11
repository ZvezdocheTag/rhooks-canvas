import React, { Component } from 'react'
import *  as d3 from 'd3'
import { colorsPallet } from './utils';


function drawCircle(ctx, cx, color){
  ctx.beginPath();
  ctx.arc(cx,50,20,0,Math.PI*2);
  ctx.closePath();
  ctx.fillStyle=color;
  ctx.fill();
}

// function randomColor(){ 
//   return('#'+Math.floor(Math.random()*16777215).toString(16));
// }

export class CompositeOperation extends Component {
  state = {
    gco: generateListOfCompositionValues(),
    gcoSelected: generateListOfCompositionValues()[0],
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
    const canvas = this.canvasRef.current,
      ctx = canvas.getContext("2d");
      

    this.setState({
      ctx: ctx,
      canvas,
    })

    this.renderCircles(ctx)
  }

  renderCircles = (ctx) => {
    const cx = 50;
    Array.from({ length: 4}, (_, k) => k).forEach((item, idx) => {
      drawCircle(ctx, cx + (20 * idx), colorsPallet[idx])
    })
  }
  componentDidUpdate(p, s) {
    const { ctx, canvas,  layout: { cols,rows } } = this.state;
    let cellWidth = canvas.width / cols,
    cellHeight = canvas.height /rows,
    grid = [],
    axis = [],
    y = 0, x;

    console.log(this.state, "UPDATED")
    let currentPoint = 0;

    if(ctx !== null) {
      ctx.globalCompositeOperation=this.state.gcoSelected;
      this.renderCircles(ctx)
    }
  }
  
  selectGco = (e) => {
    this.setState({
      gcoSelected: e.target.value
    })
  }
  render() {
    const { gcoSelected, gco } = this.state;
    return (<>
    <canvas ref={this.canvasRef} style={{ backgroundColor: "#333"}}/>
    <select size="1" name="hero[]" style={{ position: "absolute", left: "100%", width: 100 }} onChange={this.selectGco}>
    {this.state.gco.map(item => (<option style={{ height: 20}} selected={gcoSelected === item} value={item} key={item}>{item}</option>))}
   </select>
    </>)
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

function generateListOfCompositionValues() {
  const gco = new Array();
  gco.push("source-atop");
  gco.push("source-in");
  gco.push("source-out");
  gco.push("source-over");
  gco.push("destination-atop");
  gco.push("destination-in");
  gco.push("destination-out");
  gco.push("destination-over");
  gco.push("lighter");
  gco.push("copy");
  gco.push("xor");

  return gco;
}