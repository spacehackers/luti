import { useImmer } from "use-immer";
import React, { useState } from "react";
import WAAClock from "waaclock";

const audioContext = new AudioContext();
const audioClock = new WAAClock(audioContext, { toleranceEarly: 0.1 });
audioClock.start();

const Sounds = (props) => {
  const [playing, setPlaying] = useState(false);
  const [startTime, setStartTime] = useState(0); // eslint-disable-line no-unused-vars
  audioContext.onstatechange = () => {
    console.log("AUDIO STATUS", audioContext.state);
    setPlaying(audioContext.state === "running");
  };
  const [audio, updateAudio] = useImmer([]);
  const [nodes, setNodes] = useState({
    destination: audioContext.destination,
  });
  const connectNode = (node, id) => {
    if (id === undefined) {
      console.log("CONNECTING", node, "TO OUTPUT");
      node.connect(nodes.destination);
      return;
    }
    if (!(id in nodes)) {
      console.log("ERROR: node id unknown", id);
      return;
    }
    console.log("CONNECTING", node, "TO", nodes[id]);
    node.connect(nodes[id]);
  };
  return (
    <div>
      <button
        type="button"
        onClick={() => {
          audioContext.resume();
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
        }}
      >
        audio
      </button>
      <div>
        {React.Children.map(props.children, (child) =>
          React.cloneElement(child, {
            connectNode,
            audioContext,
            nodes,
            setNodes,
            updateAudio,
            playing,
          })
        )}
      </div>
    </div>
  );
};

export default Sounds;
