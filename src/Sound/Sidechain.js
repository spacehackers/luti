import React, { useRef, useEffect } from "react";
import useSound from "./useSound";

const Sidechain = ({ id, destination, release, gains, gain, children }) => {
  const { audioContext, connectNodeToId, registerNode, nodes } = useSound();

  const inputNode = useRef();
  const sidechainInputNode = useRef();
  const sidechainWaveshaperNode = useRef();
  const followerNode = useRef();

  useEffect(() => {
    inputNode.current = audioContext.createGain();
    sidechainInputNode.current = audioContext.createGain();

    sidechainWaveshaperNode.current = audioContext.createWaveShaper();
    const curve = new Float32Array(65536);
    for (let i = -32768; i < 32768; i++)
      curve[i + 32768] = -((i > 0 ? i : -i) / 32768);
    sidechainWaveshaperNode.current.curve = curve;

    followerNode.current = audioContext.createBiquadFilter();
    followerNode.current.type = "lowpass";

    sidechainInputNode.current.connect(sidechainWaveshaperNode.current);
    sidechainWaveshaperNode.current.connect(followerNode.current);
    followerNode.current.connect(inputNode.current.gain);
  }, [audioContext]);

  useEffect(() => {
    inputNode.current.gain.value = gain || 0;
  }, [gain]);

  useEffect(() => {
    followerNode.current.frequency.value = release || 10.0;
  }, [release]);

  useEffect(() => {
    if (id in nodes || !(destination in nodes)) return;

    console.log("SETTING UP GROUP", id, "CONNECTED TO", destination);
    connectNodeToId(inputNode.current, destination);
    connectNodeToId(sidechainInputNode.current, destination);
    registerNode(id, sidechainInputNode.current);
    registerNode(`sidechain-group-${id}`, inputNode.current);
  }, [id, nodes, destination, connectNodeToId, registerNode]);

  if (children) {
    return React.Children.map(children, (child) => {
      return React.cloneElement(child, {
        destination: child.props.destination || `sidechain-group-${id}`,
        gain: gains[child.props.id] || child.props.gain,
        gains,
      });
    });
  }

  return null;
};

export default Sidechain;
