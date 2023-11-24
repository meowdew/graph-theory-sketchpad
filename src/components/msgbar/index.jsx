import React, { useEffect, useState } from "react";
import PubSub from "pubsub-js";

const MsgBar = (props) => {
  const [nodesLength, setNodesLength] = useState(0);

  useEffect(() => {
    const nodesLengthSubscription = PubSub.subscribe(
      "nodes-length",
      (msg, data) => {
        setNodesLength(data?.len);
      },
    );
    return () => {
      PubSub.unsubscribe(nodesLengthSubscription);
    };
  }, []);

  return (
    <div className={"text-center my-4"}>
      <span>{`Node Count ${nodesLength}`}</span>
    </div>
  );
};

export default MsgBar;
