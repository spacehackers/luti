import React from "react"
import ReactDOM from "react-dom"
import { Map } from "react-leaflet"
import L from "leaflet"
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

const url = base_url + all_vid_names[1]

export default class App extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    console.log("🌺 componentDidMount")

    var base = {
      Empty: L.tileLayer("")
    }

    var map = L.map("map", {
      crs: L.CRS.Simple,
      minZoom: init_zoom - 1,
      maxZoom: init_zoom + 4,
      // center: [y, x],
      center: center,
      zoom: init_zoom,

      layers: [base.Empty]
    })

    var all_vids = []
    all_vid_names.forEach((filename, key) => {
      if (!all_locs[key]) return

      let loc = all_locs[key]
      let url = `${base_url}${filename}`

      let video_overlay = L.videoOverlay(url, loc, vid_config).addTo(map)
      let video = video_overlay.getElement()

      // video = document.createElement("video")

      // setTimeout(() => {
      // let video = document.querySelector("#video0")

      console.log("🌺", video)
      let all_hls = []

      video.id = "video" + key.toString()

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
      // }, 1000)
    })
  }

  render() {
    return <div style={style} id="map" />
  }
}
