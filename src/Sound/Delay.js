import { useRef, useEffect } from "react";

const Delay = (props) => {
  const inputNode = useRef(props.audioContext.createGain());

  const delayNode = useRef(props.audioContext.createDelay());
  useEffect(() => {
    delayNode.current.delayTime.value = props.delay || 0;
  }, [props.delay]);

  const delayPan = useRef(props.audioContext.createStereoPanner());
  useEffect(() => {
    delayPan.current.pan.value = props.pan || 1;
  }, [props.pan]);

  const delayGain = useRef(props.audioContext.createGain());
  useEffect(() => {
    delayGain.current.gain.value = props.gain || 1;
  }, [props.gain]);

  const feedbackGain = useRef(props.audioContext.createGain());
  useEffect(() => {
    feedbackGain.current.gain.value = props.feedback || 0;
  }, [props.feedback]);

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
      "SETTING UP DELAY",
      props.id,
      "CONNECTED TO",
      props.destination
    );
    inputNode.current.connect(delayNode.current);

    delayNode.current.connect(feedbackGain.current);
    feedbackGain.current.connect(delayNode.current);

    delayNode.current.connect(delayGain.current);

    delayGain.current.connect(delayPan.current);

    props.connectNode(delayPan.current, props.destination);
    props.connectNode(inputNode.current, props.destination);

    props.setNodes((n) => {
      return { ...n, [props.id]: inputNode.current };
    });
  }, [props]);
  return null;
};

export default Delay;
