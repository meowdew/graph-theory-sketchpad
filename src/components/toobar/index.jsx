import React from "react";
import PubSub from "pubsub-js";

import "./index.css";

const ToolBar = (props) => {
  const options = ["Add Node", "Add Edge"];
  const handleOptionClick = (op) => {
    return () => {
      if (op === "Add Node") {
        PubSub.publish("activate-add-node", {});
      } else if (op === "Add Edge") {
        PubSub.publish("activate-edge-node", {});
      }
    };
  };

  return (
    <div
      className={"toolbar my-4 space-x-4 flex justify-start mx-4 border-b-2"}
    >
      {options.map((op, index) => {
        return (
          <button
            key={index}
            className={
              "p-1 shadow-black font-medium rounded-sm transition-all hover:shadow-amber-50 hover:bg-blue-500 hover:rounded-xl hover:border-black"
            }
            onClick={handleOptionClick(op)}
          >
            {op}
          </button>
        );
      })}
    </div>
  );
};

export default ToolBar;
