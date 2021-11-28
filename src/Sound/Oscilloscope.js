import React, { useCallback, useRef, useEffect } from "react";
import { Oscilloscope } from "webaudio-oscilloscope";

const Osc = (props) => {
  const inputNode = useRef();
  const osc = useRef();

  const setupOsc = useCallback(
    (cvs) => {
      console.log("OSC SETUP", props.audioContext);
      inputNode.current = props.audioContext.createGain();
      osc.current = new Oscilloscope(
        props.audioContext,
        inputNode.current,
        cvs
      );
      osc.current.start();
    },
    [props.audioContext]
  );

  const { id, nodes, destination, setNodes } = props;
  useEffect(() => {
    if (id in nodes) {
      return;
    }
    if (!destination) {
      return;
    }

    setNodes((n) => {
      console.log("SETTING UP OSC", id, "CONNECTED TO", destination);
      inputNode.current.connect(destination);
      return { ...n, [id]: inputNode.current };
    });
  }, [id, nodes, destination, setNodes]);
  return (
    <canvas
      id={props.id}
      className="osc"
      style={{ height: props.height || 160, width: props.width || 240 }}
      ref={setupOsc}
    />
  );
};

export default Osc;
