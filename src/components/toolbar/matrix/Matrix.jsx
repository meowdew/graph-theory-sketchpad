import React, { useEffect, useState } from "react";
import PubSub from "pubsub-js";
import "./matrix.css";

const Matrix = (props) => {
  const [adjList, setAdjList] = useState([]);
  const [degreeSequence, setDegreeSequence] = useState([]);

  useEffect(() => {
    const adjacencyMatrixSubscription = PubSub.subscribe(
      "adjacency-matrix",
      (msg, data) => {},
    );
    const incidenceMatrixSubscription = PubSub.subscribe(
      "incidence-matrix",
      (msg, data) => {},
    );
    const adjacencyListSubscription = PubSub.subscribe(
      "adj-list",
      (msg, data) => {
        setAdjList(data);
      },
    );
    const degreeSequenceSubscription = PubSub.subscribe(
      "degree-sequence",
      (msg, data) => {
        if (data && adjList) {
          // console.log(data, adjList);
          // const newDegreeSequence = adjList.map((adj) => adj.length);
          // setDegreeSequence(newDegreeSequence);
        }
      },
    );

    return () => {
      PubSub.unsubscribe(adjacencyMatrixSubscription);
      PubSub.unsubscribe(incidenceMatrixSubscription);
      PubSub.unsubscribe(adjacencyListSubscription);
    };
  }, [adjList]);

  return degreeSequence.length > 0 ? (
    <div>
      <p>Degree Sequence</p>
      <table>
        <tbody>
          <tr>
            {degreeSequence.map((degree, index) => (
              <td key={index}>{degree}</td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  ) : (
    <div></div>
  );
};

export default Matrix;
