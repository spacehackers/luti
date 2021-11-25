import React, { useRef, useEffect } from "react";

const Group = (props) => {
  const inputNode = useRef(props.audioContext.createGain());
  useEffect(() => {
    inputNode.current.gain.value = props.gain || 1;
  }, [props.gain]);

  useEffect(() => {
    if (props.id in props.nodes) {
      return;
    }
    if (
      props.destination !== undefined &&
      !(props.destination in props.nodes)
    ) {
      return;
    }
    console.log(
      "SETTING UP GROUP",
      props.id,
      "CONNECTED TO",
      props.destination
    );
    props.connectNode(inputNode.current, props.destination);

    props.setNodes((n) => {
      return { ...n, [props.id]: inputNode.current };
    });
  }, [props]);
  if (props.children) {
    return React.Children.map(props.children, (child) => {
      const childProps = { ...props };
      childProps.destination = props.id;
      delete childProps.children;
      delete childProps.id;
      return React.cloneElement(child, childProps);
    });
  }
  return null;
};

export default Group;
