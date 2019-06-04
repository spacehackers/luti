import React from "react"
import ReactDOM from "react-dom"
import { Map } from "react-leaflet"
import L from "leaflet"
import Hls from "hls.js"
import Luti from "./luti"

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
  map_bounds,
  min_zoom,
  max_zoom
} from "./vid_config"

const bounds = all_locs[0]

const url = base_url + all_vid_names[1]

let luti = new Luti()
let loaded = []

export default class App extends React.Component {
  constructor(props) {
    super(props)

    // this.load_next = this.load_next.bind(this)
  }

  componentDidMount() {
    var base = {
      Empty: L.tileLayer("")
    }

    let map = L.map("map", {
      crs: L.CRS.Simple,
      minZoom: min_zoom, // -1
      maxZoom: max_zoom,
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

    console.log("center", center)
    console.log("url", url)
    this.load_next(map)

    map.on("dragend", () => {
      let viewport_bounds = map.getBounds()
      console.log(
        "🌏",
        [viewport_bounds._southWest.lat, viewport_bounds._southWest.lng],
        [viewport_bounds._northEast.lat, viewport_bounds._northEast.lng]
      )

      // this.load_next(map)
    })

    // var all_vids = []
    // console.log(all_locs)
    // all_vid_names.forEach((filename, key) => {
    //   if (!all_locs[key]) return
    //
    //   let loc = all_locs[key]
    //   let url = `${base_url}${filename}`
    //
    //   let video_overlay = L.videoOverlay(url, loc, vid_config).addTo(map)
    //   let video = video_overlay.getElement()
    //
    //   // let all_hls = []
    //   luti.load_vid(video, bounds, url)
    // })
  }

  load_next(map) {
    // let map_center = map.getCenter() // this doesn't work, isn ot viewport center
    // need to pass viewport_bounds to getBounds
    let viewport_bounds = map.getBounds()

    console.log("🌺 viewport_bounds", viewport_bounds)

    let all_current_bounds = luti.get_all_bounds(viewport_bounds)
    console.log("🐼 current_bounds", all_current_bounds)
    console.log(all_current_bounds.length)
    // ok

    all_current_bounds.forEach(b => {
      console.log("------->>>", b)
      if (this.is_loaded(b)) {
        return
      }

      let filename = luti.get_vid()
      let url = `${base_url}${filename}`

      let video_overlay = L.videoOverlay(url, bounds, vid_config).addTo(map)
      let video = video_overlay.getElement()
      let id = "video" + loaded.length
      luti.load_vid(id, video, bounds, url)
    })
  }

  is_loaded(bounds) {
    return false

    console.log("is_loaded", bounds)
    console.log("loaded", loaded)
    if (loaded.map(b => b.toString()).indexOf(bounds.toString()) === -1) {
      console.log("false")
      return false
    }
    return true
  }

  render() {
    return <div style={style} id="map" />
  }
}
