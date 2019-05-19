import React from "react"
import ReactDOM from "react-dom"
import { Map, VideoOverlay, Marker, Popup } from "react-leaflet"
import { CRS } from "leaflet"
import Hls from "hls.js"
import {
  hls_config,
  rows,
  overlap,
  img_width,
  img_height,
  base_url,
  all_vid_names,
  center,
  init_zoom,
  style
} from "./vid_config"

let all_locs = []
let x = img_width
let y = x * (img_height / img_width)
for (let i = 0; i < rows; i++) {
  for (let j = 0; j < rows; j++) {
    all_locs.push([
      [i * y - overlap, j * x - overlap],
      [(i + 1) * y + overlap, (j + 1) * x + overlap]
    ])
  }
}
const bounds = all_locs[0]

export default class EmptyMap extends React.Component {
  constructor(props) {
    super(props)
    this.player = React.createRef()
  }

  render() {
    const loc = all_locs[0]
    const url = base_url + all_vid_names[0]
    return (
      <Map
        crs={CRS.Simple}
        center={(center, loc)}
        minZoom={-1}
        minZoom={init_zoom - 1}
        maxZoom={init_zoom + 4}
        bounds={bounds}
        style={style}
      >
        <VideoOverlay
          id="player_one"
          ref={this.player}
          url={url}
          bounds={loc}
          vid_config
        />
      </Map>
    )
  }
}
