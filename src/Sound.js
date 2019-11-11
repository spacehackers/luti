import React from "react";
import { Howl } from "howler";

export default class Sound extends React.Component {
  constructor() {
    super();
    this.soundFilenames = ["one.mp3", "two.mp3", "three.mp3", "four.mp3"];
    this.locations = [[3600, 12800], [7200, 12800], [7200, 6400], [3600, 6400]];
    this.sounds = this.soundFilenames.map(
      filename =>
        new Howl({
          src: [filename],
          autoplay: true,
          loop: true,
          volume: 0.0
        })
    );
    this.calculate_volumes = (x, y) => {
      const levels = [];
      this.sounds.forEach((sound, idx) => {
        const l = this.locations[idx];
        const distance = Math.sqrt(
          (l[0] - x) * (l[0] - x) + (l[1] - y) * (l[1] - y)
        );
        let volume = 10000 - distance;
        if (volume < 0) {
          volume = 0;
        }
        volume /= 10000.0;
        sound.fade(sound.volume(), volume, 100);
        console.log("fading from", sound.volume(), "to", volume, distance);
        levels.push(volume);
      });
      if (this.props.onChange) {
        this.props.onChange(levels);
      }
    };
  }

  render() {
    console.log("sound", this.props);
    this.calculate_volumes(this.props.center_lat, this.props.center_lng);
    return (
      <div>
        <p>{this.props.center_lat}</p>
        <p>{this.props.center_lng}</p>
      </div>
    );
  }
}
