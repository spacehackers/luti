import { useRef, useEffect, useMemo } from "react";
import throttle from "lodash/throttle";
import useSound from "./useSound";

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
    console.log("ACCIDENTALLY DOUBLE-LOADED", url);
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

export default ({ src, id, destination, gain, pan }) => {
  const audioNode = useRef();
  const audioLoaded = useRef(false);
  const gainNode = useRef();
  const panNode = useRef();
  const {
    audioContext,
    nodes,
    removeNode,
    registerNode,
    playAudio,
    cancelAudio,
    connectNodeToId,
  } = useSound();

  const setAudioParamValue = useMemo(
    () => setAudioParamValueForContext(audioContext),
    [audioContext]
  );

  useEffect(() => {
    audioNode.current = audioContext.createBufferSource();
    gainNode.current = audioContext.createGain();
    panNode.current = audioContext.createStereoPanner();
  }, [audioContext]);

  useEffect(() => {
    setAudioParamValue(gainNode.current.gain, gain || 0.0);
  }, [gain, setAudioParamValue]);

  useEffect(() => {
    setAudioParamValue(panNode.current.pan, pan || 0.0);
  }, [pan, setAudioParamValue]);

  useEffect(() => {
    if (id in nodes) {
      return;
    }
    if (!(destination in nodes)) {
      return;
    }
    if (audioLoaded.current) {
      return;
    }
    const f = async () => {
      if (!(await fetchTrack(audioContext, audioNode.current, src))) {
        return;
      }

      playAudio(audioNode.current);

      console.log("SETTING UP TRACK", id, "CONNECTED TO", destination);
      audioNode.current.connect(gainNode.current);
      gainNode.current.connect(panNode.current);
      connectNodeToId(panNode.current, destination);
      registerNode(id, audioNode.current);
    };
    audioLoaded.current = true;
    f();
  }, [
    audioContext,
    connectNodeToId,
    destination,
    id,
    nodes,
    playAudio,
    registerNode,
    src,
  ]);
  useEffect(() => {
    return () => {
      cancelAudio(audioNode.current);
      removeNode(id);
      audioLoaded.current = false;
      console.log("CLEANUP", src);
    };
  }, [cancelAudio, removeNode, id, src]);
  return null;
};
