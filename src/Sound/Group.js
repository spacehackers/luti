import React, { useRef, useEffect } from "react";
import useSound from "./useSound";

const Group = ({ id, destination, gains, gain, children }) => {
  const inputNode = useRef();
  const { audioContext, connectNodeToId, registerNode, nodes } = useSound();

  useEffect(() => {
    inputNode.current = audioContext.createGain();
  }, [audioContext]);

  useEffect(() => {
    inputNode.current.gain.value = gain || 0;
  }, [gain]);

  useEffect(() => {
    if (id in nodes || !(destination in nodes)) return;

    console.log("SETTING UP GROUP", id, "CONNECTED TO", destination);
    connectNodeToId(inputNode.current, destination);
    registerNode(id, inputNode.current);
  }, [id, nodes, destination, connectNodeToId, registerNode]);

  if (children) {
    return React.Children.map(children, (child) => {
      return React.cloneElement(child, {
        destination: child.props.destination || id,
        gain: gains[child.props.id] || child.props.gain,
        gains,
      });
    });
  }
  return null;
};

export default Group;
