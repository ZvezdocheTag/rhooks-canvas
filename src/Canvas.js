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
    layout: {
      width: 0,
      height: 0,
      margin: { top: 20, right: 20, bottom: 30, left: 40 },
    }
  }

  componentDidMount() {
    const canvas = d3.select("canvas").node(),
      context = canvas.getContext("2d");

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

  rectClick = () => {
    this.setState(prev => ({
      rectFlag: !prev.rectFlag,
      counter: !prev.rectFlag ? prev.counter + 1 : prev.counter
    }))
  }
  componentDidUpdate(p, s) {
    console.log(this.state, this.props, p, s, "DID")
    let { csvData, context, counter, layout } = this.state;
    const csvDataMeasure = counter * 1000;
      if(csvData !== null) {
        if(this.state.rectFlag) {
          let csvDataCut = csvData.slice(0, csvDataMeasure);
          const x = d3.scaleLinear().rangeRound([0, layout.width - 2]);
          const y = d3.scaleLinear().rangeRound([layout.height - 2, 0]);
    
          x.domain(d3.extent(csvDataCut, function(d) { return d.carat; }));
          y.domain(d3.extent(csvDataCut, function(d) { return d.price; }));
    
          // this line do animation randomly ( dots appear in random position )
          // d3.shuffle(csvDataCut);
    
          var t = d3.timer(function() {
            var d;
            for (var i = 0, n = 500; i < n; ++i) {
              if (!(d = csvDataCut.pop())) return t.stop();
              context.fillRect(x(d.carat), y(d.price), Math.max(2, x(d.carat + 0.01) - x(d.carat)), 2);
            }
          });

        } else {
          let csvDataCut = csvData.slice(0, csvDataMeasure);
          const x = d3.scaleLinear().rangeRound([0, layout.width - 2]);
          const y = d3.scaleLinear().rangeRound([layout.height - 2, 0]);
    
          x.domain(d3.extent(csvDataCut, function(d) { return d.carat; }));
          y.domain(d3.extent(csvDataCut, function(d) { return d.price; }));
    
          // this line do animation randomly ( dots appear in random position )
          var t = d3.timer(function() {
            var d;
            for (var i = 0, n = 500; i < n; ++i) {
              if (!(d = csvDataCut.pop())) return t.stop();
              context.clearRect(x(d.carat), y(d.price), Math.max(2, x(d.carat + 0.01) - x(d.carat)), 2);
            }
          });
        }

    }
  }

  render() {
    return (
      <Wrap style={{ border: "1px solid black", display: "flex", justifyContent: "flex-start", flexDirection: "column" }}>
        <h1 style={{ marginBottom: "40px" }}> Canvas scatters</h1>
        <canvas width="960" height="960" />
        <svg width="960" height="960">
          <g transform="translate(200, 300)">
              <rect x="0" y="0" fill="red" width="100px" height="100px" onClick={this.rectClick}></rect>
          </g>
        </svg>
      </Wrap>
    );
  }
}
