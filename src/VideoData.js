import React from "react";

export default class VideoData {
  constructor(data) {
    Object.assign(this, data);

    this.info = () => ({
      title: data.title,
      desc: (
        <>
          {data.location}
          <br />
          {data.magnification}
        </>
      ),
      url: "example.com"
    });
  }
}
