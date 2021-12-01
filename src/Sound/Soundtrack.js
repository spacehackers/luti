import { useRef, useEffect, useMemo } from "react";
import throttle from "lodash/throttle";

const fetchTrack = async (audioContext, sampleSource, url) => {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  try {
    sampleSource.buffer = audioBuffer; // eslint-disable-line no-param-reassign
    sampleSource.loopEnd = audioBuffer.duration; // eslint-disable-line no-param-reassign
    sampleSource.loop = true; // eslint-disable-line no-param-reassign
    sampleSource.src = url; // eslint-disable-line no-param-reassign

    console.log("LOADED", url, audioBuffer.duration);
    return true;
  } catch {
    return false;
  }
};

const THROTTLE_TIME = 0.25;
const setAudioParamValueForContext = (audioContext) =>
  throttle((param, value) => {
    param.linearRampToValueAtTime(
      value,
      audioContext.currentTime + THROTTLE_TIME
    );
  }, 1000 * THROTTLE_TIME);

export default (props) => {
  const audioNode = useRef();
  const gain = useRef();
  const pan = useRef();
  const setAudioParamValue = useMemo(
    () => setAudioParamValueForContext(props.audioContext),
    [props.audioContext]
  );

  useEffect(() => {
    audioNode.current = props.audioContext.createBufferSource();
    gain.current = props.audioContext.createGain();
    pan.current = props.audioContext.createStereoPanner();
  }, [props.audioContext]);

  useEffect(() => {
    setAudioParamValue(gain.current.gain, props.gain || 0.0);
  }, [props.gain, setAudioParamValue]);

  useEffect(() => {
    setAudioParamValue(pan.current.pan, props.pan || 0.0);
  }, [props.pan, setAudioParamValue]);

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
