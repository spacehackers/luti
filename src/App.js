import React from "react"
import ReactDOM from "react-dom"
import { Map } from "react-leaflet"
import L from "leaflet"
import Hls from "hls.js"

import "./App.scss"

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
  all_locs,
  map_bounds
} from "./vid_config"

const bounds = all_locs[0]

const url = base_url + all_vid_names[1]

export default class App extends React.Component {
  constructor(props) {
    super(props)
  }

  is_overlap(bounds, loc) {
    // console.log("checking", bounds, loc)

    const [x_min, y_min] = [bounds._southWest.lng, bounds._southWest.lat]
    const [x_max, y_max] = [bounds._northEast.lng, bounds._northEast.lat]
    const [x1, y1, x2, y2] = [].concat.apply([], loc)

    console.log("checking")
    console.log(" x_min, y_min, ", x_min, y_min)
    console.log(" x_max, y_max", x_max, y_max)
    console.log("x1, y1", x1, y1)
    console.log(" x2, y2", x2, y2)

    if (
      ((x_min < x1 && x1 < x_max) ||
        (x_min < x2 && x2 < x_max) ||
        (x1 < x_min && x2 > x_max)) &&
      ((y_min < y1 && y1 < y_max) ||
        (y_min < y2 && y2 < y_max) ||
        (y1 < y_min && y2 > y_max))
    ) {
      return true
    }

    return false
  }

  load(map) {
    all_vid_names.forEach((filename, key) => {
      if (!all_locs[key]) return

      let loc = all_locs[key]
      let bounds = map.getBounds()
      if (!this.is_overlap(bounds, loc)) return

      let url = `${base_url}${filename}`

      console.log("loading", loc, url)

      let video_overlay = L.videoOverlay(url, loc, vid_config).addTo(map)
      let video = video_overlay.getElement()

      // video = document.createElement("video")

      // let video = document.querySelector("#video0")

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

  componentDidMount() {
    var base = {
      Empty: L.tileLayer("")
    }

    const center = [
      img_height + img_height / 2.1,
      img_width + img_width / 1.9
    ].map(e => Math.floor(e))

    let map = L.map("map", {
      crs: L.CRS.Simple,
      minZoom: init_zoom - 4,
      maxZoom: init_zoom + 4,
      // center: [y, x],
      center: center,
      zoom: init_zoom,
      keyboardPanDelta: 500,
      layers: [base.Empty],
      inertia: true,
      inertiaDeceleration: 100,
      maxBounds: map_bounds,
      maxBoundsViscosity: 1.0
    })

    this.load(map)

    map.on("dragend", () => {
      let bounds = map.getBounds()

      console.log(map.getBounds())

      this.load(map)

      all_vid_names.forEach((filename, key) => {
        if (!all_locs[key]) return
        let loc = all_locs[key]

        if (this.is_overlap(bounds, loc)) {
          console.log("🌺")
        }
      })
    })
  }

  render() {
    return <div style={style} id="map" />
  }
}
