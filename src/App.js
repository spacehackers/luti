import React from "react";
import { Chart } from "chart.js";
import L from "leaflet";
import Hls from "hls.js";
import Sound from "./Sound.js";
import { throttle } from "lodash";

import "./App.scss";

import {
  hls_config,
  vid_config,
  num_rows,
  num_cols,
  img_width,
  img_height,
  base_url,
  init_center,
  init_zoom,
  style,
  all_locs,
  opening_bounds
} from "./vid_config";

import layout from "./layout";

const DEBUG = false;
const map_bounds = [[0, 0], [num_cols * img_height, num_rows * img_width]];
let loaded_locs = [];
let loaded_vids = [];
let playing_vids = [];
let all_hls = [];
let map;
let chart;

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      center: { lat: 0, lng: 0 }
    };
    // this.load_all_vids = throttle(this.load_all_vids.bind(this), 50);
    this.handle_key_press = this.handle_key_press.bind(this);
    // this.load_all_vids = this.load_all_vids.bind(this)

    this.all_locs_by_lower_left = this.get_all_locs_by_lower_left_index();

    this.soundChange = data => {
      if (!chart) {
        return;
      }
      chart.data.datasets[0].data = data;
      chart.update();
    };
  }

  componentDidMount() {
    console.log("layout", layout);
    console.log("all_locs_by_lower_left", this.all_locs_by_lower_left);
    console.log("all_locs", all_locs);
    this.setup_map();

    // const opening_index = this.get_key_at_loc(opening_bounds, all_locs);
    // this.load_vid(opening_bounds, map, opening_index);

    document.addEventListener("keydown", this.handle_key_press, false);

    map.on("dragend", () => {
      this.load_all_vids();
      this.setState({ center: map.getCenter() });
    });

    map.on("click", e => {
      console.log("You clicked the map at", e.latlng);
      console.log("bounds", map.getBounds());
      console.log("center", map.getCenter());
      console.log(`${loaded_locs.length} videos are loaded`);
      console.log(`${playing_vids.length} videos are playing`);
      console.log(loaded_vids);
    });
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handle_key_press, false);
  }

  handle_key_press(e) {
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
      this.load_all_vids();
    }
  }

  get_all_locs_by_lower_left_index() {
    let all_locs_by_lower_left = [];
    Object.values(layout).forEach(function(cell) {
      let [name, x, y] = cell;
      x = Number(x); // x * img_width;
      y = Number(y); // y * img_height;
      if (x in all_locs_by_lower_left === false) {
        all_locs_by_lower_left[x] = [];
      }
      all_locs_by_lower_left[x][y] = name;
    });
    return all_locs_by_lower_left;
  }

  setup_map() {
    map = L.map("map", {
      crs: L.CRS.Simple,
      zoomSnap: 0,
      zoomDelta: 0.25,
      minZoom: init_zoom,
      maxZoom: init_zoom + 1,
      center: init_center, // init_center,
      zoom: init_zoom,
      keyboardPanDelta: 300,
      layers: L.tileLayer(""),
      // inertia: true,
      // inertiaDeceleration: 100,
      maxBounds: map_bounds,
      maxBoundsViscosity: 1.0
    });

    if (DEBUG) {
      this.setup_sound_debug();
      L.control.soundDebug({ position: "topleft" }).addTo(map);
    }
  }

  load_all_vids() {
    console.log("💟load_all_vids", all_locs);
    all_locs.forEach((loc, key) => {
      console.log("✅", loc);
      if (this.is_loaded(loc)) {
        if (this.is_visible(map, loc)) {
          // loc is loaded but not visible
          this.play_pause_video("video" + key, "play");
        } else {
          this.play_pause_video("video" + key, "pause");
        }
      } else {
        if (!this.is_visible(map, loc)) return;

        console.log("elseeeeee 🍎");
        console.log(loc, key);
        this.load_vid(loc, map, key);
      }
    });
  }

  get_vid_url(loc) {
    // random video
    const y = Math.floor(loc[0][0] / img_height);
    const x = Math.floor(loc[0][1] / img_width);

    console.log("fetching", x, y, this.all_locs_by_lower_left);

    console.log("🍎", this.all_locs_by_lower_left);
    const video_name = this.all_locs_by_lower_left[x][y];

    const url = `${base_url}${video_name}.m3u8`;

    return url;
  }

  is_loaded(loc) {
    if (loaded_locs.indexOf(loc.toString()) === -1) {
      return false;
    }
    return true;
  }

  is_visible(map, loc) {
    let center = map.getCenter();

    // console.log("checking", bounds, loc)

    const [y1, x1, y2, x2] = [].concat.apply([], loc); // corner bounds of loc

    const [center_y, center_x] = [center.lat, center.lng];

    // let bounds = map.getBounds()
    // const [x_min, y_min] = [bounds._southWest.lng, bounds._southWest.lat]
    // const [x_max, y_max] = [bounds._northEast.lng, bounds._northEast.lat]

    // #todo use visible map width/height to define x/y min/max
    // var width = map.getBounds().getEast() - map.getBounds().getWest();
    // var height = map.getBounds().getNorth() - map.getBounds().getSouth();
    //
    // alert (
    //     'center:' + map.getCenter() +'\n'+
    //     'width:' + width +'\n'+
    //     'height:' + height +'\n'+
    //     'size in pixels:' + map.getSize()
    // )});
    //
    const x_min = Math.floor(center_x - img_width);
    const x_max = Math.floor(center_x + img_width);
    const y_min = Math.floor(center_y - img_height / 2);
    const y_max = Math.floor(center_y + img_height / 2);

    // do the corner bounds of this loc overlap the visible window...
    // some bug in here.
    if (
      ((x_min < x1 && x1 < x_max) || // x_min < x1 < x_max
      (x_min < x2 && x2 < x_max) || // x_min < x2 < x_max
        (x1 > x_min && x2 < x_max)) && // x1 > x_min && x2 < x_max
      ((y_min < y1 && y1 < y_max) ||
        (y_min < y2 && y2 < y_max) ||
        (y1 > y_min && y2 < y_max))
    ) {
      this.setState({ center: map.getCenter() });
      return true;
    }
    return false;
  }

  play_pause_video(video_id, action) {
    // play or pause video if it's not already playing/pausing
    let video = document.querySelector("#" + video_id);
    // let key = video_id.substring(5)

    if (action === "pause") {
      if (playing_vids.indexOf(video_id) >= 0) {
        // video is playing
        console.log("pausing ", video_id);
        playing_vids.splice(playing_vids.indexOf(video_id), 1);
        video.pause();
      }
    } else {
      if (playing_vids.indexOf(video_id) === -1) {
        // video is not playing
        console.log("playing ", video_id);
        playing_vids.push(video_id);
        video.play();
      }
    }
  }

  load_vid(loc, map, key) {
    let url = this.get_vid_url(loc);
    let video_overlay = L.videoOverlay(url, loc, vid_config).addTo(map);
    let video = video_overlay.getElement();

    // video = document.createElement("video")
    // let video = document.querySelector("#video0")
    video.id = "video" + key;

    if (Hls.isSupported()) {
      all_hls[key] = new Hls(hls_config);
      all_hls[key].loadSource(url);
      all_hls[key].attachMedia(video);
      all_hls[key].on(Hls.Events.MANIFEST_PARSED, function() {
        video.muted = true;
        video.loop = true;
        video.autoplay = true;
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // hls.js is not supported on platforms that do not have Media Source Extensions (MSE) enabled.
      // When the browser has built-in HLS support (check using `canPlayType`), we can provide an HLS manifest (i.e. .m3u8 URL) directly to the video element throught the `src` property.
      // This is using the built-in support of the plain video element, without using hls.js.
      // Note: it would be more normal to wait on the 'canplay' event below however on Safari (where you are most likely to find built-in HLS support) the video.src URL must be on the user-driven
      // white-list before a 'canplay' event will be emitted; the last video event that can be reliably listened-for when the URL is not on the white-list is 'loadedmetadata'.
      video.src = url;
      video.addEventListener("loadedmetadata", function() {
        video.play();
      });
    }

    loaded_locs.push(loc.toString());
    loaded_vids.push(video.id);
    playing_vids.push(video.id);
  }

  get_key_at_loc(loc, all_locs) {
    for (var i = 0; i < all_locs.length; i++) {
      // each item is like: [x1,y1][x2,y2]
      if (
        all_locs[i][0][0] === loc[0][0] &&
        all_locs[i][0][1] === loc[0][1] &&
        all_locs[i][1][0] === loc[1][0] &&
        all_locs[i][1][1] === loc[1][1]
      ) {
        return i; // Found it
      }
    }
    return -1; // Not found
  }

  setup_sound_debug() {
    L.Control.SoundDebug = L.Control.extend({
      onAdd: function(map) {
        let soundDebugDiv = L.DomUtil.create("canvas");

        soundDebugDiv.style.width = "200px";
        soundDebugDiv.style.height = "100px";
        soundDebugDiv.style.border = "1px solid black";
        soundDebugDiv.style.backgroundColor = "white";

        var ctx = soundDebugDiv.getContext("2d");
        Chart.scaleService.updateScaleDefaults("linear", {
          ticks: {
            min: 0
          }
        });
        chart = new Chart(ctx, {
          type: "bar",
          data: {
            labels: [1, 2, 3, 4],
            datasets: [
              {
                label: "Sound levels",
                data: [0, 0, 0, 0],
                backgroundColor: [
                  "rgba(255, 99, 132, 0.2)",
                  "rgba(54, 162, 235, 0.2)",
                  "rgba(255, 206, 86, 0.2)",
                  "rgba(75, 192, 192, 0.2)"
                ]
              }
            ]
          },

          // Configuration options go here
          options: {
            responsive: false,
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true
                  }
                }
              ]
            }
          }
        });

        return soundDebugDiv;
      },

      onRemove: function(map) {
        // Nothing to do here
      }
    });

    L.control.soundDebug = function(opts) {
      return new L.Control.SoundDebug(opts);
    };
  }

  render() {
    return (
      <div>
        <div style={style} id="map" />
        {/* <Sound
          center_lat={this.state.center.lat}
          center_lng={this.state.center.lng}
          onChange={this.soundChange}
        /> */}
      </div>
    );
  }
}
