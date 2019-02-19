import React from "react";
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
export default class Canvas extends React.PureComponent {
  state = {
    csvData: null,
    canvas: null,
    context: null,
    rectFlag: false,
    counter: 0,
    active: null,
    layout: {
      width: 0,
      height: 0,
      margin: { top: 20, right: 20, bottom: 30, left: 40 },
    }
  }

  componentDidMount() {
    const canvas = d3.select("canvas").node(),
      context = canvas.getContext("2d");

    this.d3timer = null;

    const margin = { top: 20, right: 20, bottom: 30, left: 40 },
      width = canvas.width - margin.left - margin.right,
      height = canvas.height - margin.top - margin.bottom;

    context.translate(margin.left, margin.top);
    context.globalCompositeOperation = "multiply";
    context.fillStyle = "rgba(60,180,240,0.6)";

    d3.tsv(csvTestUrl, (item) => type(item)).then((data) => {
      this.setState({
        csvData: data,
        canvas,
        context,
        layout: { margin, width, height }
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
  componentDidUpdate(p, s) {
    console.log(this.state, this.props, p, s, "DID")
    let { csvData, context, counter, layout, active } = this.state;
    const csvDataMeasure = counter * 1000;

    const activeCluster = [[0, 5000], [6000, 10000], [13000, 18000], [20000, 25000]]

      if(csvData !== null && active !== null) {
        let csvDataCut = csvData.slice(activeCluster[active][0], activeCluster[active][1]);
        const x = d3.scaleLinear().rangeRound([0, layout.width - 2]);
        const y = d3.scaleLinear().rangeRound([layout.height - 2, 0]);
  
        x.domain(d3.extent(csvDataCut, (d) => d.carat));
        y.domain(d3.extent(csvDataCut, (d) => d.price));

        const add = this.addDots(context, x, y);
        this.d3timer = d3.timer(this.canvasFillAnimationDecorator(csvDataCut, add));

        // if(this.state.rectFlag) {

        // } else {
        //   // this line do animation randomly ( dots appear in random position )
        //   const remove = this.removeDots(context, x, y);
        //   this.d3timer = d3.timer(this.canvasFillAnimationDecorator(csvDataCut, remove));
        // }

    }
  }

  removeDots = (context, x, y) => {
    return (d) => {
      context.clearRect(x(d.carat), y(d.price), Math.max(2, x(d.carat + 0.01) - x(d.carat)), 2);
    }
  }

  addDots = (context, x, y) => {
    return (d) => {
      context.fillRect(x(d.carat), y(d.price), Math.max(2, x(d.carat + 0.01) - x(d.carat)), 2);
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

  canvasClick = (e) => {
    console.log(e.target)
  }

  render() {
    const layoutStyle = {
      top: 200,
      left: 200
    }
    return (
      <Wrap style={{ border: "1px solid black", display: "flex", justifyContent: "flex-start", flexDirection: "column" }}>
        <h1 style={{ marginBottom: "40px" }}> Canvas scatters</h1>
        <canvas width="960" height="960" onClick={this.canvasClick} style={layoutStyle}/>
        <svg width="960" height="960" style={layoutStyle}>
          {
            [[200, 300], [100, 50], [400, 50], [275, 140]].map(([x, y], i) => <g transform={`translate(${x}, ${y})`} key={i.toString() + (x + y).toString()}>
              <rect x="0" y="0" fill="red" width="30px" height="30px" onClick={this.rectClick(i)}></rect>
          </g>)
          }
        </svg>
      </Wrap>
    );
  }
}
