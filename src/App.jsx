import React, { useRef, useState } from "react";
import ToolBar from "./components/toolbar/Toolbar";
import MsgBar from "./components/msgbar/Msgbar";
import Graph from "./components/network/Graph";
import { DataSet } from "vis-network/standalone";
import "./App.css";

function App() {
  const nodes = useRef(new DataSet([])).current;
  const edges = useRef(new DataSet([])).current;
  const [adjList, setAdjList] = useState([]);
  const [autoStabilization, setAutoStabilization] = useState(true);

  return (
    <div className={"h-screen w-screen flex flex-col font-sans bg-yellow-50"}>
      <ToolBar setAutoStabilization={setAutoStabilization} autoStabilization={autoStabilization}/>
      <Graph nodes={nodes} edges={edges} adjList={adjList} setAdjList={setAdjList}  autoStabilization={autoStabilization}/>
      <MsgBar nodes={nodes} edge={edges} adjList={adjList} />
    </div>
  );
}

export default App;
