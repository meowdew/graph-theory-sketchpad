import React from "react";
import ToolBar from "./components/toobar";
import MsgBar from "./components/msgbar";
import Graph from "./components/network";
import "./App.css";

function App() {
  return (
    <div className={"h-screen w-screen flex flex-col font-sans"}>
      <ToolBar />
      <Graph />
      <MsgBar />
    </div>
  );
}

export default App;
