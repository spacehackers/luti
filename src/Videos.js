import React from "react";

import _ from "lodash";

import Video from "./Video";

import {
  vid_config,
  cloudfront_base_url,
  base_url,
  bounds_to_xy,
  xy_to_bounds,
} from "./vid_config";

export default class Videos extends React.Component {
  constructor(props) {
    super(props);

    this.alreadyIndexedIds = {};
    this.state = {
      canplay: {},
      visible: true,
      centerXY: null,
    };

    this.isIdleStillMode = () =>
      !!this.props.forceStillMode || !!this.state.globalDisable;

    this.getCenterVideo = () => {
      if (!this.props.map) {
        return;
      }
      const bounds = this.props.map.getBounds();
      const center = bounds.getCenter().toBounds(1);
      const centerVideoXY = bounds_to_xy(center);
      const centerVideo = _.head(
        this.props.videoLayout.filter(
          (v) =>
            centerVideoXY.x_bottom_left === v.x &&
            centerVideoXY.y_bottom_left === v.y
        )
      );
      if (centerVideo !== undefined) {
        this.props.onVideoChange(centerVideo);
      }
    };

    this.index = () => {};

    this.eventLogger = (id) => (evt) => {
      if (
        !this.state.canplay[id] &&
        (evt.type === "canplay" ||
          evt.type === "canplaythrough" ||
          evt.type === "playing")
      ) {
        this.setState((prevState) => {
          const canplay = {
            ...prevState.canplay,
            [id]: true,
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
        this.setState((prevState) => {
          const canplay = {
            ...prevState.canplay,
            [id]: false,
          };
          if (this.props.onVideoStatusChange) {
            this.props.onVideoStatusChange(canplay);
          }
          return { canplay };
        });
      }
    };
    this.isVisible = (vid) => {
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

    this.getRenderMode = (vid) => {
      if (!this.isVisible(vid)) {
        return "hidden";
      }
      if (this.isIdleStillMode()) {
        return "still";
      }
      return "video";
    };

    this.getStartupPriority = (vid) => {
      if (!this.state.centerXY) {
        return 0;
      }
      return (
        Math.abs(vid.x - this.state.centerXY.x) +
        Math.abs(vid.y - this.state.centerXY.y)
      );
    };

    const handleOnMove = () => {
      const bounds = this.props.map.getBounds();
      const centerXYBounds = bounds_to_xy(bounds.getCenter().toBounds(1));
      const centerXY = {
        x: centerXYBounds.x_bottom_left,
        y: centerXYBounds.y_bottom_left,
      };
      const xy_bounds = bounds_to_xy(bounds.pad(this.props.boundsPad));
      if (
        !_.isEqual(xy_bounds, this.state.xy_bounds) ||
        !_.isEqual(centerXY, this.state.centerXY)
      ) {
        this.getCenterVideo();
        this.setState({ xy_bounds, centerXY });
      }
    };
    this.handleOnMove = _.throttle(handleOnMove, 50, {
      leading: true,
      trailing: true,
    });

    this.disableAllVideos = () => {
      console.debug("TIMEOUT: DISABLE ALL VIDEOS");
      this.setState({
        globalDisable: true,
      });
    };

    this.resetDeadMansSwitch = () => {
      if (this.state.globalDisable) {
        console.debug("TIMEOUT ENDED: ENABLE ALL VIDEOS");
        this.setState({
          globalDisable: false,
        });
      }
      clearTimeout(this.deadMansSwitch);
      this.deadMansSwitch = setTimeout(
        this.disableAllVideos,
        this.props.idleTimeoutMs || 10 * 60 * 1000
      );
    };

    this.attachMapListeners = (map) => {
      if (!map || this.attachedMap === map) {
        return;
      }
      map.addEventListener("move", this.handleOnMove);
      this.attachedMap = map;
      this.handleOnMove();
    };
  }

  componentDidMount() {
    this.attachMapListeners(this.props.map);
    document.addEventListener(
      "visibilitychange",
      () => {
        this.setState({ visible: !document.hidden });
        if (!document.hidden && !this.props.forceStillMode) {
          this.resetDeadMansSwitch();
        }
      },
      false
    );
    this.resetDeadMansSwitch();
    ["mouseover", "keydown", "scroll", "touchstart", "touchmove"].forEach(
      (eventName) =>
        document.body.addEventListener(
          eventName,
          _.throttle(this.resetDeadMansSwitch, 50, {
            leading: true,
            trailing: true,
          })
        )
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!_.isEqual(nextProps, this.props)) {
      return true;
    }
    const updatable_state = [
      "canplay",
      "xy_bounds",
      "centerXY",
      "visible",
      "globalDisable",
    ];
    let updateOk = false;
    updatable_state.forEach((name) => {
      if (!_.isEqual(nextState[name], this.state[name])) {
        updateOk = true;
      }
    });
    // console.debug("PREVENTED RENDER", nextState);
    return updateOk;
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.map && this.props.map) {
      this.attachMapListeners(this.props.map);
    }
  }

  render() {
    if (!this.props.map) {
      return null;
    }
    const videos = [];
    this.props.videoLayout.forEach((vid, idx) => {
      const id = `${vid.filename}-${idx}`;
      const renderMode = this.getRenderMode(vid);
      const m3u8 = this.props.useCloudfront
        ? `${cloudfront_base_url}${vid.filename}-playlist.m3u8`
        : `${base_url}${vid.filename}-playlist.m3u8`;
      videos.push(
        <Video
          m3u8={m3u8}
          stillUrl={`${base_url}${vid.filename}.jpg`}
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
          visible={renderMode !== "hidden"}
          renderMode={renderMode}
          startupPriority={this.getStartupPriority(vid)}
          {...vid_config}
        />
      );
    });
    return <>{videos}</>;
  }
}
