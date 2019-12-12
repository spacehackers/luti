import React from "react";

import _ from "lodash";

import Video from "./Video";

import {
  vid_config,
  cloudfront_base_url,
  base_url,
  bounds_to_xy,
  xy_to_bounds
} from "./vid_config";

export default class Videos extends React.Component {
  constructor(props) {
    super(props);

    this.alreadyIndexedIds = {};
    this.state = {
      canplay: {},
      visible: true
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
        this.setState(prevState => {
          const canplay = {
            ...prevState.canplay,
            [id]: true
          };
          if (this.props.onVideoStatusChange) {
            this.props.onVideoStatusChange(canplay);
          }
          return { canplay };
        });
        return;
      }
      if (
        this.state.canplay[id] &&
        (evt.type === "stalled" ||
          evt.type === "waiting" ||
          evt.type === "ended" ||
          evt.type === "emptied")
      ) {
        this.setState(prevState => {
          const canplay = {
            ...prevState.canplay,
            [id]: false
          };
          if (this.props.onVideoStatusChange) {
            this.props.onVideoStatusChange(canplay);
          }
          return { canplay };
        });
      }
    };
    this.isVisible = vid => {
      if (!this.state.visible) {
        return false;
      }
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
  }

  componentDidMount() {
    if (this.props.map) {
      this.props.map.addEventListener("move", this.handleOnMove);
      this.handleOnMove();
    }
    document.addEventListener(
      "visibilitychange",
      () => {
        this.setState({ visible: !document.hidden });
      },
      false
    );
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
    if (!_.isEqual(nextState.xy_bounds, this.state.xy_bounds)) {
      return true;
    }
    if (!_.isEqual(nextState.visible, this.state.visible)) {
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
      const m3u8 = this.props.useCloudfront
        ? `${cloudfront_base_url}${vid.filename}-playlist.m3u8`
        : `${base_url}${vid.filename}-playlist.m3u8`;
      videos.push(
        <Video
          m3u8={m3u8}
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
    return <>{videos}</>;
  }
}
