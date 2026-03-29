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
  "stalled",
];

export default class Video extends React.Component {
  static startupQueue = [];

  static activeStartupCount = 0;

  static STARTUP_LIMIT = 4;

  loaded = false;

  enabled = false;

  hls = undefined;

  hlsMediaRecoveryAttempts = 0;

  hlsNetworkRecoveryAttempts = 0;

  imageFailed = false;

  componentWillUnmount() {
    this.disableCurrentOverlay();
  }

  setOverlayRef = (ref) => {
    this.overlayRef = ref;
    if (ref === null) {
      return;
    }
    requestAnimationFrame(() =>
      this.props.renderMode === "video"
        ? this.enableVideo(ref)
        : this.disableVideo(ref)
    );
  };

  getVideoElement = (overlay) => {
    if (!overlay) {
      return null;
    }
    if (typeof overlay.getElement === "function") {
      return overlay.getElement();
    }
    if (
      overlay.leafletElement &&
      typeof overlay.leafletElement.getElement === "function"
    ) {
      return overlay.leafletElement.getElement();
    }
    return null;
  };

  ensurePlayback = (video) => {
    if (!video) {
      return;
    }
    const playAttempt = video.play();
    if (playAttempt && typeof playAttempt.catch === "function") {
      playAttempt.catch(() => {});
    }
  };

  shouldUseNativeHls = (video) => {
    const canPlayNativeHls = !!video?.canPlayType(
      "application/vnd.apple.mpegurl"
    );
    if (!canPlayNativeHls) {
      return false;
    }

    const vendor = window.navigator.vendor || "";
    const userAgent = window.navigator.userAgent || "";
    const isAppleBrowserEngine =
      vendor.includes("Apple") &&
      !/CriOS|Chrome|Chromium|Edg|OPR|Firefox|FxiOS|Android/i.test(userAgent);

    return isAppleBrowserEngine;
  };

  logPlaybackEvent = (eventName, extra = {}) => {
    window.__videoDebug = window.__videoDebug || {};
    window.__videoDebug[this.props.id] = {
      lastEvent: eventName,
      extra,
      at: Date.now(),
    };
    console.debug(`[video:${this.props.id}] ${eventName}`, extra);
  };

  canStartQueuedVideo = () =>
    !!this.pendingStartupRef &&
    !!this.overlayRef &&
    this.enabled &&
    this.props.renderMode === "video" &&
    !this.startupSlotHeld;

  processStartupQueue = () => {
    Video.startupQueue.sort(
      (left, right) =>
        (left.props.startupPriority || 0) - (right.props.startupPriority || 0)
    );
    while (
      Video.activeStartupCount < Video.STARTUP_LIMIT &&
      Video.startupQueue.length > 0
    ) {
      const next = Video.startupQueue.shift();
      if (next && next.canStartQueuedVideo()) {
        next.startQueuedHls();
      }
    }
  };

  removeFromStartupQueue = () => {
    Video.startupQueue = Video.startupQueue.filter((item) => item !== this);
  };

  releaseStartupSlot = () => {
    if (!this.startupSlotHeld) {
      return;
    }
    this.startupSlotHeld = false;
    Video.activeStartupCount = Math.max(0, Video.activeStartupCount - 1);
    this.processStartupQueue();
  };

  clearStartupRequest = () => {
    this.pendingStartupRef = null;
    this.removeFromStartupQueue();
    this.releaseStartupSlot();
  };

