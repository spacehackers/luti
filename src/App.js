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
  init_center,
  init_zoom,
  style,
  all_locs,
  map_bounds
} from "./vid_config"

const url = base_url + all_vid_names[1]
let loaded = []

export default class App extends React.Component {
  constructor(props) {
    super(props)
  }

  setup_map() {
    let map = L.map("map", {
      crs: L.CRS.Simple,
      minZoom: init_zoom - 4,
      maxZoom: init_zoom + 4,
      // center: [y, x],
      center: init_center,
      zoom: init_zoom,
      keyboardPanDelta: 500,
      layers: L.tileLayer("")
      // inertia: true,
      // inertiaDeceleration: 100,
      // maxBounds: map_bounds,
      // maxBoundsViscosity: 1.0
    })

    return map
  }

  componentDidMount() {
    console.log(all_locs.join("\n"))

    let map = this.setup_map()

    this.load_vids(map)

    // just for the wtf of it all
    L.marker(L.latLng([0, 0])).addTo(map)
    L.marker(L.latLng(init_center)).addTo(map)
    L.marker(L.latLng([rows * img_height, rows * img_width])).addTo(map)

    map.on("click", e => {
      console.log("You clicked the map at", e.latlng)
    })

    map.on("dragend", () => {
      this.load_vids(map)
    })
  }

  is_loaded(loc) {
    console.log("is_loaded?", loc.toString())
    console.log("loaded", loaded)
    if (loaded.indexOf(loc.toString()) === -1) {
      console.log(false)
      return false
    }
    console.log(true)
    return true
  }

  get_vid() {
    // random video
    const filename =
      all_vid_names[Math.floor(Math.random() * all_vid_names.length)]
    return `${base_url}${filename}`
  }

  is_visible(loc, center) {
    // console.log("checking", bounds, loc)

    const [x1, y1, x2, y2] = [].concat.apply([], loc) // corner bounds of loc

    // const [x_min, y_min] = [bounds._southWest.lng, bounds._southWest.lat]
    // const [x_max, y_max] = [bounds._northEast.lng, bounds._northEast.lat]
    // if (
    //   ((x_min - x_extra < x1 && x1 < x_max + x_extra) ||
    //     (x_min - x_extra < x2 && x2 < x_max + x_extra) ||
    //     (x1 > x_min - x_extra && x2 < x_max + x_extra)) &&
    //   ((y_min - y_extra < y1 && y1 < y_max + y_extra) ||
    //     (y_min - y_extra < y2 && y2 < y_max + y_extra) ||
    //     (y1 > y_min - y_extra && y2 < y_max + y_extra))
    // ) {

    const y_extra = 0
    const x_extra = 0
    // const x_extra = 1.5 * img_width  // amount past the visible window
    // const y_extra = 1.5 * img_height

    const [center_y, center_x] = [center.lat, center.lng]

    // const [x_min, y_min] = [bounds._southWest.lng, bounds._southWest.lat]
    // const [x_max, y_max] = [bounds._northEast.lng, bounds._northEast.lat]

    const x_min = center_x - img_width
    const x_max = center_x + img_width
    const y_min = center_y - img_height
    const y_max = center_y + img_height

    // do the corner bounds of this loc overlap the visible window...
    if (
      ((x_min - x_extra < x1 && x1 < x_max + x_extra) ||
        (x_min - x_extra < x2 && x2 < x_max + x_extra) ||
        (x1 > x_min - x_extra && x2 < x_max + x_extra)) &&
      ((y_min - y_extra < y1 && y1 < y_max + y_extra) ||
        (y_min - y_extra < y2 && y2 < y_max + y_extra) ||
        (y1 > y_min - y_extra && y2 < y_max + y_extra))
    ) {
      return true
    }

    return false
  }

  load_vids(map) {
    all_locs.forEach((loc, key) => {
      if (this.is_loaded(loc)) return

      let center = map.getCenter()
      if (!this.is_visible(loc, center)) return

      let url = this.get_vid()
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

      loaded.push(loc.toString())
      console.log(loaded)
    })
  }

  render() {
    return <div style={style} id="map" />
  }
}
