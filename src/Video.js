import React from "react";
import { Marker, Rectangle, ImageOverlay, VideoOverlay } from "react-leaflet";
import L from "leaflet";
import Hls from "hls.js";
import { hls_config } from "./vid_config";

const VIDEO_EVENTS = [
  "playing",
  "canplay",
  "canplaythrough",
  "play",
  "loadedmetadata",
  "loadeddata",
  "ratechange",
  "waiting",
  "ended",
  "pause",
  "suspend",
  "emptied",
  "stalled"
];

export default class Video extends React.Component {
  loaded = false;

  enabled = false;

  hls = undefined;

  cachedHls = (m3u8, autocreate) => {
    if (autocreate && this.hls === undefined) {
      const hls = new Hls(hls_config);
      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        hls.loadSource(m3u8);
        this.configureVideo(hls.media);
      });
      hls.on(Hls.Events.MEDIA_DETACHED, () => {
        this.removeVideoListeners(hls.media);
      });
      this.hls = hls;
    }
    return this.hls;
  };

  addVideoListeners = video => {
    VIDEO_EVENTS.forEach(name =>
      video.addEventListener(name, this.props.eventLogger)
    );
  };

  removeVideoListeners = video => {
    VIDEO_EVENTS.forEach(name =>
      video.removeEventListener(name, this.props.eventLogger)
    );
  };

  disableVideoHls = () => {
    const hls = this.cachedHls(this.props.m3u8, false);
    if (hls) {
      hls.detachMedia();
    }
  };

  disableVideoM3u8 = ref => {
    const video = ref.leafletElement.getElement();
    this.removeVideoListeners(video);

    video.pause();
    video.removeAttribute("src");
    video.load();
  };

  /* eslint-disable no-param-reassign */
  configureVideo = video => {
    video.style.border = "1px solid rgb(0, 0, 0, 0.0)";
    video.width = 1920;
    video.height = 1080;
    /*
      video.poster = m3u8
        .replace(/-playlist.m3u8/, "-00001.png")
        .replace(/lifeundertheice/, "lifeundertheice-thumbs");
        */
    video.crossOrigin = "Anonymous";
    video.playsInline = true;
    video.muted = true;
    video.loop = true;
    video.style.objectFit = "cover";
    this.addVideoListeners(video);
  };
  /* eslint-enable no-param-reassign */

  enableVideoM3u8 = ref => {
    const m3u8 = ref.props.m3u8;
    const video = ref.leafletElement.getElement();

    video.src = m3u8;
    this.configureVideo(video);
  };

  enableVideoHls = ref => {
    const m3u8 = ref.props.m3u8;
    const video = ref.leafletElement.getElement();

    this.cachedHls(m3u8, true).attachMedia(video);
  };

  enableVideo = ref => {
    if (ref === null) return;
    if (this.enabled) {
      return;
    }
    this.enabled = true;

    const video = ref.leafletElement.getElement();
    this.showCanplayStatus(video, this.props.canplay);
    if (video.tagName !== "VIDEO") return;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      this.enableVideoM3u8(ref);
      console.debug("M3U8 ENABLE VIDEO", video.src);
      return;
    }
    if (Hls.isSupported()) {
      this.enableVideoHls(ref);
      console.debug("HLS ENABLE VIDEO", video.src);
      return;
    }
    console.debug("NOTHING WORKS TO ENABLE VIDEO");
  };

  disableVideo = ref => {
    if (ref === null) return;
    if (!this.enabled) {
      return;
    }
    this.enabled = false;

    const video = ref.leafletElement.getElement();
    this.showCanplayStatus(video, this.props.canplay);
    if (video.tagName !== "VIDEO") return;
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      console.debug("M3U8 DISABLE VIDEO", video.src);
      this.disableVideoM3u8(ref);
      return;
    }
    if (Hls.isSupported()) {
      console.debug("HLS DISABLE VIDEO", video.src);
      this.disableVideoHls(ref);
      return;
    }
    console.debug("NOTHING WORKS TO DISABLE VIDEO");
  };

  showCanplayStatus = (video, canplay) => {
    if (canplay) {
      video.classList.remove("video-loading");
      video.classList.add("video-playing");
    } else {
      video.classList.add("video-loading");
      video.classList.remove("video-playing");
    }
  };

  render() {
    if (!this.loaded) {
      if (!this.props.visible) {
        return null;
      }
      this.loaded = true;
    }

    const text = L.divIcon({
      html: `${this.props.id} ${this.props.debugMessage}
      <br />
      canplay: ${this.props.canplay} bounds: ${JSON.stringify(
        this.props.bounds
      )} x,y: ${JSON.stringify(this.props.xy)}`
    });
    const textLoc = [
      this.props.bounds[0][0] + 1000,
      this.props.bounds[0][1] + 100
    ];
    let debugMarker = <></>;
    if (this.props.debug) {
      debugMarker = <Marker position={textLoc} icon={text} />;
      return (
        <Rectangle
          id={this.props.id}
          key={`${this.props.id}-rect`}
          bounds={this.props.bounds}
          color={this.props.visible ? "#f00" : "#0f0"}
        >
          {debugMarker}
        </Rectangle>
      );
    }

    const callback = ref =>
      requestAnimationFrame(() =>
        this.props.visible ? this.enableVideo(ref) : this.disableVideo(ref)
      );

    return (
      <>
        <VideoOverlay
          {...this.props}
          url=""
          ref={callback}
          key={`video-${this.props.id}`}
        >
          {debugMarker}
        </VideoOverlay>
        {this.props.spinnerTest && !this.props.canplay && (
          <ImageOverlay
            bounds={this.props.bounds}
            key={`image-${this.props.id}`}
            url="/grey-1920x1080.png"
          />
        )}
      </>
    );
  }
}
