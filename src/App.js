import React from "react";
import { Map } from "react-leaflet";
import L from "leaflet";
import Videos from "./Videos";
import Menu from "./Menu";

import "./App.scss";

import video_layout from "./layout";

import {
  x_count,
  y_count,
  img_width,
  img_height,
  init_zoom
} from "./vid_config";

const map_bounds = [[0, 0], [x_count * img_width, y_count * img_height]];
const init_center = [
  Math.ceil(map_bounds[1][0] / 2 + img_width / 2),
  Math.ceil(map_bounds[1][1] / 2 + img_height / 2)
];

export default class App extends React.Component {
  constructor(props) {
    super(props);

    L.Map.include(L.LayerIndexMixin);

    this.state = {
      bounds: undefined
    };
    this.onMove = ({ target }) => {
      this.setState({ bounds: target.getBounds() });
    };
    this.onMapLoad = ({ leafletElement }) => {
      this.setState({ bounds: leafletElement.getBounds() });
    };
  }

  render() {
    return (
      <React.Fragment>
        <Map
          key="map"
          crs={L.CRS.Simple}
          zoomSnap={0}
          zoomDelta={0.25}
          minZoom={init_zoom}
          maxZoom={init_zoom + 1}
          center={init_center}
          zoom={init_zoom}
          keyboardPanDelta={300}
          onMove={this.onMove}
          maxBounds={map_bounds}
          ref={this.onMapLoad}
        >
          <Menu />
          <Videos videoLayout={video_layout} bounds={this.state.bounds} />
        </Map>
      </React.Fragment>
    );
  }
}
