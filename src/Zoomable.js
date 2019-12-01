/* eslint-disable no-param-reassign */

import React from "react";
import { event as currentEvent, select } from "d3-selection";
import { zoom, zoomIdentity } from "d3-zoom";
import throttle from "lodash/throttle";

export default class Zoomable extends React.Component {
  constructor(props) {
    super(props);
    this.playing = {};
    this.loaded = {};
    this.zoomed = transform => {
      this.setState({ transform });
    };

    const intersectRect = (r1, r2) => {
      return !(
        r2.left > r1.right ||
        r2.right < r1.left ||
        r2.top > r1.bottom ||
        r2.bottom < r1.top
      );
    };

    this.makeZoomable = () => {
      const container = select(this.node)
        .append("div")
        .attr("id", "map");

      container
        .selectAll("video")
        .data(this.props.data, d => d.id)
        .enter()
        .append("video")
        .attr("id", d => d.id)
        .attr("src", "")
        .attr("height", d => `${d.height}px`)
        .attr("width", d => `${d.width}px`)
        .style("position", "absolute")
        .style("left", "0")
        .style("top", "0")
        .nodes()
        .forEach(v => {
          this.playing[v.id] = false;
          this.loaded[v.id] = false;
        });

      const extent = [
        window.document.getElementById("map").clientWidth,
        window.document.getElementById("map").clientHeight
      ];
      this.zoom = zoom()
        .scaleExtent([0.75, 2])
        .extent([[0, 0], extent])
        .on("zoom", () => this.zoomed(currentEvent.transform));

      container.call(this.zoom);
      this.setState({ transform: zoomIdentity });
    };

    this.updateZoomable = () => {
      const containerRect = {
        left: 0,
        top: 0,
        right: window.document.getElementById("map").clientWidth,
        bottom: window.document.getElementById("map").clientHeight
      };
      const t = this.state.transform;
      const mappedData = this.props.data.map(d => ({
        ...d,
        video: window.document.getElementById(d.id),
        left: t.applyX(d.x),
        top: t.applyY(d.y),
        right: t.applyX(d.x + d.width),
        bottom: t.applyY(d.y + d.height)
      }));
      select(this.node)
        .selectAll("video")
        .data(mappedData, d => d.id)
        .style("transform", d => `translate3d(${d.left}px, ${d.top}px, 0px)`)
        .attr("width", d => `${Math.ceil(d.right - d.left) + 2}px`)
        .attr("height", d => `${Math.ceil(d.bottom - d.top) + 2}px`);
      mappedData.forEach(v => {
        if (intersectRect(v, containerRect)) {
          if (!this.loaded[v.id]) {
            const video = v.video;
            video.crossOrigin = "Anonymous";
            video.playsInline = true;
            video.muted = true;
            video.loop = true;
            video.autoplay = true;
            video.controls = false;
            video.src = v.src;
            this.loaded[v.id] = true;
          }
          if (!this.playing[v.id]) {
            this.playing[v.id] = true;
          }
        } else if (this.playing[v.id]) {
          console.log(v.id, v.video);
          v.video.pause();
          v.video.src = "";
          console.log("PAUSED", v.id);
          this.playing[v.id] = false;
          this.loaded[v.id] = false;
        }
      });
    };

    this.updateZoomable = throttle(this.updateZoomable, 15, {
      leading: true,
      trailing: true
    });
  }

  componentDidMount() {
    this.makeZoomable();
  }

  componentDidUpdate() {
    this.updateZoomable();
  }

  render() {
    return (
      <div
        ref={node => {
          this.node = node;
        }}
      />
    );
  }
}
