import React, { useEffect, useState } from "react";
import "./msgbar.css";
import Matrix from "../toolbar/matrix/Matrix";

const MsgBar = (props) => {

  const { adjList } = props;

  const [nodesLength, setNodesLength] = useState(0);
  const [edgesLength, setEdgesLength] = useState(0);

  useEffect(() => {
    setNodesLength(adjList.length);
    //count edges
    let count = 0;
    adjList.forEach((node) => {
      count += node?.adj?.length ? node.adj.length : 0;
    });
    setEdgesLength(count / 2);
  }, [adjList]);

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
