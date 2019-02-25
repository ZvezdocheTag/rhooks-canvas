import React, { Fragment, Component } from "react";
import * as d3 from "d3";
// import tsv from './data.tsv';
import styled from 'styled-components';

const csvTestUrl = "https://gist.githubusercontent.com/mbostock/ebb45892cc6ec5e6c902/raw/40e2b0cf409f7da26aed8ab6e6437a79ff45c0c6/diamonds.tsv";

const Wrap = styled.div`
  background-color: red;
`
function type(d) {
  d.carat = +d.carat;
  d.price = +d.price;
  return d;
}
/**
 * Todo:
 * 1. Move data to state
 * 2. Update data with componentDidMount
 * 3. Manipulate data with slicing and pushing new one
 * 4. Update data on canvas with events
 */
export class DiamondsScatters extends Component {
  state = {
    csvData: null,
    canvas: null,
    context: null,
    rectFlag: false,
    counter: 0,
    active: 0,
    layout: {
      margin: { top: 20, right: 20, bottom: 30, left: 40 },
    }
  }

  componentDidMount() {
    const canvas = d3.select("canvas#diamonds").node(),
      context = canvas.getContext("2d");
    this.d3timer = null;

    context.globalCompositeOperation = "multiply";
    context.fillStyle = "rgba(60,180,240,0.6)";

    d3.tsv(csvTestUrl, (item) => type(item)).then((data) => {
      // console.log(this.getByClusters(data, 4, 100))
      this.setState({
        csvData: this.getByClusters(data, 4, 100),
        canvas,
        context
      })
    })
  }

  rectClick = (idx) => {
    return () => {
      this.setState(prev => ({
        rectFlag: !prev.rectFlag,
        counter: !prev.rectFlag ? prev.counter + 1 : prev.counter,
        active: idx
      }))
    }
  }

  getByClusters = (data, amount, volume) => {
    const count = Array.from({length: amount}, (o, i) => i);
    
    return count.map(item => {
      return data.slice(item * volume, (item + 1) * volume)
    })
  }

  componentDidUpdate(p, s) {
    let { csvData, context, canvas, layout, active, rectFlag, counter } = this.state;
    const width = canvas && canvas.width;
    const height = canvas && canvas.height;

    console.log(this.state.csvData, s.csvData, active, rectFlag, "STATE")
    if(csvData !== null) {
      // let csvDataCut = [{carat: 0.11, price: 225}, {carat: 0.31, price: 245}];
      let csvDataCut = csvData[active];
      const x = d3.scaleLinear().range([0, width - 50]);
      const y = d3.scaleLinear().range([height - 50, 0]);

      // x.domain(d3.extent(csvDataCut, (d) => d.carat));
      // y.domain(d3.extent(csvDataCut, (d) => d.price));
      
      x.domain([0, 1]);
      y.domain([3000, 0]);
      
      console.log(csvDataCut)
      console.log(x, y)

      const add = this.addDots(context, x, y);
      const remove = this.removeDots(context, x, y);
      
      if(rectFlag) {
        this.d3timer = d3.timer(this.canvasFillAnimationDecorator(csvDataCut, add));
      } else {
        console.log("WR")
        this.d3timer = d3.timer(this.canvasFillAnimationDecorator(csvDataCut, remove));

      }
    }
  }

  removeDots = (context, x, y) => {
    return (d) => {
      console.log("REMOVE")

      context.clearRect(x(d.carat), y(d.price) - 10, 30, 30);
      // context.clearRect(0, 0, 930, 430);
    }
  }

  addDots = (ctx, x, y) => {
    return (d) => {
      ctx.beginPath();
      ctx.arc(x(d.carat), y(d.price), 2, 0, 2 * Math.PI);
      ctx.fill();
      // context.fillRect(x(d.carat), y(d.price), 30, 30);
    }
  }
  
  canvasFillAnimationDecorator = (obj, cb) => {
    return () => {
      var d;
      for (var i = 0, n = 500; i < n; ++i) {
        if (!(d = obj.pop())) return this.d3timer.stop();
        cb(d)
      }
    }
  }

  render() {
    console.log(this.props)
    return (
      <Fragment>
        <canvas id="diamonds" width={this.props.w} height={this.props.h}/>
        <svg>
          {
            [[200, 300], [100, 50], [400, 50], [275, 140]].map(([x, y], i) => <g transform={`translate(${x}, ${y})`} key={i.toString() + (x + y).toString()}>
              <rect x="0" y="0" fill="red" width="30px" height="30px" onClick={this.rectClick(i)}></rect>
          </g>)
          }
        </svg>
      </Fragment>
    );
  }
}
