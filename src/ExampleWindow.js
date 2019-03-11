import React from "react";
import ReactDOM from "react-dom";
// import Canvas from "./CanvaAnimD3";
import * as Canvas from "./cv";
import "./styles.css";

// console.log(Object.keys(Canvas))
function App() {
  return (
    <div className="App">
    {
      Object.keys(Canvas).map(item => {
        const SpecifyCanvas = Canvas[item];

        return <SpecifyCanvas key={item} />
      })
    }
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
