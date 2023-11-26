import React, { useEffect, useState } from "react";
import PubSub from "pubsub-js";
import "./msgbar.css";
import Matrix from "../toolbar/matrix/Matrix";

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
      id={"msg-bar"}
      className={"text-center my-2 italic font-mono font-bold text-2xl"}
    >
      <div className={"space-x-8"}>
        <span>{`|V| = ${nodesLength}`}</span>
        <span>{`|E| = ${edgesLength}`}</span>
      </div>
      <Matrix />
    </div>
  );
};

export default MsgBar;
