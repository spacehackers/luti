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
      const video = ref.leafletElement.getElement();
      this.cachedHls(ref.props.m3u8, true).attachMedia(video);
      /*
      const m3u8 = ref.props.m3u8;
      video.poster = m3u8
        .replace(/-playlist.m3u8/, "-00001.png")
        .replace(/lifeundertheice/, "lifeundertheice-thumbs");
        */
    };

    this.disableVideoM3u8 = ref => {
      const video = ref.leafletElement.getElement();

      video.src = "";
    };

    this.enableVideoM3u8 = ref => {
      const m3u8 = ref.props.m3u8;
      const video = ref.leafletElement.getElement();

      video.src = m3u8;
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
      video.addEventListener("loadedmetadata", () => {});
    };

    this.enableVideo = ref => {
      if (ref === null) return;
      this.addElementToIndex(ref);
      if (this.enabled) {
        return;
      }
      this.enabled = true;

      const video = ref.leafletElement.getElement();
      if (video.tagName !== "VIDEO") return;

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        this.enableVideoM3u8(ref);
        console.log("M3U8 ENABLE VIDEO", video.src);
        return;
      }
      if (Hls.isSupported()) {
        this.enableVideoHls(ref);
        console.log("HLS ENABLE VIDEO", video.src);
        return;
      }
      console.log("NOTHING WORKS TO ENABLE VIDEO");
    };

    this.disableVideo = ref => {
      if (ref === null) return;
      this.addElementToIndex(ref);
      if (!this.enabled) {
        return;
      }
      this.enabled = false;

      const video = ref.leafletElement.getElement();
      if (video.tagName !== "VIDEO") return;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        console.log("M3U8 DISABLE VIDEO", video.src);
        this.disableVideoM3u8(ref);
        return;
      }
      if (Hls.isSupported()) {
        console.log("HLS DISABLE VIDEO", video.src);
        this.disableVideoHls(ref);
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
    if (this.props.debug) {
      debugMarker = <Marker position={textLoc} icon={text} />;
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
