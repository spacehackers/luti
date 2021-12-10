import { useRef, useCallback, useState, useEffect } from "react";
import { useBetween } from "use-between";
import WAAClock from "waaclock";
import omit from "lodash/omit";

const useSound = () => {
  const audioContext = useRef(null);
  const audioClock = useRef(null);
  const barTimer = useRef(null);

  const [nodes, setNodes] = useState({});
  const [playing, setPlaying] = useState(false);
  const [playQueue, setPlayQueue] = useState([]); // eslint-disable-line no-unused-vars

  const [barLength, setBarLength] = useState(null);

  const onPlay = useRef(() => {});
  const setOnPlay = (f) => {
    onPlay.current = f;
  };

  const removeNode = useCallback((id) => {
    setNodes((ns) => omit(ns, id));
  }, []);

  const registerNode = useCallback((id, node) => {
    setNodes((ns) => ({ ...ns, [id]: node }));
  }, []);

  const connectNodeToId = useCallback(
    (node, destinationId, gain) => {
      let srcNode = node;
      if (gain !== undefined && gain < 1) {
        srcNode = audioContext.current.createGain();
        srcNode.gain.value = gain;
        node.connect(srcNode);
      }
      srcNode.connect(nodes[destinationId]);
    },
    [nodes]
  );

  const playAudio = useCallback((node) => {
    setPlayQueue((a) => {
      return [...a, node];
    });
  }, []);
  const cancelAudio = playAudio;

  const playNextAudio = useCallback(
    // to be called once per bar by the audio clock
    (e) => {
      setPlayQueue((a) => {
        const [next, ...rest] = a;
        if (next) {
          try {
            next.start(e.deadline);
            setTimeout(onPlay.current, e.toleranceEarly + e.toleranceLate);
            console.log("STARTING", next, e.deadline);
          } catch (err) {
            next.onended = () => {
              next.disconnect();
              console.log("STOPPED AND DISCONNECTED", next, e.deadline);
            };
            console.log("STOPPING", next, e.deadline);
            next.stop(e.deadline);
          }
          return rest;
        }
        return a;
      });
    },
    []
  );

  useEffect(() => {
    if (!barLength) return;
    if (playing && barTimer.current === null) {
      console.log("SETTING UP BAR TIMER", barLength);
      barTimer.current = audioClock.current
        .callbackAtTime(
          playNextAudio,
          audioContext.current.currentTime + barLength
        )
        .repeat(barLength);
    } else if (!playing && barTimer.current) {
      barTimer.current.clear();
      barTimer.current = null;
    }
  }, [audioClock, audioContext, playNextAudio, playing, barLength]);

  useEffect(() => {
    // Web Audio Context one-time setup
    audioContext.current = new AudioContext();
    audioClock.current = new WAAClock(audioContext.current, {
      toleranceEarly: 0.1,
    });
    audioClock.current.start();
    audioContext.current.onstatechange = () => {
      console.log("AUDIO STATUS", audioContext.current.state);
      setPlaying(audioContext.current.state === "running");
    };
    setNodes({
      destination: audioContext.current.destination,
    });
  }, []);

  return {
    audioContext: audioContext.current,
    nodes,
    registerNode,
    removeNode,
    setOnPlay,
    setBarLength,
    playAudio,
    cancelAudio,
    connectNodeToId,
  };
};

export default () => useBetween(useSound);
