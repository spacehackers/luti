import React, {
  useRef,
  useState,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import WAAClock from "waaclock";

const Sounds = (props) => {
  const audioContext = useRef(null);
  const audioClock = useRef(null);

  const barTimer = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [audio, setAudio] = useState([]);
  const [nodes, setNodes] = useState({});

  useEffect(() => {
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
  }, [playNextAudio, playing, barLength]);

  if (!audioContext.current) return null;
  return (
    <div>
      <button
        type="button"
        onClick={() => {
          audioContext.current.resume();
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
            audioContext: audioContext.current,
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
