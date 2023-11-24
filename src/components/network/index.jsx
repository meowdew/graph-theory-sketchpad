import React, { useEffect, useState } from "react";
import { DataSet, Network } from "vis-network/standalone";
import PubSub from "pubsub-js";
const Graph = (props) => {
  const [nodes, setNodes] = useState([{}]);
  const [edges, setEdges] = useState([]);
  const [graph, setGraph] = useState(null);
  const [activateNode, setActivateNode] = useState(false);

  let network;

  const option = {
    interaction: true,
    manipulation: {
      enable: true,
      addNode: (nodes, setNodes) => {
        const id = nodes.length + 1;
        const label = `Node ${id}`;
        const node = { id: id, label: label };
        setNodes([...nodes, node]);
      },
    },
    nodes: {
      shape: "circle",
    },
  };

  useEffect(() => {
    const addNode = PubSub.subscribe("activate-add-node", () => {
      setActivateNode(!activateNode);
    });
    return () => {
      PubSub.unsubscribe(addNode);
    };
  }, []);

  useEffect(() => {
    let data = {
      nodes: new DataSet(nodes),
      edges: new DataSet(edges),
    };

    const container = document.getElementById("network");
    network = new Network(container, data, {});
    network.on("click", (params) => {
      console.log("click event");
    });
  }, [nodes, edges, graph]);

  return (
    <div
      id={"network"}
      className={"border-blue-100 border-2 h-5/6 bg-yellow-50 rounded-lg mx-4"}
    ></div>
  );
};

export default Graph;