  cachedHls = (m3u8, autocreate) => {
    if (autocreate && this.hls === undefined) {
      const hls = new Hls(hls_config);
      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        this.logPlaybackEvent("hls:attached");
        hls.loadSource(m3u8);
        this.configureVideo(hls.media);
        this.ensurePlayback(hls.media);
      });
      hls.on(Hls.Events.MANIFEST_PARSED, (_event, data) => {
        this.hlsMediaRecoveryAttempts = 0;
        this.hlsNetworkRecoveryAttempts = 0;
        this.logPlaybackEvent("hls:manifest-parsed", {
          levels: data.levels?.length || 0,
        });
      });
      hls.on(Hls.Events.MEDIA_DETACHED, () => {
        this.releaseStartupSlot();
        this.logPlaybackEvent("hls:detached");
        this.removeVideoListeners(hls.media);
      });
      hls.on(Hls.Events.ERROR, (_event, data) => {
        this.logPlaybackEvent("hls:error", {
          type: data.type,
          details: data.details,
          fatal: data.fatal,
        });

        if (!data.fatal) {
          return;
        }

        if (
          data.type === Hls.ErrorTypes.NETWORK_ERROR &&
          this.hlsNetworkRecoveryAttempts < 1
        ) {
          this.hlsNetworkRecoveryAttempts += 1;
          this.logPlaybackEvent("hls:recover-network");
          hls.startLoad();
          return;
        }

        if (
          data.type === Hls.ErrorTypes.MEDIA_ERROR &&
          this.hlsMediaRecoveryAttempts < 1
        ) {
          this.hlsMediaRecoveryAttempts += 1;
          this.logPlaybackEvent("hls:recover-media");
          hls.recoverMediaError();
          return;
        }

        this.logPlaybackEvent("hls:destroy-after-fatal");
        this.releaseStartupSlot();
        hls.destroy();
        this.hls = undefined;
      });
      this.hls = hls;
    }
    return this.hls;
  };

  createVideoEventHandler = (name) => {
    if (!this.videoEventHandlers) {
      this.videoEventHandlers = {};
    }
    if (!this.videoEventHandlers[name]) {
      this.videoEventHandlers[name] = (evt) => {
        if (
          evt.type === "canplay" ||
          evt.type === "canplaythrough" ||
          evt.type === "loadeddata"
        ) {
          this.releaseStartupSlot();
          this.ensurePlayback(evt.target);
        }
        if (
          evt.type === "playing" ||
          evt.type === "waiting" ||
          evt.type === "stalled"
        ) {
          if (evt.type === "playing") {
            this.releaseStartupSlot();
          }
          this.logPlaybackEvent(`media:${evt.type}`, {
            currentTime: evt.target.currentTime,
            readyState: evt.target.readyState,
          });
        }
        this.props.eventLogger(evt);
      };
    }
    return this.videoEventHandlers[name];
  };

  addVideoListeners = (video) => {
    VIDEO_EVENTS.forEach((name) =>
      video.addEventListener(name, this.createVideoEventHandler(name))
    );
  };

  removeVideoListeners = (video) => {
    VIDEO_EVENTS.forEach((name) =>
      video.removeEventListener(name, this.createVideoEventHandler(name))
    );
  };

  destroyHls = () => {
    this.clearStartupRequest();
    const hls = this.cachedHls(this.props.m3u8, false);
    if (hls) {
      hls.destroy();
      this.hls = undefined;
    }
    this.hlsMediaRecoveryAttempts = 0;
    this.hlsNetworkRecoveryAttempts = 0;
  };

  disableVideoHls = () => {
    const hls = this.cachedHls(this.props.m3u8, false);
    if (hls) {
      hls.detachMedia();
    }
  };

  disableVideoM3u8 = (ref) => {
    const video = this.getVideoElement(ref);
    if (!video) {
      return;
    }
    this.removeVideoListeners(video);
    video.pause();
    video.removeAttribute("src");
    delete video.dataset.videoId;
    video.load();
  };

  disableCurrentOverlay = () => {
    this.clearStartupRequest();
    if (this.overlayRef) {
      this.disableVideo(this.overlayRef);
      this.overlayRef = null;
      return;
    }
    if (!this.enabled) {
      return;
    }
    this.enabled = false;
    this.destroyHls();
  };

  /* eslint-disable no-param-reassign */
  configureVideo = (video) => {
    video.style.border = "1px solid rgb(0, 0, 0, 0.0)";
    video.width = 1920;
    video.height = 1080;
    video.crossOrigin = "Anonymous";
    video.playsInline = true;
    video.muted = true;
    video.loop = true;
    video.autoplay = true;
    video.preload = "auto";
    video.style.objectFit = "cover";
    video.dataset.videoId = this.props.id;
    this.addVideoListeners(video);
    this.ensurePlayback(video);
  };
  /* eslint-enable no-param-reassign */

  enableVideoM3u8 = (ref) => {
    const { m3u8 } = this.props;
    const video = this.getVideoElement(ref);
    if (!video) {
      return;
    }
    video.src = m3u8;
    this.configureVideo(video);
  };

  enableVideoHls = (ref) => {
    const { m3u8 } = this.props;
    const video = this.getVideoElement(ref);
    if (!video) {
      return;
    }
    this.cachedHls(m3u8, true).attachMedia(video);
  };

  startQueuedHls = () => {
    if (!this.canStartQueuedVideo()) {
      return;
    }
    this.startupSlotHeld = true;
    Video.activeStartupCount += 1;
    this.enableVideoHls(this.pendingStartupRef);
  };

  requestQueuedHls = (ref) => {
    this.pendingStartupRef = ref;
    this.removeFromStartupQueue();
    if (Video.activeStartupCount < Video.STARTUP_LIMIT) {
      this.startQueuedHls();
      return;
    }
    Video.startupQueue.push(this);
  };

  enableVideo = (ref) => {
    if (ref === null || this.props.renderMode !== "video") {
      return;
    }
    if (this.enabled) {
      return;
    }

    const video = this.getVideoElement(ref);
    if (!video) {
      requestAnimationFrame(() => {
        if (
          this.overlayRef === ref &&
          this.props.renderMode === "video" &&
          !this.enabled
        ) {
          this.enableVideo(ref);
        }
      });
      return;
    }
    if (video.tagName !== "VIDEO") {
      requestAnimationFrame(() => {
        if (
          this.overlayRef === ref &&
          this.props.renderMode === "video" &&
          !this.enabled
        ) {
          this.enableVideo(ref);
        }
      });
      return;
    }
    this.enabled = true;
    this.showCanplayStatus(video, this.props.canplay);

    if (this.shouldUseNativeHls(video)) {
      this.enableVideoM3u8(ref);
      return;
    }
    if (Hls.isSupported()) {
      this.requestQueuedHls(ref);
    }
  };

  disableVideo = (ref) => {
    if (ref === null || !this.enabled) {
      return;
    }
    this.enabled = false;

    const video = this.getVideoElement(ref);
    if (!video) {
      this.destroyHls();
      return;
    }
    this.showCanplayStatus(video, this.props.canplay);
    if (video.tagName !== "VIDEO") {
      return;
    }
    if (this.shouldUseNativeHls(video)) {
      this.disableVideoM3u8(ref);
      return;
    }
    if (Hls.isSupported()) {
      this.clearStartupRequest();
      this.disableVideoHls();
    }
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
      )} x,y: ${JSON.stringify(this.props.xy)}`,
    });
    const textLoc = [
      this.props.bounds[0][0] + 1000,
      this.props.bounds[0][1] + 100,
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

    if (this.props.renderMode === "hidden") {
      if (this.enabled) {
        this.disableCurrentOverlay();
      }
      return null;
    }

    if (this.props.renderMode === "still" && !this.imageFailed) {
      if (this.enabled) {
        this.disableCurrentOverlay();
      }
      return (
        <>
          <ImageOverlay
            bounds={this.props.bounds}
            key={`still-${this.props.id}`}
            url={this.props.stillUrl}
            errorOverlayUrl=""
            opacity={1}
            eventHandlers={{
              error: () => {
                this.imageFailed = true;
                this.forceUpdate();
              },
            }}
          />
          {debugMarker}
        </>
      );
    }

    return (
      <>
        <VideoOverlay
          {...this.props}
          url=""
          ref={this.setOverlayRef}
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
