import React from "react";
import ReactDOM from "react-dom";
// import Canvas from "./CanvaAnimD3";
import * as Canvas from "./cv";
import "./styles.css";

export default class CanvasPage extends React.Component {
  wrappers = {};
  state = {};

  setCanvasWrapperRef = name => element => {
    this.wrappers[name] = element;
  };

  runAnimation = node => () => {
    this.setState(prev => ({
      ...prev,
      [node]: prev[node] ? !prev[node] : true,
    }))
  }

  componentDidMount() {
    this.setState({
      wrappers: this.wrappers
    })
  }

  render() {
    return (
      <>
      {
        Object.keys(Canvas).map(item => {
          const SpecifyCanvas = Canvas[item];
          let w = 0;
          let h = 0;

          if(this.wrappers[item]) {
            h = this.wrappers[item].offsetHeight;
            w = this.wrappers[item].offsetWidth;
          }

          return <div key={item} style={{ display: "flex" }}>
            <div ref={this.setCanvasWrapperRef(item)} style={{ position: "relative", width: "calc(100% - 30px)", height: "100%" }}>
                <SpecifyCanvas w={w} h={h} isActive={this.state[item]}/>
            </div>
            <button style={{ width: 30, height: 30 }} onClick={this.runAnimation(item)}>R</button>
          </div>
        })
      }
      </>
    );
  }
}

