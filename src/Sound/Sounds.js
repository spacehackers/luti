import React, { useState, useEffect, useCallback } from "react";
import WAAClock from "waaclock";

const audioContext = new AudioContext();
const audioClock = new WAAClock(audioContext, { toleranceEarly: 0.1 });
audioClock.start();

const Sounds = (props) => {
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

  useEffect(() => {
    if (playing) {
      const time = audioContext.currentTime;
      setStartTime(time);
      const barLength = 2.011416666666667;
      let i = 0;
      audio.forEach((a) => {
        audioClock.callbackAtTime((e) => {
          console.log("START", a, audioContext.currentTime, e.deadline);
          a.start(e.deadline);
        }, time + 0.5 + i * barLength);
        i += 1;
      });
    }
  }, [audio, playing]);

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
