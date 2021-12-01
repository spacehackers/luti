import React, { useRef, useEffect } from "react";

const Group = (props) => {
  const inputNode = useRef();

  useEffect(() => {
    inputNode.current = props.audioContext.createGain();
  }, [props.audioContext]);

  useEffect(() => {
    inputNode.current.gain.value = props.gain || 0;
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
    const inheritedProps = [
      "audioContext",
      "nodes",
      "setNodes",
      "setAudio",
      "playing",
      "gains",
    ];
    return React.Children.map(props.children, (child) => {
      const childProps = {
        destination: inputNode.current,
        gain: props.gains[child.props.id] || child.props.gain,
      };
      if ("destination" in child.props) {
        childProps.destination = props.nodes[child.props.destination];
      }
      inheritedProps.forEach((p) => {
        childProps[p] = props[p];
      });
      return React.cloneElement(child, childProps);
    });
  }
  return null;
};

export default Group;
