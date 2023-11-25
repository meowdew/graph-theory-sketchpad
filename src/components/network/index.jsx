import React, { useEffect, useRef, useState } from "react";
import { DataSet, Network } from "vis-network/standalone";
import PubSub from "pubsub-js";
import { Input, Modal } from "antd";

const Graph = (props) => {
  const nodes = useRef(new DataSet([])).current;
  const edges = useRef(new DataSet([])).current;
  const network = useRef(null);
  const [openLabelEdit, setLabelEditOpen] = useState(false);
  const [newLabel, setNewLabel] = useState(null);
  const [nodeId, setNodeId] = useState(null);

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
        nodes.length === 0
          ? (node = { id: 0, label: "0" })
          : (node = {
              id: nodes.getIds()[nodes.length - 1] + 1,
              label: ` ${nodes.getIds()[nodes.length - 1] + 1} `,
            });
        callback(node); //add
        PubSub.publish("nodes-length", { len: nodes.length });
      },
      addEdge: (edge, callback) => {
        edge = {
          ...edge,
          from: parseInt(edge.from),
          to: parseInt(edge.to),
        };
        callback(edge); //add
      },
      deleteNode: (data, callback) => {
        if (data.nodes.length > 0) {
          data.nodes.forEach((nodeId) => {
            nodes.remove({ id: nodeId });
            data.edges.forEach((edge) => {
              if (edge.from === nodeId || edge.to === nodeId) {
                edges.remove({ id: edge.id });
              }
            });
          });
        }
        PubSub.publish("nodes-length", { len: nodes.length });
      },
    },
  };

  useEffect(() => {
    const addNodeSubscription = PubSub.subscribe(
      "activate-add-node",
      (msg, data) => {
        if (data) {
          let newNode = {};
          nodes.length === 0
            ? (newNode = { id: 0, label: "0" })
            : (newNode = {
                id: nodes.getIds()[nodes.length - 1] + 1,
                label: ` ${nodes.getIds()[nodes.length - 1] + 1} `,
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
        }
      },
    );

    return () => {
      PubSub.unsubscribe(addNodeSubscription);
      PubSub.unsubscribe(addEdgeSubscription);
    };
  }, []);

  useEffect(() => {
    const container = document.getElementById("network");
    network.currnet = new Network(container, { nodes, edges }, { ...options });

    network.currnet.on("doubleClick", (params) => {
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
    nodes.update({ id: nodeId, label: newLabel });
    setNodeId(null);
    setNewLabel(null);
  };

  return (
    <div
      id={"network"}
      className={"border-blue-100 border-2 h-5/6 bg-yellow-50 rounded-lg mx-4"}
    >
      <Modal
        title={"Edit Node Label"}
        className={"node-label-edit"}
        open={openLabelEdit}
        onCancel={handleEditDialogCancel}
        onOk={handleEditDialogOk}
      >
        <Input
          onChange={handleLabelChange}
          placeholder={"Please enter your new label"}
          value={newLabel}
        />
      </Modal>
    </div>
  );
};

export default Graph;
