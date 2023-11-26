import React, { useEffect, useState } from "react";
import PubSub from "pubsub-js";

const MsgBar = (props) => {
  const [nodesLength, setNodesLength] = useState(0);
  const [edgesLength, setEdgesLength] = useState(0);

  useEffect(() => {
    const nodesLengthSubscription = PubSub.subscribe(
      "nodes-length",
      (msg, data) => {
        setNodesLength(data?.len);
      },
    );

    const edgesLengthSubscription = PubSub.subscribe(
      "edges-length",
      (msg, data) => {
        setEdgesLength(data?.len);
      },
    );

    return () => {
      PubSub.unsubscribe(nodesLengthSubscription);
      PubSub.unsubscribe(edgesLengthSubscription);
    };
  }, []);

  return (
    <div
      className={
        "text-center my-4 space-x-8 italic font-mono font-bold text-2xl"
      }
    >
      <span>{`|V| = ${nodesLength}`}</span>
      <span>{`|E| = ${edgesLength}`}</span>
    </div>
  );
};

export default MsgBar;
