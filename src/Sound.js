import L from "leaflet";
import { Marker, Circle } from "react-leaflet";
import React from "react";

const mp3_source_prefix = "https://lifeundertheice-audio.s3.amazonaws.com/";

export default class Sound extends React.Component {
  componentDidUpdate(prevProps) {
    if (this.props.paused !== prevProps.paused && !this.props.paused) {
      if (this.audio) {
        console.log("RESUME PLAY");
        this.audio.play();
      }
    }

    if (this.gain) {
      if (this.gain.gain.value === this.props.volume) {
        return;
      }
      if (this.props.volume > 0) {
        this.gain.gain.exponentialRampToValueAtTime(
          this.props.volume / 2,
          this.props.audioContext.currentTime + 1 / 50.0
        );
      } else {
        this.gain.gain.value = 0;
      }
    }
    if (this.resonance) {
      this.resonance.setPosition(
        this.props.position.x,
        this.props.position.y + 1,
        0
      );
    }
  }

  setupAudio = (mp3) => (audio) => {
    if (!audio) return;
    if (this.track) return;

    this.audio = audio;
    this.audio.crossOrigin = "anonymous";
    this.audio.src = mp3_source_prefix + mp3;
    this.audio.loop = true;
    this.audio.autoplay = true;
    if (!this.props.paused) {
      console.log("INIT PLAY");
      this.audio.play();
    }

    this.track = this.props.audioContext.createMediaElementSource(audio);
    this.gain = this.props.audioContext.createGain();
    this.resonance = this.props.resonance.createSource();
    this.resonance.setPosition(0, 0, 0);

    this.track
      .connect(this.gain)
      .connect(this.props.analyser)
      .connect(this.resonance.input);

    this.applyAudioSettings();
  };

  applyAudioSettings = () => {
    this.gain.gain.value = this.props.volume;
  };

  render() {
    const text = L.divIcon({
      html: `<div class="sound-debug">${this.props.file}</div>`,
      iconSize: "auto",
    });

    return (
      <>
        {this.props.debug && (
          <>
            <Circle
              key={`sound-${this.props.location[0]}-${this.props.location[1]}`}
              center={this.props.location}
              color={this.props.color}
              radius={this.props.volume * 600}
            />
            <Marker position={this.props.location} icon={text} />
          </>
        )}
        <audio
          id={`audio-${this.props.file}`}
          key={`audio-${this.props.file}`}
          ref={this.setupAudio(this.props.file)}
          loop
        />
      </>
    );
  }
}
