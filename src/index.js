import React from "react";
import ReactDOM from "react-dom";
// import Canvas from "./Canvas";
import ExampleCanvas from "./ExampleCanvas";
// // import AnimatedCanvas from "./AnimatedCanvas";
import "./styles.css";

function App() {
  return (
    <div className="App">
      <ExampleCanvas />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
