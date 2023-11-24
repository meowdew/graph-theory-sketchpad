import React, { useEffect, useRef, useState } from "react";
import { DataSet, Network } from "vis-network/standalone";
import PubSub from "pubsub-js";

const Graph = (props) => {
  const [nodes, setNodes] = useState(new DataSet([]));
  const [edges, setEdges] = useState(new DataSet([]));
  const networkRef = useRef(null);

  let options = {
    interaction: {
      hover: true,
    },
    nodes: {
      shape: "circle",
    },
    edges: {},
    manipulation: {
      enabled: true,
      addNode: (node, callback) => {
        node = {
          ...node,
          id: nodes.length + 1,
          label: `Node ${nodes.length + 1}`,
        };
        callback(node); //add
        PubSub.publish("nodes-length", { len: nodes.length });
      },
      addEdge: (edge, callback) => {
        callback(edge); //add
      },
    },
  };

  useEffect(() => {
    const addNodeSubscription = PubSub.subscribe(
      "activate-add-node",
      (msg, data) => {
        if (data) {
          const newNode = {
            id: nodes.length + 1,
            label: `Node ${nodes.length + 1}`,
          };
          nodes.add(newNode);
          PubSub.publish("nodes-length", { len: nodes.length });
        }
      },
    );

    const addEdgeSubscription = PubSub.subscribe(
      "edge-add-ready",
      (msg, data) => {
        edges.add(data);
      },
    );

    return () => {
      PubSub.unsubscribe(addNodeSubscription);
      PubSub.unsubscribe(addEdgeSubscription);
    };
  }, []);

  useEffect(() => {
    const container = document.getElementById("network");
    console.log(`nodes`, nodes);
    console.log(`edges`, edges);
    networkRef.current = new Network(
      container,
      { nodes, edges },
      { ...options },
    );
    networkRef.current.on("click", (params) => {});
  }, []);

  return (
    <div
      id={"network"}
      className={"border-blue-100 border-2 h-5/6 bg-yellow-50 rounded-lg mx-4"}
    ></div>
  );
};

export default Graph;
