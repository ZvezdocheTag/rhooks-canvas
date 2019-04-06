import React from "react";
import ReactDOM from "react-dom";
import CanvasPage from "./CanvasPage";
// import * as Canvas from "./cv";
// import Query from './hooks/Query'
import "./styles.css";

class App extends React.Component {
  render() {
    return (
      <div className="App">
          <CanvasPage />
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
