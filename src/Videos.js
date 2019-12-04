import React from "react";

import _ from "lodash";

import Video from "./Video";

import "leaflet-layerindex";

import { vid_config, base_url, bounds_to_xy, xy_to_bounds } from "./vid_config";

export default class Videos extends React.Component {
  constructor(props) {
    super(props);

    this.alreadyIndexedIds = {};
    this.state = {
      visible: {},
      canplay: {}
    };

    this.getCenterVideo = bounds => {
      const center = bounds.getCenter().toBounds(1);
      const centerVideo = _.head(this.map.search(center));
      if (centerVideo !== undefined) {
        this.props.onVideoChange(centerVideo.options.video);
      }
    };

    this.calculateVisible = bounds => {
      if (!this.map) {
        return undefined;
      }
      const newVisible = {};
      this.map
        .search(bounds.pad(this.props.boundsPad)) // pad the triggering bounds so that offscreen videos can preload
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
      const newVisible = this.calculateVisible(this.props.bounds);
      if (newVisible !== undefined) {
        this.setState({ visible: newVisible });
      }
      this.getCenterVideo(this.props.bounds);
    };

    this.eventLogger = id => evt =>
      this.setState(prevState => {
        if (
          !prevState.canplay[id] &&
          (evt.type === "canplay" ||
            evt.type === "canplaythrough" ||
            evt.type === "playing")
        ) {
          return {
            canplay: {
              ...prevState.canplay,
              [id]: true
            }
          };
        }
        if (
          prevState.canplay[id] &&
          (evt.type === "stalled" ||
            evt.type === "waiting" ||
            evt.type === "ended" ||
            evt.type === "emptied")
        ) {
          return {
            canplay: {
              ...prevState.canplay,
              [id]: false
            }
          };
        }
        return undefined;
      });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!_.isEqual(nextProps.bounds, this.props.bounds)) {
      const newVisible = this.calculateVisible(nextProps.bounds);
      this.getCenterVideo(nextProps.bounds);
      if (newVisible !== undefined) {
        this.setState({ visible: newVisible });
      }
    }
    if (!_.isEqual(nextState.visible, this.state.visible)) {
      console.log("NEW VISIBLES, REDRAWING");
      return true;
    }
    return false;
  }

  render() {
    const videos = [];
    this.props.videoLayout.forEach((vid, idx) => {
      const id = `${vid.filename}-${idx}`;
      const visible = id in this.state.visible;
      const debugMessage = `Map bounds XY ${this.map &&
        JSON.stringify(bounds_to_xy(this.map.getBounds()))}`;
      videos.push(
        <Video
          m3u8={`${base_url}${vid.filename}-playlist.m3u8`}
          id={id}
          key={id}
          eventLogger={this.eventLogger(id)}
          video={vid}
          xy={[vid.x, vid.y]}
          bounds={xy_to_bounds(vid.x, vid.y)}
          canplay={!!this.state.canplay[id]}
          debug={this.props.debug}
          debugMessage={debugMessage}
          indexFunc={this.index}
          visible={visible}
          {...vid_config}
        />
      );
    });
    return <>{videos}</>;
  }
}
