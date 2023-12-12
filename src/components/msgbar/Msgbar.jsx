import React, { useEffect, useState } from "react";
import "./msgbar.css";
import Matrix from "../toolbar/matrix/Matrix";

const MsgBar = (props) => {
  const { adjList } = props;

  const [nodesLength, setNodesLength] = useState(0);
  const [edgesLength, setEdgesLength] = useState(0);
  const [degreeList, setDegreeList] = useState([]);
  const [components, setComponents] = useState(0);

  useEffect(() => {
    setNodesLength(adjList.length);
    //count edges
    let count = 0;
    adjList.forEach((node) => {
      count += node?.adj?.length ? node.adj.length : 0;
    });
    setEdgesLength(count / 2);
    setDegreeList(adjList.map((node) => node.adj.length));
    setComponents(countComponents(adjList));
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
      <div>Components: {`${components}`}</div>
      <div>Degree List:{`${JSON.stringify(degreeList)}`}</div>
      <Matrix adjList={adjList} />
    </div>
  );
};

export default MsgBar;

function countComponents(adjList) {
  let visited = new Array(adjList.length).fill(false);
  let count = 0;
  for (let i = 0; i < adjList.length; i++) {
    if (!visited[i]) {
      count++;
      dfs(i, adjList, visited);
    }
  }
  return count;
}

function dfs(node, adjList, visited) {
  visited[node] = true;
  adjList[node].adj.forEach((neighbor) => {
    if (!visited[neighbor]) {
      dfs(neighbor, adjList, visited);
    }
  });
}
