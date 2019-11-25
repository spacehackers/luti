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
        return newVisible;
      }
      return undefined;
    };

    this.index = leafletElement => {
      const id = leafletElement.options.id;
      if (this.alreadyIndexedIds[id]) {
        return;
      }
      this.map = leafletElement._map;
      this.map.indexLayer(leafletElement);
      this.alreadyIndexedIds[id] = true;
      const newVisible = this.calculateVisible();
      if (newVisible !== undefined) {
        console.log("NEW VISIBLE IN INDEX", newVisible);
        this.setState({ visible: newVisible, redrawRequired: true });
      }
      this.getCenterVideo();
    };
  }

  componentDidUpdate(nextProps, nextState) {
    if (!_.isEqual(nextProps.bounds, this.props.bounds)) {
      console.log("NEW BOUNDS, CALCULATING VISIBLES");
      const newVisible = this.calculateVisible();
      this.getCenterVideo();
      if (newVisible !== undefined) {
        this.setState({ visible: newVisible });
      }
    }
    if (!_.isEqual(nextState.visible, this.state.visible)) {
      console.log("NEW VISIBLES, REDRAWING");
    }
    /*
    console.log(
      "NEW STATES IN VIDEOS",
      Object.keys(nextState).filter(k => nextState[k] !== this.state[k])
    );
    console.log(
      "NEW PROPS IN VIDEOS",
      Object.keys(nextProps).filter(k => nextProps[k] !== this.props[k])
    );
    */
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
          showVideoName
          indexFunc={this.index}
          visible={visible}
          {...vid_config}
        />
      );
    });
    return <>{videos}</>;
  }
}
