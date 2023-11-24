import React from "react";
import PubSub from "pubsub-js";
const ToolBar = (props) => {
  const options = ["Add Node", "Add Edge"];
  const handleOptionClick = (index) => {
    return () => {
      if (index === 0) {
        PubSub.publish("activate-add-node", {});
      } else if (index === 1) {
      }
    };
  };

  return (
    <div className={"my-4 space-x-4 flex justify-evenly"}>
      {options.map((op, index) => {
        return (
          <button
            key={index}
            className={
              "transition-all hover:shadow-amber-50 hover:bg-blue-500 hover:rounded-xl hover:border-black p-1"
            }
            onClick={handleOptionClick(index)}
          >
            {op}
          </button>
        );
      })}
    </div>
  );
};

export default ToolBar;
