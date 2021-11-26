import React, { useRef, useEffect } from "react";

const Group = (props) => {
  const inputNode = useRef();

  useEffect(() => {
    inputNode.current = props.audioContext.createGain();
  }, [props.audioContext]);

  useEffect(() => {
    inputNode.current.gain.value = props.gain || 1;
  }, [props.gain]);

  const { id, nodes, destination, setNodes } = props;
  useEffect(() => {
    if (id in nodes) {
      return;
    }
    if (!destination) {
      return;
    }

    setNodes((n) => {
      console.log("SETTING UP GROUP", id, "CONNECTED TO", destination);
      inputNode.current.connect(destination);
      return { ...n, [id]: inputNode.current };
    });
  }, [id, nodes, destination, setNodes]);

  if (props.children) {
    return React.Children.map(props.children, (child) => {
      const childProps = { ...props };
      if ("destination" in child.props) {
        childProps.destination = props.nodes[child.props.destination];
      } else {
        childProps.destination = props.destination;
      }
      delete childProps.children;
      delete childProps.id;
      return React.cloneElement(child, childProps);
    });
  }
  return null;
};

export default Group;
