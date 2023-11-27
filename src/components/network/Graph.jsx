import React, { useEffect, useRef, useState } from "react";
import { Network } from "vis-network/standalone";
import PubSub from "pubsub-js";
import { ColorPicker, Input, Modal } from "antd";

import "./graph.css";

const Graph = (props) => {

  const { nodes, edges, setAdjList } = props;

  const network = useRef(null);
  const [openLabelEdit, setLabelEditOpen] = useState(false);
  const [newLabel, setNewLabel] = useState(null);
  const [newColor, setNewColor] = useState(null);
  const [nodeId, setNodeId] = useState(null);


  const updateAdjList = () => {
    let adjList = [];
    nodes.forEach((node) => {
      adjList.push({
        id: node.id,
        label: node.label,
        color: node.color ? node.color : "white",
        adj: [],
      });
    });
    edges.forEach((edge) => {
      adjList[edge.from].adj.push(edge.to);
      adjList[edge.to].adj.push(edge.from);
    });
    setAdjList(adjList);
  };

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
        callback(node);
        updateAdjList();
      },
      addEdge: (edge, callback) => {
        callback(edge);
        updateAdjList();
      },
      deleteNode: (data, callback) => {
        data?.nodes.forEach((nodeId) => {
          nodes.remove({ id: nodeId });
        });
        data?.edges.forEach((edgeId) => {
          edges.remove({ id: edgeId });
        });
        updateAdjList();
      },
      deleteEdge: (data, callback) => {
        data.edges.forEach((edgeId) => {
          edges.remove({ id: edgeId });
        });
        updateAdjList();
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
          updateAdjList();
        }
      },
    );

    const addEdgeSubscription = PubSub.subscribe(
      "edge-add-ready",
      (msg, data) => {
        if (data) {
          const { to, from } = data;
          if (!nodes.get(parseInt(to)) || !nodes.get(parseInt(from))) {
            alert("Node does not exist");
            return;
          }
          edges.add(data);
          updateAdjList();
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
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0];
        const currentNode = nodes.get(nodeId);
        showEditDialog(currentNode);
      }
    });
  }, []);

  const showEditDialog = (currentNode) => {
    setNodeId(currentNode?.id);
    setNewLabel(currentNode?.label);
    setNewColor(currentNode?.color ? currentNode?.color : '#ffffff');
    setLabelEditOpen(true);
  };

  const handleLabelChange = (e) => {
    setNewLabel(e.target.value);
  };

  const handleEditDialogCancel = () => {
    setNodeId(null);
    setNewLabel(null);
    setNewColor(null);
    setLabelEditOpen(false);
  };

  const handleEditDialogOk = () => {
    setLabelEditOpen(false);
    if (newLabel) {
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
    <div>
      <div id={"network"}>
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
    </div>
  );
};

export default Graph;
