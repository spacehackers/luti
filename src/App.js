import React from 'react';
import { Map } from 'react-leaflet';
import L from 'leaflet';
import WebFont from 'webfontloader';

import Videos from './Videos';
import Menu from './Menu';

import './App.scss';

import video_layout from './layout';
// import video_layout from './debug_layout';

import {
  x_count,
  y_count,
  img_width,
  img_height,
  init_zoom
} from './vid_config';

WebFont.load({
  typekit: {
    id: 'ikz3unr'
  },
  timeout: 3000
});

const map_bounds = [
  [0, 0],
  [
    (x_count(video_layout) - 0.55) * img_width,
    (y_count(video_layout) + 1.55) * img_height
  ]
];
const init_center = (() => {
  const init_video = video_layout.filter(x => x.init_position)[0] || {
    x: '0',
    y: '0'
  };
  return [
    init_video.x * img_width + img_width / 2 - 600,
    init_video.y * img_height + img_height + 200
  ];
})();

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
        <Menu />
        <Map
          key="map"
          crs={L.CRS.Simple}
          zoomSnap={0}
          zoomDelta={0.25}
          minZoom={init_zoom}
          maxZoom={init_zoom + 0.5}
          center={init_center}
          zoom={init_zoom}
          keyboardPanDelta={300}
          onMove={this.onMove}
          maxBounds={map_bounds}
          ref={this.onMapLoad}
        >
          <Videos videoLayout={video_layout} bounds={this.state.bounds} />
        </Map>
      </React.Fragment>
    );
  }
}
