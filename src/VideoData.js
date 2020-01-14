import React from "react";
import hash from "object-hash";

import L from "leaflet";
import { xy_to_bounds } from "./vid_config";

export default class VideoData {
  constructor(data) {
    Object.assign(this, data);

    this.hash = hash(this.filename).slice(0, 6);

    this.url = `https://lifeundertheice.org/${this.x}/${this.y}/${this.hash}`;
    this.analyticsUrl = `/${this.x}/${this.y}/${this.filename}`;

    this.bounds = () =>
      new L.LatLngBounds(
        xy_to_bounds(this.x, this.y)[0],
        xy_to_bounds(this.x, this.y)[1]
      );
    this.screenshot = `https://lifeundertheice.s3.amazonaws.com/${data.filename}.jpg`;
    this.info = () => ({
      url: this.url,
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
