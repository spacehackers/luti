import React from "react";
import { Marker, Circle } from "react-leaflet";
import L from "leaflet";

import { tsv } from "d3-fetch";

const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();

const debug_sound_source =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQbyxIWPplJbfSWBRfpSNmho-6LcS1xgEWd8VRLAn3R1dkvWQP3-OHLrFuA4_NgeMk9y3JKzkWzMwWW/pub?gid=0&single=true&output=tsv";

export default class Sounds extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mp3s: {},
      sounds: []
    };
    this.latlngs = {};
  }

  componentDidMount() {
    this.mounted = true;
    tsv(debug_sound_source, sound => {
      this.setState(prevState => ({
        sounds: [...prevState.sounds, sound]
      }));
      this.latlngs[sound.File] = new L.LatLng(sound.X, sound.Y);
    });
  }

  /* eslint-disable no-param-reassign */
  setupAudio = mp3 => audio => {
    if (!this.mounted) return;
    if (!audio) return;
    if (mp3 in this.state.mp3s) return;

    audio.loop = true;
    audio.autoplay = true;
    audio.src = mp3;
    console.log("AUDIO", mp3, audio);

    const track = audioContext.createMediaElementSource(audio);
    const gain = audioContext.createGain();
    const pan = audioContext.createStereoPanner();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 32;

    track
      .connect(gain)
      .connect(pan)
      .connect(analyser)
      .connect(audioContext.destination);

    this.setState(prevState => {
      Object.assign(prevState.mp3s, {
        [mp3]: {
          audio,
          track,
          gain,
          pan,
          analyser
        }
      });
    });
  };
  /* eslint-enable no-param-reassign */

  calculateVolumes = center => {
    if (center.equals(this.lastCenter)) {
      return;
    }
    this.lastCenter = center;
    let pan = -1;
    Object.keys(this.latlngs).forEach(mp3 => {
      const audio = this.state.mp3s[mp3];

      const bufferLength = audio.analyser.frequencyBinCount;
      console.log(bufferLength);
      const dataArray = new Uint8Array(bufferLength);
      audio.analyser.getByteTimeDomainData(dataArray);
      console.log(mp3, dataArray);

      const latlng = this.latlngs[mp3];
      const distance = center.distanceTo(latlng);
      let volume = 10000000 - distance;
      if (volume < 0) {
        volume = 0;
      }
      volume /= 10000000.0;
      console.log(center, latlng, volume);
      if (volume < 0.0001) {
        volume = 0.0001;
      }
      audio.gain.gain.exponentialRampToValueAtTime(
        volume,
        audioContext.currentTime + 1
      );
      audio.pan.pan.value = pan;
      pan += 0.6;
      if (pan > 1) pan = 1;
      if (!this.props.paused) {
        audioContext.resume();
        audio.audio.play();
      }
    });
  };

  render() {
    if (this.props.map) {
      this.calculateVolumes(this.props.map.getCenter());
    }
    return (
      <>
        {this.state.sounds.map(sound => {
          const location = [parseInt(sound.X, 10), parseInt(sound.Y, 10)];
          return (
            <>
              <Circle
                key={`sound-${sound.X}-${sound.Y}`}
                center={location}
                color={sound.Color}
                radius={parseInt(sound.Volume, 10)}
              />
              <audio
                key={`audio-${sound.File}`}
                ref={this.setupAudio(sound.File)}
                loop
              />
            </>
          );
        })}
      </>
    );
  }
}
