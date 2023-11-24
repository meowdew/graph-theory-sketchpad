import React, { useState } from "react";
import PubSub from "pubsub-js";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { Input, Modal } from "antd";
import "./index.css";

const ToolBar = (props) => {
  const options = ["Add Node", "Add Edge"];

  const [openEdgeDialog, setOpenEdgeDialog] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(0);
  const handleOptionClick = (op) => {
    return () => {
      if (op === "Add Node") {
        PubSub.publish("activate-add-node", {});
      } else if (op === "Add Edge") {
        setOpenEdgeDialog(true);
      }
    };
  };

  const handleCancel = () => {
    setOpenEdgeDialog(false);
  };

  const handleConfirm = () => {
    PubSub.publish("edge-add-ready", { from: startIndex, to: endIndex });
    setOpenEdgeDialog(false);
  };

  const handleStartIndexChange = (e) => {
    setStartIndex(e.target.value);
  };

  const handleEndIndexChange = (e) => {
    setEndIndex(e.target.value);
  };

  return (
    <div
      className={
        "toolbar my-4 space-x-4 flex justify-start mx-4 border-b-2 border-blue-200"
      }
    >
      {options.map((op, index) => {
        return (
          <button
            key={index}
            className={"toolbar-btn"}
            onClick={handleOptionClick(op)}
          >
            <AddRoundedIcon />
            {op}
          </button>
        );
      })}
      <Modal
        title={"Please enter edge details"}
        open={openEdgeDialog}
        onCancel={handleCancel}
        onOk={handleConfirm}
      >
        <Input
          prefix={<p>Start Node Id:</p>}
          placeholder={"Please enter start node id"}
          type={"number"}
          defaultValue={0}
          min={0}
          max={10}
          maxLength={99}
          required={true}
          onChange={handleStartIndexChange}
        />
        <Input
          prefix={<p>End Node Id:</p>}
          placeholder={"Please enter end node id"}
          type={"number"}
          defaultValue={0}
          min={0}
          max={10}
          maxLength={99}
          required={true}
          onChange={handleEndIndexChange}
        />
      </Modal>
    </div>
  );
};

export default ToolBar;
