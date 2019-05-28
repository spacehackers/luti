import React from "react"
import ReactDOM from "react-dom"
import { Map, VideoOverlay, Marker, Popup } from "react-leaflet"
import { CRS } from "leaflet"
import {
  hls_config,
  vid_config,
  rows,
  overlap,
  img_width,
  img_height,
  base_url,
  all_vid_names,
  center,
  init_zoom,
  style,
  all_locs
} from "./vid_config"

import Hls from "hls.js"
// const Hls = window.Hls

const bounds = all_locs[0]

const loc = all_locs[0]
const url = base_url + all_vid_names[0]

export default class EmptyMap extends React.Component {
  constructor(props) {
    super(props)
    this.player = React.createRef()
  }

  componentDidMount() {
    console.log("🌺")

    setTimeout(() => {
      // let video = document.querySelector("#video0")
      let video = this.player.current

      console.log("🌺", video)
      let key = 0
      let all_hls = []

      if (Hls.isSupported()) {
        all_hls[key] = new Hls(hls_config)
        all_hls[key].loadSource(url)
        all_hls[key].attachMedia(video)
        all_hls[key].on(Hls.Events.MANIFEST_PARSED, function() {
          video.muted = true
          video.loop = true
          video.autoplay = true
        })
      }
      // hls.js is not supported on platforms that do not have Media Source Extensions (MSE) enabled.
      // When the browser has built-in HLS support (check using `canPlayType`), we can provide an HLS manifest (i.e. .m3u8 URL) directly to the video element throught the `src` property.
      // This is using the built-in support of the plain video element, without using hls.js.
      // Note: it would be more normal to wait on the 'canplay' event below however on Safari (where you are most likely to find built-in HLS support) the video.src URL must be on the user-driven
      // white-list before a 'canplay' event will be emitted; the last video event that can be reliably listened-for when the URL is not on the white-list is 'loadedmetadata'.
      else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = url
        video.addEventListener("loadedmetadata", function() {
          video.play()
        })
      }
    }, 1000)
  }

  render() {
    return (
      <VideoOverlay
        id="video0"
        url={url}
        bounds={loc}
        ref={this.player}
        config={vid_config}
      />
    )
  }
}
