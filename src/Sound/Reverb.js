import { useRef, useEffect } from "react";
import Tuna from "tunajs";
import useSound from "./useSound";

const Reverb = ({ src, id, destination, highCut, lowCut, gain }) => {
  const reverbNode = useRef();

  const { audioContext, nodes, registerNode, connectNodeToId } = useSound();
  useEffect(() => {
    const tuna = new Tuna(audioContext);
    reverbNode.current = new tuna.Convolver({
      highCut,
      lowCut,
      dryLevel: 0,
      wetLevel: 1,
      level: gain === undefined ? 1 : gain,
      impulse: src,
      bypass: 0,
    });
  }, [highCut, lowCut, gain, src, audioContext]);

  useEffect(() => {
    if (id in nodes || !(destination in nodes)) return;

    console.log("SETTING UP REVERB", id, "CONNECTED TO", destination);
    connectNodeToId(reverbNode.current, destination);
    registerNode(id, reverbNode.current);
  }, [id, nodes, destination, connectNodeToId, registerNode]);
  return null;
};

export default Reverb;
