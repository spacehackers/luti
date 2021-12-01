import React, {
  useRef,
  useState,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import WAAClock from "waaclock";
import throttle from "lodash/throttle";
import L from "leaflet";
import { xy_to_bounds } from "../vid_config";

const recursivelyFindXYChildren = (children) => {
  const xy = {};
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      if (child.props.id && child.props.X && child.props.Y) {
        const bounds = xy_to_bounds(child.props.X, child.props.Y);
        const llb = L.latLngBounds(bounds);
        xy[child.props.id] = llb.getCenter();
      }
      Object.assign(xy, recursivelyFindXYChildren(child.props.children));
    }
  });
  return xy;
};

const calculateAudioPositions = (map, XY) => {
  if (!map) {
    return {};
  }
  const volume = {};
  const bounds = map.getBounds().pad(0.1);
  const center = bounds.getCenter();
  const radius = L.CRS.Simple.distance(bounds.getNorthWest(), center);
  Object.keys(XY).forEach((id) => {
    const location = XY[id];
    let v = Math.abs(L.CRS.Simple.distance(center, location)) / radius;
    if (v > 1) {
      v = 1;
    }
    if (v < 0) {
      v = 0;
    }
    volume[id] = 1 - v;
  });
  console.log("HANDLE AUDIO POSITIONS", volume);
  return volume;
};

const Sounds = (props) => {
  const audioContext = useRef(null);
  const audioClock = useRef(null);
  const handlerSetup = useRef(false);

  const barTimer = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [audio, setAudio] = useState([]); // eslint-disable-line no-unused-vars
  const [nodes, setNodes] = useState({});

  const [XY, setXY] = useState({});
  const [gains, setGains] = useState({});

  const handleOnMove = throttle(
    () => {
      setGains(calculateAudioPositions(props.map, XY));
    },
    250,
    {
      leading: true,
      trailing: true,
    }
  );

  useEffect(() => {
    if (!props.map) return;
    if (handlerSetup.current) return;
    handlerSetup.current = true;
    console.log("SETUP ONMOVE");
    handleOnMove();
    props.map.addEventListener("move", () => {
      if (audioContext.current.state !== "running") {
        console.log("----> PLAY!");
        audioContext.current.resume();
      }
      handleOnMove();
    });
  });

  useEffect(() => {
    setXY(recursivelyFindXYChildren(props.children));
  }, [setXY, props.children]);

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

  const playNextAudio = useCallback((e) => {
    setAudio((a) => {
      const [next, ...rest] = a;
      if (next) {
        console.log("STARTING", next, e.deadline);
        next.start(e.deadline);
      }
      return rest;
    });
  }, []);

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
            gains,
            gain: gains[child.props.id] || child.props.gain,
          });
        })}
      </div>
    </div>
  );
};

export default Sounds;
