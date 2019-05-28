import Hls from "hls.js"

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

class Luti {
  constructor(center) {}

  get_vid() {
    // random video
    return all_vid_names[Math.floor(Math.random() * all_vid_names.length)]
  }

  load_vid(id, video, bounds, url) {
    console.log("load_vid")
    let hls = new Hls(hls_config)

    video.id = id

    if (Hls.isSupported()) {
      hls = new Hls(hls_config)
      hls.loadSource(url)
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED, function() {
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
  }

  overlap_shift(bounds) {
    // shift down/up left/right depending on
    return bounds // todo

    let [y, x] = bounds[0]
    let vertical = "down"
    let horiz = "right"
    if (y < center[0]) {
      vertical = "up"
    }
    if (x > center[1]) {
      horiz = "left"
    }

    if (vertical == "down") {
      bounds[0][0] = bounds[0][0] - overlap
      bounds[1][0] = bounds[1][0] - overlap
    } else {
      bounds[0][0] = bounds[0][0] + overlap
      bounds[1][0] = bounds[1][0] + overlap
    }

    if (horiz == "right") {
      bounds[0][1] = bounds[0][1] - overlap
      bounds[1][1] = bounds[1][1] - overlap
    } else {
      bounds[0][1] = bounds[0][1] + overlap
      bounds[1][1] = bounds[1][1] + overlap
    }
    return bounds
  }

  get_all_bounds(viewport_bounds) {
    // return a list of all viewort adjacent bounds

    console.log("viewport_bounds", viewport_bounds._southWest)

    const [y1, x1] = [
      viewport_bounds._southWest.lat,
      viewport_bounds._southWest.lng
    ]
    const [y2, x2] = [
      viewport_bounds._northEast.lat,
      viewport_bounds._northEast.lng
    ]

    console.log("✅", y1, x1, y2, x2)
    console.log("center", center)

    const min_x = img_width * Math.floor(x1 / img_width) // - img_width
    const max_x = img_width * Math.ceil(x2 / img_width) // + img_width

    const min_y = img_height * Math.floor(y1 / img_height) // - img_height
    const max_y = img_height * Math.ceil(y2 / img_height) // + img_width

    console.log("🔥", min_x, min_y, max_x, max_y)

    let bounds, offset, bounds_shifted
    let all_bounds = []

    for (let i = min_x; i <= max_x; i += img_width) {
      if (i > max_x) return

      for (let j = min_y; j <= max_y; j += img_height) {
        if (j > max_y) return

        bounds = [[j, i], [j + img_height, i + img_width]]
        bounds_shifted = this.overlap_shift(bounds)
        console.log("bounds", bounds.toString())
        console.log("bounds_shifted", bounds_shifted.toString())
        console.log("adding ")
        all_bounds.push(bounds_shifted)
      }
    }

    console.log("all_bounds", all_bounds, all_bounds.length)
    return all_bounds
  }
  // const lower_left = [
  //   img_height * Math.floor(y / img_height),
  //   img_width * Math.floor(x / img_width)
  // ]
  // const upper_right = [
  //   lower_left[0] + img_height - overlap,
  //   lower_left[1] + img_width - overlap
  // ]

  // const upper_right = [
  //   lower_left[0] + img_height - overlap,
  //   lower_left[1] + img_width - overlap
  // ]

  // console.log("🌹 all_bounds", all_bounds)
  // return all_bounds

  // return all adjacent bounding boxes
  get_adjacent_bounds(center) {
    console.log("get_adjacent_bounds", center)
  }
}

export default Luti
