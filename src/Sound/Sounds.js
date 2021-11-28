import React, {
  useRef,
  useState,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import WAAClock from "waaclock";

const audioContext = new AudioContext();
const audioClock = new WAAClock(audioContext, { toleranceEarly: 0.1 });
audioClock.start();

const Sounds = (props) => {
  const barTimer = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [startTime, setStartTime] = useState(0); // eslint-disable-line no-unused-vars
  audioContext.onstatechange = useCallback(() => {
    console.log("AUDIO STATUS", audioContext.state);
    setPlaying(audioContext.state === "running");
  }, []);
  const [audio, setAudio] = useState([]);
  const [nodes, setNodes] = useState({
    destination: audioContext.destination,
  });

  const playNextAudio = useCallback(
    (e) => {
      if (audio.length === 0) return;
      setAudio((a) => {
        const [next, ...rest] = a;
        if (next) {
          console.log("STARTING", next, e.deadline);
          next.start(e.deadline);
        }
        return rest;
      });
    },
    [audio]
  );

  const barLength = useMemo(() => props.barLength, [props]);
  useEffect(() => {
    if (playing && barTimer.current === null) {
      console.log("SETTING UP BAR TIMER");
      barTimer.current = audioClock
        .callbackAtTime(playNextAudio, audioContext.currentTime + barLength)
        .repeat(barLength);
    } else if (!playing && barTimer.current) {
      barTimer.current.clear();
      barTimer.current = null;
    }
  }, [playNextAudio, playing, barLength]);

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          audioContext.resume();
          setPlaying(true);
        }}
      >
        audio
      </button>
      <div>
        {React.Children.map(props.children, (child) => {
          const destinationId = child.props.destination || "destination";
          const destination = nodes[destinationId];
          return React.cloneElement(child, {
            destination,
            audioContext,
            nodes,
            setNodes,
            setAudio,
            playing,
          });
        })}
      </div>
    </div>
  );
};

export default Sounds;
