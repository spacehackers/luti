import React, { useCallback, useRef, useEffect } from "react";
import { Oscilloscope } from "webaudio-oscilloscope";
import useSound from "./useSound";

const Osc = ({ id, destination, height, width }) => {
  const { audioContext, nodes, registerNode, connectNodeToId } = useSound();

  const inputNode = useRef();
  const osc = useRef();

  const setupOsc = useCallback(
    (cvs) => {
      console.log("OSC SETUP", audioContext);
      inputNode.current = audioContext.createGain();
      osc.current = new Oscilloscope(audioContext, inputNode.current, cvs);
      osc.current.start();
    },
    [audioContext]
  );

  useEffect(() => {
    if (id in nodes || !(destination in nodes)) return;

    console.log("SETTING UP OSC", id, "CONNECTED TO", destination);
    connectNodeToId(inputNode.current, destination);
    registerNode(id, inputNode.current);
  }, [id, nodes, connectNodeToId, destination, registerNode]);
  return (
    <canvas
      id={id}
      className="osc"
      style={{ height: height || 160, width: width || 240 }}
      ref={setupOsc}
    />
  );
};

export default Osc;
