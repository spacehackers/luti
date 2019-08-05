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
  rows,
  img_width,
  img_height,
  base_url,
  all_vid_names,
  init_center,
  init_zoom,
  style,
  all_locs,
  opening_bounds
} from "./vid_config";

const debug = false;

const map_bounds = [[0, 0], [rows * img_height, rows * img_width]];
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
    this.load_all_vids = throttle(this.load_all_vids.bind(this), 50);
    this.handle_key_press = this.handle_key_press.bind(this);
    // this.load_all_vids = this.load_all_vids.bind(this)

    this.soundChange = data => {
      if (!chart) {
        return;
      }
      chart.data.datasets[0].data = data;
      chart.update();
    };
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

    if (debug) {
      this.setup_sound_debug();
      L.control.soundDebug({ position: "topleft" }).addTo(map);
    }

    // let opening_bounds = [
    //   [init_center[0] - img_height, init_center[1] - img_width],
    //   [init_center[0] + img_height, init_center[1] + img_width]
    // ]
    // map.setView(init_center, 0)
    // map.fitBounds(opening_bounds, 0)
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handle_key_press, false);
  }

  componentDidMount() {
    this.setup_map();

    const opening_index = this.get_key_at_loc(all_locs, opening_bounds);
    this.load_vid(opening_bounds, map, opening_index);

    document.addEventListener("keydown", this.handle_key_press, false);

    // // just for the wtf of it all
    // L.marker(L.latLng([0, 0]))
    //   .addTo(map)
    //   .bindPopup("0,0")
    //
    // L.marker(L.latLng(init_center))
    //   .addTo(map)
    //   .bindPopup(`${init_center}`)
    // L.marker(L.latLng(map_bounds[1]))
    //   .addTo(map)
    //   .bindPopup(`${map_bounds[1]}`)

    map.on("click", e => {
      console.log("You clicked the map at", e.latlng);
      console.log("bounds", map.getBounds());
      console.log("center", map.getCenter());
      this.setState({ center: map.getCenter() });
      console.log(`${loaded_locs.length} videos are loaded`);
      console.log(`${playing_vids.length} videos are playing`);
      console.log(loaded_vids);
    });

    map.on("dragend", () => {
      this.load_all_vids();
    });
  }

  handle_key_press(e) {
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
      this.load_all_vids();
    }
  }

  is_loaded(loc) {
    if (loaded_locs.indexOf(loc.toString()) === -1) {
      return false;
    }
    return true;
  }

  get_vid() {
    // random video
    const filename =
      all_vid_names[Math.floor(Math.random() * all_vid_names.length)];
    return `${base_url}${filename}`;
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

  manage_loaded_vids(video_id, action) {
    let video = document.querySelector("#" + video_id);
    // let key = video_id.substring(5)

    console.log("manage_loaded_vids", video_id, action);
    if (action === "pause") {
      if (playing_vids.indexOf(video_id) >= 0) {
        // video is playing
        console.log("pausing ", video_id);
        playing_vids.splice(playing_vids.indexOf(video_id), 1);
        video.pause();
      }
    } else {
      if (playing_vids.indexOf(video_id) === -1) {
        console.log("playing ", video_id);
        playing_vids.push(video_id);
        video.play();
      }
    }
  }

  load_vid(loc, map, key) {
    let url = this.get_vid();
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

  get_key_at_loc(all_locs, bounds) {
    for (var i = 0; i < all_locs.length; i++) {
      // each item is like: [x1,y1][x2,y2]
      if (
        all_locs[i][0][0] === bounds[0][0] &&
        all_locs[i][0][1] === bounds[0][1] &&
        all_locs[i][1][0] === bounds[1][0] &&
        all_locs[i][1][1] === bounds[1][1]
      ) {
        return i; // Found it
      }
    }
    return -1; // Not found
  }

  load_all_vids() {
    all_locs.forEach((loc, key) => {
      if (this.is_loaded(loc)) {
        if (this.is_visible(map, loc)) {
          // loc is loaded but not visible
          this.manage_loaded_vids("video" + key, "play");
        } else {
          this.manage_loaded_vids("video" + key, "pause");
        }
        return;
      } else {
        if (!this.is_visible(map, loc)) return;
      }

      this.load_vid(loc, map, key);
    });
  }

  render() {
    return (
      <div>
        <div style={style} id="map" />
        <Sound
          center_lat={this.state.center.lat}
          center_lng={this.state.center.lng}
          onChange={this.soundChange}
        />
      </div>
    );
  }
}
