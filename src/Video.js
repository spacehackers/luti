import React from "react";
import { Marker, Rectangle, VideoOverlay } from "react-leaflet";
import L from "leaflet";
import Hls from "hls.js";
import { hls_config } from "./vid_config";

export default class Video extends React.Component {
  constructor(props) {
    super(props);
    this.addElementToIndex = ref => {
      if (ref === null) return;
      if (this.props.indexFunc) {
        this.props.indexFunc(ref.leafletElement);
      }
    };

    this.enabled = false;
    this.hls = {};
    this.cachedHls = (m3u8, autocreate) => {
      if (autocreate && !(m3u8 in this.hls)) {
        const hls = new Hls(hls_config);
        hls.on(Hls.Events.MEDIA_ATTACHED, () => {
          // console.log("HLS ATTACHED", hls.media);
          hls.loadSource(m3u8);
          hls.media.muted = true;
          hls.media.loop = true;
          hls.media.autoplay = false;
          hls.media.play();
        });
        hls.on(Hls.Events.MEDIA_DETACHED, () => {
          // console.log("HLS DETACHED", hls.media);
        });
        this.hls[m3u8] = hls;
      }
      return this.hls[m3u8];
    };

    this.disableVideoHls = ref => {
      const hls = this.cachedHls(ref.props.m3u8, false);
      if (hls) {
        hls.detachMedia();
      }
    };

    this.enableVideoHls = ref => {
      const m3u8 = ref.props.m3u8;
      const video = ref.leafletElement.getElement();
      this.cachedHls(ref.props.m3u8, true).attachMedia(video);
      video.poster = m3u8
        .replace(/\.m3u8/, "-00001.png")
        .replace(/lifeundertheice/, "lifeundertheice-thumbs");
    };

    this.disableVideoM3u8 = ref => {
      const video = ref.leafletElement.getElement();

      video.src = "";
    };

    this.enableVideoM3u8 = ref => {
      const m3u8 = ref.props.m3u8;
      const video = ref.leafletElement.getElement();

      console.log("video.src = ", m3u8);

      video.src = m3u8;
      video.width = 1920;
      video.height = 1080;
      video.poster = m3u8
        .replace(/\.m3u8/, "-00001.png")
        .replace(/lifeundertheice/, "lifeundertheice-thumbs");
      video.crossOrigin = "Anonymous";
      video.playsInline = true;
      video.addEventListener("loadedmetadata", () => {
        console.log("IM PLAYING");
      });
    };

    this.enableVideo = ref => {
      if (ref === null) return;
      this.addElementToIndex(ref);
      if (this.enabled) {
        console.log("VIDEO ALREADY ENABLED");
        return;
      }
      this.enabled = true;

      const video = ref.leafletElement.getElement();
      if (video.tagName !== "VIDEO") return;

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        this.enableVideoM3u8(ref);
        console.log("M3U8 ENABLE VIDEO");
        return;
      }
      if (Hls.isSupported()) {
        this.enableVideoHls(ref);
        console.log("HLS ENABLE VIDEO");
        return;
      }
      console.log("NOTHING WORKS TO ENABLE VIDEO");
    };

    this.disableVideo = ref => {
      if (ref === null) return;
      this.addElementToIndex(ref);
      if (!this.enabled) {
        console.log("VIDEO ALREADY DISABLED");
        return;
      }
      this.enabled = false;

      const video = ref.leafletElement.getElement();
      if (video.tagName !== "VIDEO") return;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        this.disableVideoM3u8(ref);
        console.log("M3U8 DISABLE VIDEO");
        return;
      }
      if (Hls.isSupported()) {
        this.disableVideoHls(ref);
        console.log("HLS DISABLE VIDEO");
        return;
      }
      console.log("NOTHING WORKS TO DISABLE VIDEO");
    };
  }

  render() {
    const text = L.divIcon({
      html: `${this.props.id} visible: ${
        this.props.visible
      } bounds: ${JSON.stringify(this.props.bounds)} x,y: ${JSON.stringify(
        this.props.xy
      )}`
    });
    const textLoc = [
      this.props.bounds[0][0] + 1000,
      this.props.bounds[0][1] + 100
    ];
    let debugMarker = <></>;
    if (this.props.showVideoName) {
      debugMarker = <Marker position={textLoc} icon={text} />;
    }
    if (this.props.debug) {
      return (
        <Rectangle
          id={this.props.id}
          key={this.key}
          bounds={this.props.bounds}
          ref={this.addElementToIndex}
          color={this.props.visible ? "#f00" : "#0f0"}
        >
          {debugMarker}
        </Rectangle>
      );
    }

    const callback = this.props.visible ? this.enableVideo : this.disableVideo;
    return (
      <VideoOverlay
        {...this.props}
        url=""
        ref={callback}
        key={`video-${this.key}`}
      >
        {debugMarker}
      </VideoOverlay>
    );
  }
}
