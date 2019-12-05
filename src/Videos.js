import React from "react";

import { ImageOverlay } from "react-leaflet";
import _ from "lodash";

import Video from "./Video";

import { vid_config, base_url, bounds_to_xy, xy_to_bounds } from "./vid_config";

export default class Videos extends React.Component {
  constructor(props) {
    super(props);

    this.alreadyIndexedIds = {};
    this.state = {
      canplay: {},
      xy_bounds: bounds_to_xy(props.bounds)
    };

    this.getCenterVideo = bounds => {
      const center = bounds.getCenter().toBounds(1);
      const centerVideoXY = bounds_to_xy(center);
      const centerVideo = _.head(
        this.props.videoLayout.filter(
          v =>
            centerVideoXY.x_bottom_left === v.x &&
            centerVideoXY.y_bottom_left === v.y
        )
      );
      if (centerVideo !== undefined) {
        this.props.onVideoChange(centerVideo);
      }
    };
    this.getCenterVideo(props.bounds);

    this.index = () => {};

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
    this.isVisible = vid => {
      if (!this.state.xy_bounds) {
        return false;
      }
      return (
        vid.x >= this.state.xy_bounds.x_bottom_left &&
        vid.x <= this.state.xy_bounds.x_top_right &&
        vid.y >= this.state.xy_bounds.y_bottom_left &&
        vid.y <= this.state.xy_bounds.y_top_right
      );
    };

    this.monitorVideoStartup = () => {
      let ok = false;
      Object.keys(this.state.canplay).forEach(k => {
        if (this.state.canplay[k]) {
          ok = true;
        }
      });
      if (ok) {
        this.setState({ loadingProblem: false });
        console.log("AT LEAST ONE VIDEO LOADED!");
      } else {
        this.setState({ loadingProblem: true });
        console.log("EVERYTHING IS TERRIBLE");
        setTimeout(this.monitorVideoStartup, 2000);
      }
    };
    setTimeout(this.monitorVideoStartup, 5000);

    this.loadingProblemAlert = () => {
      const rectBounds = this.props.bounds.pad(-0.3);
      return (
        <ImageOverlay
          bounds={rectBounds}
          url="https://www.shitpostbot.com/img/sourceimages/oh-no-5ab91493df486.png"
        />
      );
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!_.isEqual(nextProps.bounds, this.props.bounds)) {
      this.getCenterVideo(nextProps.bounds);
      const xy_bounds = bounds_to_xy(
        nextProps.bounds.pad(this.props.boundsPad)
      );
      if (!_.isEqual(xy_bounds, this.state.xy_bounds)) {
        this.setState({ xy_bounds });
      }
    }
    if (!_.isEqual(nextState.canplay, this.state.canplay)) {
      return true;
    }
    if (!_.isEqual(nextState.loadingProblem, this.state.loadingProblem)) {
      return true;
    }
    if (!_.isEqual(nextState.xy_bounds, this.state.xy_bounds)) {
      return true;
    }
    return false;
  }

  render() {
    const videos = [];
    this.props.videoLayout.forEach((vid, idx) => {
      const id = `${vid.filename}-${idx}`;
      const visible = this.isVisible(vid);
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
          spinnerTest={this.props.spinnerTest}
          indexFunc={this.index}
          visible={visible}
          {...vid_config}
        />
      );
    });
    return (
      <>
        {this.props.showLoadingProblem &&
          this.state.loadingProblem &&
          this.loadingProblemAlert()}
        {videos}
      </>
    );
  }
}
