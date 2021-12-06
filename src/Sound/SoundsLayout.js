import { tsv } from "d3-fetch";
import React, { useEffect, useState } from "react";
import Sounds from "./Sounds";
import Soundtrack from "./Soundtrack";

const mp3_source_prefix = "https://lifeundertheice-audio.s3.amazonaws.com/";

const SoundsLayout = ({ map, src }) => {
  const [layout, setLayout] = useState([]);

  useEffect(() => {
    const f = async () => {
      const sounds = await tsv(src, (sound) => ({
        ...sound,
        X: parseFloat(sound.X, 10),
        Y: parseFloat(sound.Y, 10),
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
      {layout.map((l) => (
        <Soundtrack
          id={l.File}
          key={l.File}
          src={mp3_source_prefix + l.File}
          X={l.X}
          Y={l.Y}
        />
      ))}
    </Sounds>
  );
};

export default SoundsLayout;
