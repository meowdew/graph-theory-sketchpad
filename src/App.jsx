import React from "react";
import ToolBar from "./components/toolbar/Toolbar";
import MsgBar from "./components/msgbar/Msgbar";
import Graph from "./components/network/Graph";
import "./App.css";

function App() {
  return (
    <div className={"h-screen w-screen flex flex-col font-sans bg-yellow-50"}>
      <ToolBar />
      <Graph />
      <MsgBar />
    </div>
  );
}

export default App;
