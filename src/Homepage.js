import React from "react"
import debounce from "lodash/debounce"

import L from "leaflet"
import { Map } from "react-leaflet"
import { withRouter } from "react-router-dom"

import Videos from "./Videos"
import Intro from "./Intro"

import video_layout from "./layout"
// import video_layout from './debug_layout';

import {
  x_count,
  y_count,
  img_width,
  img_height,
  init_zoom
} from "./vid_config"

L.LatLngBounds.fromBBoxString = bbox => {
  const [west, south, east, north] = bbox.split(",").map(parseFloat)
  return new L.LatLngBounds(
    new L.LatLng(south, west),
    new L.LatLng(north, east)
  )
}

const map_bounds = [
  [0, 0],
  [
    (x_count(video_layout) - 0.55) * img_width,
    (y_count(video_layout) + 1.55) * img_height
  ]
]
const init_center = (() => {
  const init_video = video_layout.filter(x => x.init_position)[0] || {
    x: "0",
    y: "0"
  }
  return [
    init_video.x * img_width + img_width / 2 - 600,
    init_video.y * img_height + img_height + 200
  ]
})()

class Homepage extends React.Component {
  constructor(props) {
    super(props)

    L.Map.include(L.LayerIndexMixin)

    this.state = {
      bounds: undefined,
      introVisible: false,
      interacting: false
    }

    this.handleOnMove = debounce(this.handleOnMove, 500)

    if (props.location.hash.length > 1) {
      const bounds = L.LatLngBounds.fromBBoxString(
        props.location.hash.substr(1)
      )
      this.state.bounds = bounds
    }

    this.onMove = ({ target }) => {
      this.handleOnMove(target)
    }

    this.onMapLoad = ({ leafletElement }) => {
      const screenPixels = leafletElement.getSize().x * leafletElement.getSize().y;
      let newState = { bounds: leafletElement.getBounds(), introVisible: true, boundsPad: 0.0 };
      if(screenPixels > 450 * 900) { // bigger than an iPhone X Max
        console.log("DESKTOP MODE");
        newState.boundsPad = 0.5;
      }
      this.setState(newState);
    }
  }

  handleOnMove = target => {
    if (!this.state.interacting) {
      this.setState({ interacting: true })
      return
    }

    this.props.history.replace(`/#${target.getBounds().toBBoxString()}`)
    console.log(target.getBounds())
    this.setState({ bounds: target.getBounds() })

    if (this.state.introVisible) {
      setTimeout(() => {
        this.setState({ introVisible: false })
      }, 3000)
    }
  }

  render() {
    return (
      <React.Fragment>
        <Intro visible={false}>
          Drag to Discover New Creatures
        </Intro>
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
          <Videos videoLayout={video_layout} bounds={this.state.bounds} boundsPad={this.state.boundsPad} />
        </Map>
      </React.Fragment>
    )
  }
}

export default withRouter(Homepage)
