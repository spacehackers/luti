import React from "react";

import L from "leaflet";
import { xy_to_bounds } from "./vid_config";

export default class VideoData {
  constructor(data) {
    Object.assign(this, data);

    this.bounds = () =>
      new L.LatLngBounds(
        xy_to_bounds(this.x, this.y)[0],
        xy_to_bounds(this.x, this.y)[1]
      );
    this.screenshot = data.init_position
      ? "https://lifeundertheice.org/TwitterCard_Tardigrade.jpg"
      : `https://lifeundertheice.s3.amazonaws.com/${data.filename}.jpg`;
    this.info = () => ({
      url: `https://lifeundertheice.org/${this.x}/${this.y}`,
      title: data.title,
      desc: (
        <>
          {data.location}
          <br />
          {data.magnification}
        </>
      )
    });
  }
}
