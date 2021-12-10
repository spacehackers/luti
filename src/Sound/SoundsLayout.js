import { tsv } from "d3-fetch";
import React, { useEffect, useState } from "react";
import Sounds from "./Sounds";
import Soundtrack from "./Soundtrack";
import Reverb from "./Reverb";

const mp3_source_prefix = "https://lifeundertheice-audio.s3.amazonaws.com/";

const SoundsLayout = ({ map, src }) => {
  const [layout, setLayout] = useState([]);

  useEffect(() => {
    const f = async () => {
      const sounds = await tsv(src, (sound) => ({
        ...sound,
        Pan: sound.Pan.toLowerCase() !== "no",
        Reverb: Number.isNaN(parseFloat(sound.Reverb))
          ? 0.0
          : parseFloat(sound.Reverb),
        X: parseFloat(sound.X),
        Y: parseFloat(sound.Y),
        Volume: parseFloat(sound.Volume, 10),
      }));
      setLayout(sounds.filter((s) => s.File !== ""));
    };
    f();
  }, [src]);

  if (layout.length === 0) {
    return null;
  }
  return (
    <Sounds barLength={3.0769} map={map}>
      <Reverb src="/IMreverbs/Nice Drum Room.wav" lowCut={200} id="reverb" />
      {layout.map((l) => {
        let destination = null;
        if (l.Reverb > 0) {
          destination = "reverb";
        }
        return (
          <Soundtrack
            id={l.File}
            key={l.File}
            src={mp3_source_prefix + l.File}
            X={l.X}
            Y={l.Y}
            destination={destination}
          />
        );
      })}
    </Sounds>
  );
};

export default SoundsLayout;
