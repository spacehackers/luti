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
      canplay: {}
    };

    this.getCenterVideo = () => {
      if (!this.props.map) {
        return;
      }
      const bounds = this.props.map.getBounds();
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
    this.getCenterVideo();

    this.index = () => {};

    this.eventLogger = id => evt => {
      if (
        !this.state.canplay[id] &&
        (evt.type === "canplay" ||
          evt.type === "canplaythrough" ||
          evt.type === "playing")
      ) {
        this.setState(prevState => ({
          canplay: {
            ...prevState.canplay,
            [id]: true
          }
        }));
        return;
      }
      if (
        this.state.canplay[id] &&
        (evt.type === "stalled" ||
          evt.type === "waiting" ||
          evt.type === "ended" ||
          evt.type === "emptied")
      ) {
        this.setState(prevState => ({
          canplay: {
            ...prevState.canplay,
            [id]: false
          }
        }));
      }
    };
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
      const rectBounds = this.props.map.getBounds().pad(-0.3);
      return (
        <ImageOverlay
          bounds={rectBounds}
          url="https://www.shitpostbot.com/img/sourceimages/oh-no-5ab91493df486.png"
        />
      );
    };

    const handleOnMove = () => {
      const bounds = this.props.map.getBounds();
      const xy_bounds = bounds_to_xy(bounds.pad(this.props.boundsPad));
      if (!_.isEqual(xy_bounds, this.state.xy_bounds)) {
        this.getCenterVideo();
        this.setState({ xy_bounds });
      }
    };
    this.handleOnMove = _.throttle(handleOnMove, 50, {
      leading: true,
      trailing: true
    });

    if (this.props.map) {
      this.props.map.addEventListener("move", this.handleOnMove);
      this.handleOnMove();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!this.props.map && nextProps.map) {
      console.log("LATE ARRIVING MAP");
      nextProps.map.addEventListener("move", this.handleOnMove);
      this.handleOnMove();
    }
    if (!_.isEqual(nextProps, this.props)) {
      return true;
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
    // console.log("PREVENTED RENDER", nextState);
    return false;
  }

  render() {
    if (!this.props.map) {
      return null;
    }
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
