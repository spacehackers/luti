import React from "react";
import PropTypes from "prop-types";
import isEqual from "lodash/isEqual";
import queryString from "query-string";

import L from "leaflet";
import { Map } from "react-leaflet";
import { withRouter } from "react-router-dom";
import Info from "./Info";

import Videos from "./Videos";
import Intro from "./Intro";

import VideoData from "./VideoData";

import video_layout_data from "./layout.json";
// import video_layout_data from './debug_layout';

import {
  x_count,
  y_count,
  img_width,
  img_height,
  init_zoom
} from "./vid_config";

const video_layout = video_layout_data.map(data => new VideoData(data));

L.LatLngBounds.fromBBoxString = bbox => {
  const [west, south, east, north] = bbox.split(",").map(parseFloat);
  return new L.LatLngBounds(
    new L.LatLng(south, west),
    new L.LatLng(north, east)
  );
};

const map_bounds = [
  [0, 0],
  [y_count(video_layout) * img_height, x_count(video_layout) * img_width]
];

const propTypes = {
  hidden: PropTypes.bool
};

const VIDEO_PLAY_TIMEOUT = 10000;

class Homepage extends React.Component {
  constructor(props) {
    super(props);

    this.startupTime = Date.now();

    setTimeout(() => this.forceUpdate(), VIDEO_PLAY_TIMEOUT);

    this.init_center = (x, y) => {
      let init_video;
      if (x === undefined || y === undefined) {
        init_video = video_layout.filter(v => v.init_position)[0];
      } else {
        init_video = video_layout.filter(
          v => v.x === parseInt(x, 10) && v.y === parseInt(y, 10)
        )[0];
      }
      return init_video.bounds().getCenter();
    };

    L.Map.include(L.LayerIndexMixin);

    this.state = {
      introVisible: false,
      interacting: false,
      init_zoom,
      videosPlaying: 0
    };

    this.handleOnMove = () => {
      // we're only using this move listener to do some initial removal of UI elements
      // so we remove it once that job is done
      if (this.state.interacting && !this.state.introVisible) {
        this.state.map.removeEventListener("move", this.handleOnMove);
        return;
      }

      if (!this.state.interacting) {
        this.setState({ interacting: true });
        return;
      }

      if (this.state.introVisible && this.state.videosPlaying > 0) {
        setTimeout(() => {
          this.setState({ introVisible: false });
        }, 500);
      }
    };

    this.onVideoChange = currentVideo => {
      this.setState(prevState => {
        if (isEqual(prevState.currentVideo, currentVideo)) {
          return undefined;
        }
        return { currentVideo };
      });
    };

    this.onMapLoad = ({ leafletElement }) => {
      this.setState({ map: leafletElement });
      const screenPixels =
        leafletElement.getSize().x * leafletElement.getSize().y;
      const newState = {
        introVisible: true,
        boundsPad: 0.1
      };
      if (screenPixels > 450 * 900) {
        // bigger than an iPhone X Max
        console.log("DESKTOP MODE");
        newState.boundsPad = 0.25;
        newState.init_zoom = init_zoom + 1;
      }
      this.setState(newState);
    };

    this.updateVideoStatus = status => {
      const videosPlaying = Object.keys(status).length;
      this.setState({ videosPlaying });
    };
  }

  render() {
    const { x, y } = this.props.match.params;
    const query = queryString.parse(this.props.location.search);

    let introMessage = "Drag & Observe New Creatures";
    if (this.state.videosPlaying === 0) {
      if (Date.now() - this.startupTime > VIDEO_PLAY_TIMEOUT) {
        introMessage = (
          <>
            Your connection is too slow to load this webpage.
            <br />
            Please find a faster connection.
          </>
        );
      } else {
        introMessage = "Loading Microbes...";
      }
    }
    return (
      <>
        <Intro visible={this.state.introVisible}>{introMessage}</Intro>
        {!this.props.hidden && (
          <Map
            key="map"
            crs={L.CRS.Simple}
            zoomSnap={0}
            zoomDelta={0.25}
            minZoom={this.state.init_zoom}
            maxZoom={this.state.init_zoom + 0.5}
            center={this.init_center(x, y)}
            zoom={this.state.init_zoom}
            keyboardPanDelta={150}
            onMove={this.handleOnMove}
            maxBounds={map_bounds}
            ref={this.onMapLoad}
          >
            <Videos
              debug={query.debug}
              spinnerTest={query.spinnerTest}
              showLoadingProblem={query.loading}
              videoLayout={video_layout}
              onVideoChange={this.onVideoChange}
              onVideoStatusChange={this.updateVideoStatus}
              boundsPad={this.state.boundsPad}
              map={this.state.map}
            />
          </Map>
        )}
        {this.state.currentVideo && this.state.videosPlaying > 0 && (
          <Info hidden={false} {...this.state.currentVideo.info()} />
        )}
      </>
    );
  }
}

Homepage.propTypes = propTypes;
Homepage.defaultProps = { hidden: true };

export default withRouter(Homepage);
