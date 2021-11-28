import React, { useRef, useEffect } from "react";

const Sidechain = (props) => {
  const inputNode = useRef();
  const sidechainInputNode = useRef();
  const sidechainWaveshaperNode = useRef();
  const followerNode = useRef();

  useEffect(() => {
    inputNode.current = props.audioContext.createGain();
  }, [props.audioContext]);

  useEffect(() => {
    inputNode.current.gain.value = props.gain || 0;
  }, [props.gain]);

  useEffect(() => {
    sidechainInputNode.current = props.audioContext.createGain();

    sidechainWaveshaperNode.current = props.audioContext.createWaveShaper();
    const curve = new Float32Array(65536);
    for (let i = -32768; i < 32768; i++)
      curve[i + 32768] = -((i > 0 ? i : -i) / 32768);
    sidechainWaveshaperNode.current.curve = curve;

    followerNode.current = props.audioContext.createBiquadFilter();
    followerNode.current.type = "lowpass";

    sidechainInputNode.current.connect(sidechainWaveshaperNode.current);
    sidechainWaveshaperNode.current.connect(followerNode.current);
    followerNode.current.connect(inputNode.current.gain);
  }, [props.audioContext]);

  useEffect(() => {
    followerNode.current.frequency.value = props.release || 10.0;
  }, [props.release]);

  const { id, nodes, destination, setNodes } = props;
  useEffect(() => {
    if (id in nodes) {
      return;
    }
    if (!destination) {
      return;
    }

    setNodes((n) => {
      console.log("SETTING UP SIDECHAIN", id, "CONNECTED TO", destination);
      inputNode.current.connect(destination);
      // sidechainInputNode.current.connect(destination);
      return { ...n, [id]: sidechainInputNode.current };
    });
  }, [id, nodes, destination, setNodes]);

  if (props.children) {
    const inheritedProps = [
      "audioContext",
      "nodes",
      "setNodes",
      "setAudio",
      "playing",
    ];
    return React.Children.map(props.children, (child) => {
      const childProps = { destination: inputNode.current };
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

export default Sidechain;
