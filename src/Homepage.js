import React from "react";
import PropTypes from "prop-types";
import isEqual from "lodash/isEqual";
import queryString from "query-string";
import ReactGA from "react-ga";
import { Helmet } from "react-helmet";

import L from "leaflet";
import { Map } from "react-leaflet";
import { withRouter } from "react-router-dom";
import Info from "./Info";

import Sounds from "./Sounds";
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
  zoomSettings
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

    this.calculate_initial_video = (x, y, hash) => {
      let init_video;
      if (hash !== undefined) {
        init_video = video_layout.filter(v => v.hash === hash)[0];
      } else if (x === undefined || y === undefined) {
        init_video = video_layout.filter(v => v.init_position)[0];
      } else {
        init_video = video_layout.filter(
          v => v.x === parseInt(x, 10) && v.y === parseInt(y, 10)
        )[0];
      }
      return init_video;
    };

    this.init_center = () => {
      // offset a little to center the initial tardigrade better on iPhone X screen
      const center = this.state.initialVideo.bounds().getCenter();
      return L.latLng(center.lat - 120, center.lng - 100);
    };

    L.Map.include(L.LayerIndexMixin);

    const { x, y, hash } = props.match.params;
    this.state = {
      introVisible: false,
      interacting: false,
      videosPlaying: 0,
      initialVideo: this.calculate_initial_video(x, y, hash),
      currentVideo: this.calculate_initial_video(x, y, hash)
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
          this.setState(prevState => {
            if (prevState.introVisible) {
              return { introVisible: false };
            }
            return null;
          });
        }, 500);
      }
    };

    this.onVideoChange = currentVideo => {
      this.setState(prevState => {
        if (isEqual(prevState.currentVideo, currentVideo)) {
          return undefined;
        }
        console.debug("Center microbe is ", currentVideo.url);
        ReactGA.pageview(currentVideo.analyticsUrl);
        return { currentVideo };
      });
    };

    this.onMapLoad = ({ leafletElement }) => {
      this.setState({
        map: leafletElement,
        introVisible: true,
        boundsPad: zoomSettings().boundsPad
      });
    };

    this.updateVideoStatus = status => {
      const videosPlaying = Object.keys(status).length;
      this.setState({ videosPlaying });
    };
  }

  render() {
    const query = queryString.parse(this.props.location.search);

    let introMessage = "Drag To Discover New Creatures";
    if (this.state.videosPlaying === 0) {
      if (Date.now() - this.startupTime > VIDEO_PLAY_TIMEOUT) {
        introMessage = (
          <div className="connection-problem">
            <span
              role="img"
              aria-label="warning"
              className="connection-problem-emoji"
            >
              ⚠️
            </span>
            <br />
            Your connection is too slow to load this webpage.
            <br />
            Please find a faster connection.
          </div>
        );
      } else {
        introMessage = "Loading Microbes...";
      }
    }
    let helmetData = {
      title: "Life Under the Ice",
      description:
        "An exploratory tour through the microscopic world of Antarctica. Each microbe tells a story of the weird and whimsical life in Antarctica that is otherwise invisible to the naked eye.",
      image: "https://lifeundertheice.org/TwitterCard_Tardigrade.jpg"
    };
    if (this.state.currentVideo && !this.state.currentVideo.init_position) {
      helmetData = {
        title: `${this.state.currentVideo.title} - Life Under The Ice`,
        image: this.state.currentVideo.screenshot,
        description: this.state.currentVideo.location
      };
    }
    return (
      <>
        <Helmet>
          <meta name="twitter:title" content={helmetData.title} />
          <meta name="twitter:description" content={helmetData.description} />
          <meta name="twitter:image" content={helmetData.image} />
          <meta property="og:title" content={helmetData.title} />
          <meta property="og:description" content={helmetData.description} />
          <meta property="og:image" content={helmetData.image} />
        </Helmet>
        <Intro visible={this.state.introVisible}>{introMessage}</Intro>
        {!this.props.hidden && (
          <Map
            key="map"
            crs={L.CRS.Simple}
            zoomSnap={0}
            zoomDelta={0.25}
            zoom={zoomSettings().initZoom}
            minZoom={zoomSettings().minZoom}
            maxZoom={zoomSettings().maxZoom}
            center={this.init_center()}
            keyboardPanDelta={150}
            onMove={this.handleOnMove}
            maxBounds={map_bounds}
            attributionControl={false}
            bounceAtZoomLimits={false}
            ref={this.onMapLoad}
          >
            <Videos
              debug={query.debug}
              spinnerTest={query.spinnerTest}
              showLoadingProblem={query.loading}
              useCloudfront={!!query.cloudfront}
              videoLayout={video_layout}
              onVideoChange={this.onVideoChange}
              onVideoStatusChange={this.updateVideoStatus}
              boundsPad={this.state.boundsPad}
              map={this.state.map}
            />
            <Sounds map={this.state.map} paused={this.state.introVisible} />
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
