import React from "react";
import Control from "react-leaflet-control";
import L from "leaflet";
import { tsv } from "d3-fetch";
import throttle from "lodash/throttle";
import Sound from "./Sound";
import { xy_to_bounds } from "./vid_config";

const debug_sound_source =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQbyxIWPplJbfSWBRfpSNmho-6LcS1xgEWd8VRLAn3R1dkvWQP3-OHLrFuA4_NgeMk9y3JKzkWzMwWW/pub?gid=0&single=true&output=tsv";

export default class Sounds extends React.Component {
  constructor(props) {
    super(props);
    if (!this.props.enabled) {
      return;
    }
    this.state = {
      sounds: [],
      volume: {},
    };
    this.latlngs = {};
    this.analysers = {};
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContext();

    const handleOnMove = () => {
      this.calculateAudioPositions();
    };
    this.handleOnMove = throttle(handleOnMove, 50, {
      leading: true,
      trailing: true,
    });
  }

  componentDidMount() {
    if (!this.props.enabled) {
      return;
    }
    this.mounted = true;
    tsv(debug_sound_source, (sound) => {
      const bounds = xy_to_bounds(parseInt(sound.X, 10), parseInt(sound.Y, 10));
      const llb = L.latLngBounds(bounds);
      this.latlngs[sound.File] = llb.getCenter();
      console.log("XY", sound.X, sound.Y, bounds);
      this.setState((prevState) => ({
        sounds: [...prevState.sounds, sound],
      }));
    });
    this.setState({ paused: this.props.paused });
    if (this.props.map) {
      this.props.map.addEventListener("move", this.handleOnMove);
      this.handleOnMove();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.paused !== prevProps.paused) {
      setTimeout(() => {
        console.log("RESUME AUDIO");
        if (this.audioContext) {
          this.audioContext.resume();
          this.setState({ paused: false });
        }
      }, 100);
    }
  }

  calculateAudioPositions = () => {
    if (!this.props.map) {
      return;
    }

    const volume = {};
    const bounds = this.props.map.getBounds().pad(0.1);
    const center = bounds.getCenter();
    const radius = L.CRS.Simple.distance(bounds.getNorthWest(), center);
    this.state.sounds.forEach((sound) => {
      const location = this.latlngs[sound.File];
      let v = Math.abs(L.CRS.Simple.distance(center, location)) / radius;
      if (v > 1) {
        v = 1;
      }
      if (v < 0) {
        v = 0;
      }
      volume[this.keyForSound(sound)] = 1 - v;
    });
    this.setState({ volume });
  };

  keyForSound = (sound) => {
    console.log(this.latlngs);
    const location = this.latlngs[sound.File];
    return `sound-${location.lat}-${location.lng}`;
  };

  analyserForSound = (sound) => {
    const key = this.keyForSound(sound);
    if (!(key in this.analysers)) {
      const analyser = this.audioContext.createAnalyser();
      analyser.fftSize = 32;
      this.analysers[key] = analyser;
    }
    return this.analysers[key];
  };

  render() {
    if (!this.props.enabled) {
      return null;
    }
    return (
      <>
        (this.props.debug && (
        <Control position="topright">
          <div className="sound-debug">
            {this.state.sounds.map((sound) => (
              <div key={`debug-${this.keyForSound(sound)}`}>
                {sound.File}
                <br />
                <div
                  style={{
                    height: "10px",
                    backgroundColor: sound.Color,
                    width: `${
                      (this.state.volume[this.keyForSound(sound)] || 0).toFixed(
                        2
                      ) * 50
                    }px`,
                  }}
                >
                  &nbsp;
                </div>
              </div>
            ))}
          </div>
        </Control>
        ));
        {this.state.sounds.map((sound) => {
          const location = this.latlngs[sound.File];
          const key = this.keyForSound(sound);
          return (
            <Sound
              debug
              key={key}
              audioContext={this.audioContext}
              location={location}
              color={sound.Color}
              file={sound.File}
              analyser={this.analyserForSound(sound)}
              volume={this.state.volume[key] || 0}
              paused={this.state.paused}
            />
          );
        })}
      </>
    );
  }
}
