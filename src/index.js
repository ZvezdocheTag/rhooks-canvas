import React from "react";
import ReactDOM from "react-dom";
import Canvas from "./Canvas";
import "./styles.css";

function App() {
  return (
    <div className="App">
      <Canvas />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
