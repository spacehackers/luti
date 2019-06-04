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
let loaded = []

export default class App extends React.Component {
  constructor(props) {
    super(props)
  }

  is_visible(bounds, loc) {
    // console.log("checking", bounds, loc)

    const [x_min, y_min] = [bounds._southWest.lng, bounds._southWest.lat]
    const [x_max, y_max] = [bounds._northEast.lng, bounds._northEast.lat]
    const [x1, y1, x2, y2] = [].concat.apply([], loc)

    const y_extra = img_height
    const x_extra = img_width

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
  }
  //
  // console.log("🐠 nope")
  // console.log(" x_min, y_min, ", x_min, y_min)
  // console.log(" x_max, y_max", x_max, y_max)
  // console.log("x1, y1", x1, y1)
  // console.log(" x2, y2", x2, y2)

  componentDidMount() {
    var base = {
      Empty: L.tileLayer("")
    }

    let map = L.map("map", {
      crs: L.CRS.Simple,
      minZoom: init_zoom - 4,
      maxZoom: init_zoom + 4,
      // center: [y, x],
      center: center,
      zoom: init_zoom,
      keyboardPanDelta: 500,
      layers: [base.Empty],
      // inertia: true,
      // inertiaDeceleration: 100,
      maxBounds: map_bounds,
      maxBoundsViscosity: 1.0
    })

    this.load(map)

    // map click
    function onMapClick(e) {
      console.log("You clicked the map at", e.latlng)
    }
    map.on("click", onMapClick)

    // map.on("dragend", function onDragEnd() {
    //   let w = map.getBounds().getEast() - map.getBounds().getWest()
    //   let h = map.getBounds().getNorth() - map.getBounds().getSouth()
    //
    //   console.log(
    //     "center:" +
    //       map.getCenter() +
    //       "\n" +
    //       "width:" +
    //       w +
    //       "\n" +
    //       "height:" +
    //       h +
    //       "\n" +
    //       "size in pixels:" +
    //       map.getSize()
    //   )
    // })

    map.on("dragend", () => {
      let bounds = map.getBounds()

      console.log(map.getBounds())

      this.load(map)
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

  load(map) {
    all_locs.forEach((loc, key) => {
      let bounds = map.getBounds()

      if (this.is_loaded(loc)) {
        console.log("🍄 already loaded, moving along... ")
        return
      }

      console.log("loading new critter ")

      if (!this.is_visible(bounds, loc)) return

      let url = this.get_vid()
      let video_overlay = L.videoOverlay(url, loc, vid_config).addTo(map)
      let video = video_overlay.getElement()

      console.log("🐙 loading", loc, url)
      console.log("cneter", center)
      console.log("bounds", bounds)

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
