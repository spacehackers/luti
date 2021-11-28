import { useRef, useEffect } from "react";

const Delay = (props) => {
  const inputNode = useRef();
  const delayNode = useRef();
  const delayPan = useRef();
  const delayGain = useRef();
  const feedbackGain = useRef();

  useEffect(() => {
    inputNode.current = props.audioContext.createGain();
    delayNode.current = props.audioContext.createDelay();
    delayPan.current = props.audioContext.createStereoPanner();
    delayGain.current = props.audioContext.createGain();
    feedbackGain.current = props.audioContext.createGain();
  }, [props.audioContext]);

  useEffect(() => {
    delayNode.current.delayTime.value = props.delay || 0;
  }, [props.delay]);

  useEffect(() => {
    delayPan.current.pan.value = props.pan || 0;
  }, [props.pan]);

  useEffect(() => {
    delayGain.current.gain.value = props.gain || 0;
  }, [props.gain]);

  useEffect(() => {
    feedbackGain.current.gain.value = props.feedback || 0;
  }, [props.feedback]);

  const { id, nodes, destination, setNodes } = props;
  useEffect(() => {
    if (id in nodes) {
      return;
    }
    if (!destination) {
      return;
    }

    setNodes((n) => {
      console.log("SETTING UP DELAY", id, "CONNECTED TO", destination);
      inputNode.current.connect(delayNode.current);

      delayNode.current.connect(feedbackGain.current);
      feedbackGain.current.connect(delayNode.current);

      delayNode.current.connect(delayGain.current);

      delayGain.current.connect(delayPan.current);

      delayPan.current.connect(destination);
      inputNode.current.connect(destination);

      return { ...n, [id]: inputNode.current };
    });
  }, [id, nodes, destination, setNodes]);
  return null;
};

export default Delay;
