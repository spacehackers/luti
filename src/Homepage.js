import React from "react";
import PropTypes from "prop-types";
import isEqual from "lodash/isEqual";
import throttle from "lodash/throttle";
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

class Homepage extends React.Component {
  constructor(props) {
    super(props);

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
      bounds: undefined,
      introVisible: false,
      interacting: false,
      init_zoom
    };

    const handleOnMove = target => {
      if (!this.state.interacting) {
        this.setState({ interacting: true });
        return;
      }

      this.setState({ bounds: target.getBounds() });

      if (this.state.introVisible) {
        setTimeout(() => {
          this.setState({ introVisible: false });
        }, 500);
      }
    };

    this.handleOnMove = throttle(handleOnMove, 50, {
      leading: true,
      trailing: true
    });

    /*
    if (props.location.hash.length > 1) {
      const bounds = L.LatLngBounds.fromBBoxString(
        props.location.hash.substr(1)
      );
      this.state.bounds = bounds;
    }
    */

    this.onMove = ({ target }) => {
      this.handleOnMove(target);
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
      const screenPixels =
        leafletElement.getSize().x * leafletElement.getSize().y;
      const newState = {
        bounds: leafletElement.getBounds(),
        introVisible: true,
        boundsPad: 0.0
      };
      if (screenPixels > 450 * 900) {
        // bigger than an iPhone X Max
        console.log("DESKTOP MODE");
        newState.boundsPad = 0.0;
        newState.init_zoom = init_zoom + 1;
      }
      this.setState(newState);
    };
  }

  render() {
    const { x, y } = this.props.match.params;
    const query = queryString.parse(this.props.location.search);

    return (
      <>
        <Intro visible={this.state.introVisible}>
          Drag & Observe New Creatures
        </Intro>
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
            onMove={this.onMove}
            maxBounds={map_bounds}
            ref={this.onMapLoad}
          >
            <Videos
              debug={query.debug}
              videoLayout={video_layout}
              onVideoChange={this.onVideoChange}
              bounds={this.state.bounds}
              boundsPad={this.state.boundsPad}
            />
          </Map>
        )}
        <Info
          hidden={false}
          {...(this.state.currentVideo
            ? this.state.currentVideo.info()
            : undefined)}
        />
      </>
    );
  }
}

Homepage.propTypes = propTypes;
Homepage.defaultProps = { hidden: true };

export default withRouter(Homepage);
