import React, { useEffect, useState } from "react";
import "./matrix.css";

const Matrix = (props) => {
  const { adjList } = props;

  const [matrix, setMatrix] = useState(adjListToMatrix(adjList));

  useEffect(() => {
    setMatrix(adjListToMatrix(adjList));
  }, [adjList]);

  return (
    <div className={"matrix"}>
      <div className={"matrix-type"}>
        <span>A =</span>
      </div>
      {matrix.map((row, i) => {
        return (
          <div className={"matrix-row"} key={i}>
            {row.map((cell, j) => {
              return (
                <div className={"matrix-cell"} key={j}>
                  {cell}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default Matrix;

function adjListToMatrix(adjList) {
  let matrix = [];
  adjList.forEach((node) => {
    matrix.push(new Array(adjList.length).fill(0));
  });
  adjList.forEach((node) => {
    node.adj.forEach((neighbor) => {
      matrix[node.id][neighbor] = 1;
    });
  });
  return matrix;
}
