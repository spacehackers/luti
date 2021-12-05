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

const Sounds = (props) => {
  const audioContext = useRef(null);
  const audioClock = useRef(null);
  const moveHandlerHasBeenSetup = useRef(false);
  const map = useRef(null);
  const barTimer = useRef(null);
  const XY = useRef({});

  const [playing, setPlaying] = useState(false);
  const [playQueue, setPlayQueue] = useState([]); // eslint-disable-line no-unused-vars
  const [nodes, setNodes] = useState({});
  const [gains, setGains] = useState({});

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

  useEffect(() => {
    // Cache copy of map object
    if (props.map) {
      map.current = props.map;
    }
  }, [props.map]);

  const handleOnMove = useCallback(() => {
    const volume = {};
    const bounds = map.current.getBounds().pad(0.1);
    const center = bounds.getCenter();
    const radius = L.CRS.Simple.distance(bounds.getNorthWest(), center);
    Object.keys(XY.current).forEach((id) => {
      const location = XY.current[id];
      let v = Math.abs(L.CRS.Simple.distance(center, location)) / radius;
      if (v > 1) {
        v = 1;
      }
      if (v < 0) {
        v = 0;
      }
      volume[id] = 1 - v;
    });
    console.log("AUDIO POSITIONS", volume);
    setGains(volume);
  }, []);

  useEffect(() => {
    // One-time map move handler setup
    if (!map.current) return;
    if (moveHandlerHasBeenSetup.current) return;
    moveHandlerHasBeenSetup.current = true;

    const hom = throttle(handleOnMove, 250, { leading: true, trailing: true });
    map.current.addEventListener("move", () => {
      if (audioContext.current.state !== "running") {
        console.log("----> PLAY!");
        audioContext.current.resume();
      }
      if (audioContext.current.state === "running") {
        hom();
      }
    });
  });

  useEffect(() => {
    // Recalculate cached ID -> XY lookup table when children change
    XY.current = recursivelyFindXYChildren(props.children);
  }, [props.children]);

  const playNextAudio = useCallback(
    // to be called once per bar by the audio clock
    (e) => {
      setPlayQueue((a) => {
        const [next, ...rest] = a;
        if (next) {
          try {
            next.start(e.deadline);
            console.log(
              "handleOnMove after timeout",
              e.toleranceEarly + e.toleranceLate
            );
            setTimeout(handleOnMove, e.toleranceEarly + e.toleranceLate);
            console.log("STARTING", next, e.deadline);
          } catch (err) {
            next.onended = () => {
              next.disconnect();
              console.log("STOPPED AND DISCONNECTED", next, e.deadline);
            };
            console.log("STOPPING", next, e.deadline);
            next.stop(e.deadline);
          }
        }
        return rest;
      });
    },
    [handleOnMove]
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
          if (!React.isValidElement(child)) return child;
          const destinationId = child.props.destination || "destination";
          const destination = nodes[destinationId];
          return React.cloneElement(child, {
            destination,
            audioContext: audioContext.current,
            nodes,
            setNodes,
            setPlayQueue,
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
