import React, { useEffect, useRef, useState } from "react";
import { DataSet, Network } from "vis-network/standalone";
import PubSub from "pubsub-js";
import { ColorPicker, Input, Modal } from "antd";

import "./index.css";

const Graph = (props) => {
  const nodes = useRef(new DataSet([])).current;
  const edges = useRef(new DataSet([])).current;
  const network = useRef(null);
  const [openLabelEdit, setLabelEditOpen] = useState(false);
  const [newLabel, setNewLabel] = useState(null);
  const [newColor, setNewColor] = useState(null);
  const [nodeId, setNodeId] = useState(null);
  const [edgeId, setEdgeId] = useState(null);

  let options = {
    interaction: {
      hover: true,
    },
    nodes: {
      shape: "circle",
      margin: 20,
      color: {
        background: "white",
        border: "black",
      },
      borderWidth: 2,
      title: "Node",
    },
    edges: {
      color: {
        color: "#0ee",
        inherit: false,
      },
    },
    manipulation: {
      enabled: true,
      addNode: (node, callback) => {
        nodes.length === 0
          ? (node = { id: 0, label: " 0 ", title: `Node id=0` })
          : (node = {
              id: nodes.getIds()[nodes.length - 1] + 1,
              label: ` ${nodes.getIds()[nodes.length - 1] + 1} `,
              title: `Node id=${nodes.get()[nodes.length - 1]?.id + 1}`,
            });
        callback(node); //add
        PubSub.publish("nodes-length", { len: nodes.length });
      },
      addEdge: (edge, callback) => {
        callback(edge); //add
        PubSub.publish("edges-length", { len: edges.length });
      },
      deleteNode: (data, callback) => {
        console.log(data);
        data?.nodes.forEach((nodeId) => {
          nodes.remove({ id: nodeId });
        });
        data?.edge.forEach((edgeId) => {
          edges.remove({ id: edgeId });
        });
        PubSub.publish("nodes-length", { len: nodes.length });
        PubSub.publish("edges-length", { len: edges.length });
      },
      deleteEdge: (data, callback) => {
        data.edges.forEach((edgeId) => {
          edges.remove({ id: edgeId });
        });
        PubSub.publish("edges-length", { len: edges.length });
      },
    },
    physics: {
      enabled: true,
    },
  };

  useEffect(() => {
    const addNodeSubscription = PubSub.subscribe(
      "add-node-ready",
      (msg, data) => {
        if (data) {
          let newNode = {};
          nodes.length === 0
            ? (newNode = { id: 0, label: " 0 ", title: `Node id=0` })
            : (newNode = {
                id: nodes.getIds()[nodes.length - 1] + 1,
                label: ` ${nodes.getIds()[nodes.length - 1] + 1} `,
                title: `Node id=${nodes.get()[nodes.length - 1]?.id + 1}`,
              });
          nodes.add(newNode);
          PubSub.publish("nodes-length", { len: nodes.length });
        }
      },
    );

    const addEdgeSubscription = PubSub.subscribe(
      "edge-add-ready",
      (msg, data) => {
        if (data) {
          edges.add(data);
          PubSub.publish("edges-length", { len: edges.length });
        }
      },
    );

    const setStabilizationSubscription = PubSub.subscribe(
      "toggle-physics",
      (msg, data) => {
        if (data) {
          network.current.setOptions({
            physics: {
              enabled: data?.toggle,
            },
          });
        }
      },
    );
    return () => {
      PubSub.unsubscribe(addNodeSubscription);
      PubSub.unsubscribe(addEdgeSubscription);
      PubSub.unsubscribe(setStabilizationSubscription);
    };
  }, []);

  useEffect(() => {
    const container = document.getElementById("network");
    network.current = new Network(container, { nodes, edges }, { ...options });

    network.current.on("doubleClick", (params) => {
      //double click a node
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0];
        const currentNode = nodes.get(nodeId);
        showEditDialog(nodeId);
      }
    });
  }, []);

  const showEditDialog = (nodeId) => {
    setLabelEditOpen(true);
    setNodeId(nodeId);
  };

  const handleLabelChange = (e) => {
    setNewLabel(e.target.value);
  };

  const handleEditDialogCancel = () => {
    setNewLabel(null);
    setNodeId(null);
    setLabelEditOpen(false);
  };

  const handleEditDialogOk = () => {
    setLabelEditOpen(false);
    if (newLabel !== null) {
      if (newColor) {
        nodes.update({
          id: nodeId,
          label: newLabel,
          color: newColor.toHexString(),
        });
      } else nodes.update({ id: nodeId, label: newLabel });
    } else alert("Please enter a label");
    setNodeId(null);
    setNewLabel(null);
    setNewColor(null);
  };

  const handleColorChange = (color) => {
    setNewColor(color);
  };

  return (
    <div
      id={"network"}
      className={"border-blue-100 border-2 h-5/6 bg-yellow-50 rounded-lg mx-4"}
    >
      <Modal
        title={"Edit Node"}
        className={"node-edit-dialog"}
        open={openLabelEdit}
        onCancel={handleEditDialogCancel}
        onOk={handleEditDialogOk}
        centered
      >
        <Input
          prefix={<p>Label</p>}
          onChange={handleLabelChange}
          placeholder={"Please enter your new label"}
          value={newLabel}
          required
        />
        <div className={"mt-1 space-x-4 ml-3"}>
          <span className={"align-super"}>Color</span>
          <ColorPicker
            onChangeComplete={handleColorChange}
            value={newColor}
            showText={true}
            format={"hex"}
          />
        </div>
      </Modal>
    </div>
  );
};

export default Graph;
