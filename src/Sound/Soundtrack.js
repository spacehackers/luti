import { useRef, useEffect } from "react";

const fetchTrack = async (audioContext, sampleSource, url) => {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  try {
    sampleSource.buffer = audioBuffer; // eslint-disable-line no-param-reassign
    sampleSource.loopEnd = audioBuffer.duration; // eslint-disable-line no-param-reassign
    sampleSource.loop = true; // eslint-disable-line no-param-reassign
    return true;
  } catch {
    return false;
  }
};

export default (props) => {
  const audioNode = useRef(props.audioContext.createBufferSource());
  const gain = useRef(props.audioContext.createGain());
  const pan = useRef(props.audioContext.createStereoPanner());

  useEffect(() => {
    gain.current.gain.value = props.gain || 1.0;
  }, [props.gain]);

  useEffect(() => {
    pan.current.pan.value = props.pan || 0.0;
  }, [props.pan]);

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
    const f = async () => {
      if (
        !(await fetchTrack(props.audioContext, audioNode.current, props.src))
      ) {
        return;
      }

      props.updateAudio((draft) => {
        draft.push(audioNode.current);
      });

      console.log(
        "SETTING UP TRACK",
        props.id,
        "CONNECTED TO",
        props.destination
      );
      audioNode.current.connect(gain.current);
      gain.current.connect(pan.current);
      props.connectNode(pan.current, props.destination);
      props.setNodes((n) => {
        return { ...n, [props.id]: audioNode.current };
      });
    };
    f();
  }, [props]);
  return null;
};
