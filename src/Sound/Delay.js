import { useRef, useEffect } from "react";
import useSound from "./useSound";

const Delay = ({ id, destination, delay, pan, gain, feedback }) => {
  const { audioContext, nodes, registerNode, connectNodeToId } = useSound();

  const inputNode = useRef();
  const delayNode = useRef();
  const delayPan = useRef();
  const delayGain = useRef();
  const feedbackGain = useRef();

  useEffect(() => {
    inputNode.current = audioContext.createGain();
    delayNode.current = audioContext.createDelay();
    delayPan.current = audioContext.createStereoPanner();
    delayGain.current = audioContext.createGain();
    feedbackGain.current = audioContext.createGain();
  }, [audioContext]);

  useEffect(() => {
    delayNode.current.delayTime.value = delay || 0;
  }, [delay]);

  useEffect(() => {
    delayPan.current.pan.value = pan || 0;
  }, [pan]);

  useEffect(() => {
    delayGain.current.gain.value = gain || 0;
  }, [gain]);

  useEffect(() => {
    feedbackGain.current.gain.value = feedback || 0;
  }, [feedback]);

  useEffect(() => {
    if (id in nodes || !(destination in nodes)) return;
    console.log("SETTING UP DELAY", id, "CONNECTED TO", destination);
    inputNode.current.connect(delayNode.current);

    delayNode.current.connect(feedbackGain.current);
    feedbackGain.current.connect(delayNode.current);

    delayNode.current.connect(delayGain.current);

    delayGain.current.connect(delayPan.current);

    connectNodeToId(delayPan.current, destination);
    connectNodeToId(inputNode.current, destination);
    registerNode(id, inputNode.current);
  }, [id, nodes, destination, connectNodeToId, registerNode]);
  return null;
};

export default Delay;
