import React, { useRef, useState, useEffect, useCallback } from "react";
import throttle from "lodash/throttle";
import L from "leaflet";
import { xy_to_bounds } from "../vid_config";
import useSound from "./useSound";

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
  const moveHandlerHasBeenSetup = useRef(false);
  const map = useRef(null);
  const XY = useRef({});

  const [gains, setGains] = useState({});

  const { audioContext, setOnPlay, setBarLength } = useSound();

  useEffect(() => {
    // Cache copy of map object
    if (props.map) {
      map.current = props.map;
    }
  }, [props.map]);

  const recalculateAudioPositions = useCallback(() => {
    if (audioContext.state !== "running") {
      console.log("----> PLAY!");
      audioContext
        .resume()
        .then(() => {
          console.log("RESUME AUDIO");
          recalculateAudioPositions();
        })
        .catch((e) => console.log("RESUME ERROR", e));
      return;
    }
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
  }, [audioContext]);

  useEffect(() => {
    setOnPlay(recalculateAudioPositions);
    setBarLength(props.barLength);
  }, [setOnPlay, recalculateAudioPositions, setBarLength, props.barLength]);

  useEffect(() => {
    // One-time map event handler setup
    if (!map.current) return;
    if (moveHandlerHasBeenSetup.current) return;
    moveHandlerHasBeenSetup.current = true;

    const hom = throttle(recalculateAudioPositions, 250, {
      leading: true,
      trailing: true,
    });
    map.current.addEventListener("move", hom);

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        const volume = {};
        Object.keys(XY.current).forEach((id) => {
          volume[id] = 0.0;
        });
        setGains(volume);
      } else {
        hom();
      }
    });
  });

  useEffect(() => {
    // Recalculate cached ID -> XY lookup table when children change
    XY.current = recursivelyFindXYChildren(props.children);
  }, [props.children]);

  if (!audioContext) return null;
  return (
    <>
      {React.Children.map(props.children, (child) => {
        if (!React.isValidElement(child)) return child;
        const destination = child.props.destination || "destination";
        return React.cloneElement(child, {
          destination,
          gains,
          gain: gains[child.props.id] || child.props.gain, // multiply?
        });
      })}
    </>
  );
};

export default Sounds;
