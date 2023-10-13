import { useRef, useEffect } from "react";
import Tuna from "tunajs";
import useSound from "./useSound";

const Delay = ({ id, destination, cutoff, feedback, delayTime, gain }) => {
  const delayNode = useRef();

  const { audioContext, nodes, registerNode, connectNodeToId } = useSound();
  useEffect(() => {
    const tuna = new Tuna(audioContext);
    delayNode.current = new tuna.Delay({
      delayTime,
      cutoff: cutoff || 22050,
      feedback: feedback === undefined ? 0.0 : gain,
      wetLevel: gain === undefined ? 1.0 : gain,
      dryLevel: 1,
      bypass: 0,
    });
  }, [feedback, cutoff, delayTime, gain, audioContext]);

  useEffect(() => {
    if (id in nodes || !(destination in nodes)) return;

    console.log("SETTING UP DELAY", id, "CONNECTED TO", destination);
    connectNodeToId(delayNode.current, destination);
    registerNode(id, delayNode.current);
  }, [id, nodes, destination, connectNodeToId, registerNode]);
  return null;
};

export default Delay;
