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
  const audioNode = useRef();
  const gain = useRef();
  const pan = useRef();

  useEffect(() => {
    audioNode.current = props.audioContext.createBufferSource();
    gain.current = props.audioContext.createGain();
    pan.current = props.audioContext.createStereoPanner();
  }, [props.audioContext]);

  useEffect(() => {
    gain.current.gain.value = props.gain || 1.0;
  }, [props.gain]);

  useEffect(() => {
    pan.current.pan.value = props.pan || 0.0;
  }, [props.pan]);

  const {
    audioContext,
    src,
    setAudio,
    id,
    nodes,
    destination,
    setNodes,
  } = props;
  useEffect(() => {
    if (id in nodes) {
      return;
    }
    if (!destination) {
      return;
    }
    const f = async () => {
      if (!(await fetchTrack(audioContext, audioNode.current, src))) {
        return;
      }

      setAudio((a) => {
        return [...a, audioNode.current];
      });

      setNodes((n) => {
        console.log("SETTING UP TRACK", id, "CONNECTED TO", destination);
        audioNode.current.connect(gain.current);
        gain.current.connect(pan.current);
        pan.current.connect(destination);
        return { ...n, [id]: audioNode.current };
      });
    };
    f();
  }, [audioContext, src, setAudio, id, nodes, destination, setNodes]);
  return null;
};
