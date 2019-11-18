import React from "react";

import _ from "lodash";

import Video from "./Video";

import "leaflet-layerindex";

import { vid_config, base_url, xy_to_bounds } from "./vid_config";

export default class Videos extends React.Component {
  constructor(props) {
    super(props);

    this.alreadyIndexedIds = {};
    this.state = {
      visible: {}
    };

    this.colorPixelSetup = canvas => {
      this.setState({ canvas });
    };

    this.getCenterVideo = () => {
      const center = this.props.bounds.getCenter().toBounds(1);
      const centerVideo = _.head(this.map.search(center));
      if (centerVideo !== undefined) {
        this.props.onVideoChange(centerVideo.options.video);
      }
    };

    this.calculateVisible = () => {
      const newVisible = {};
      this.map
        .search(this.props.bounds.pad(this.props.boundsPad)) // pad the triggering bounds so that offscreen videos can preload
        .map(v => v.options.id)
        .forEach(url => {
          newVisible[url] = true;
        });
      if (!_.isEqual(newVisible, this.state.visible)) {
        this.setState({ visible: newVisible });
      }
    };

    this.index = leafletElement => {
      const id = leafletElement.options.id;
      if (this.alreadyIndexedIds[id]) {
        return;
      }
      this.map = leafletElement._map;
      this.map.indexLayer(leafletElement);
      this.alreadyIndexedIds[id] = true;
      this.calculateVisible();
      this.getCenterVideo();
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.calculateVisible();
      this.getCenterVideo();
    }
  }

  render() {
    const videos = [];
    this.props.videoLayout.forEach((vid, idx) => {
      const id = `${vid.filename}-${idx}`;
      const visible = id in this.state.visible;
      videos.push(
        <Video
          m3u8={`${base_url}${vid.filename}.m3u8`}
          id={id}
          key={id}
          video={vid}
          xy={[vid.x, vid.y]}
          bounds={xy_to_bounds(vid.x, vid.y)}
          debug={false}
          showVideoName={false}
          debugColor={visible ? "#f00" : "#0f0"}
          indexFunc={this.index}
          visible={visible}
          colorCanvas={this.state.canvas}
          {...vid_config}
        />
      );
    });
    return (
      <>
        {videos}
        <canvas
          id="colorpixel"
          style={{ width: "1px", height: "1px" }}
          ref={this.colorPixelSetup}
        />
      </>
    );
  }
}
