import React from 'react';
import { Marker, Rectangle, VideoOverlay } from 'react-leaflet';
import L from 'leaflet';
import Hls from 'hls.js';
import { hls_config } from './vid_config';

export default class Video extends React.Component {
  constructor(props) {
    super(props);
    this.addElementToIndex = ref => {
      if (ref === null) return;
      if (this.props.indexFunc) {
        this.props.indexFunc(ref.leafletElement);
      }
    };

    this.hls = {};
    this.cachedHls = (m3u8, autocreate) => {
      if (autocreate && !(m3u8 in this.hls)) {
        console.log('CREATING HLS FOR', m3u8);
        const hls = new Hls(hls_config);
        hls.loadSource(m3u8);
        hls.on(Hls.Events.MEDIA_ATTACHED, () => {
          console.log('ATTACHED', hls.media);
          hls.media.muted = true;
          hls.media.loop = true;
          hls.media.autoplay = false;
          hls.media.play();
        });
        hls.on(Hls.Events.MEDIA_DETACHED, () => {
          console.log('DETACHED', hls.media);
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
      this.cachedHls(ref.props.m3u8, true).attachMedia(
        ref.leafletElement.getElement()
      );
    };

    this.disableVideoM3u8 = ref => {
      const video = ref.leafletElement.getElement();

      video.src = '';
    };

    this.enableVideoM3u8 = ref => {
      const m3u8 = ref.props.m3u8;
      const video = ref.leafletElement.getElement();

      console.log('video.src = ', m3u8);
      video.src = m3u8;
      video.addEventListener('loadedmetadata', () => {
        console.log('IM PLAYING');
      });
    };

    this.enableVideo = ref => {
      if (ref === null) return;
      this.addElementToIndex(ref);

      const video = ref.leafletElement.getElement();
      if (video.tagName !== 'VIDEO') return;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        this.enableVideoM3u8(ref);
        console.log('M3U8 TO ENABLE VIDEO');
        return;
      }
      if (Hls.isSupported()) {
        this.enableVideoHls(ref);
        console.log('HLS TO ENABLE VIDEO');
        return;
      }
      console.log('NOTHING WORKS TO ENABLE VIDEO');
    };

    this.disableVideo = ref => {
      if (ref === null) return;
      this.addElementToIndex(ref);

      const video = ref.leafletElement.getElement();
      if (video.tagName !== 'VIDEO') return;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        this.disableVideoM3u8(ref);
        console.log('M3U8 TO DISABLE VIDEO');
        return;
      }
      if (Hls.isSupported()) {
        this.disableVideoHls(ref);
        console.log('HLS TO DISABLE VIDEO');
        return;
      }
      console.log('NOTHING WORKS TO DISABLE VIDEO');
    };
  }

  render() {
    const text = L.divIcon({ html: this.props.id });
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
          color={this.props.color}
        >
          {debugMarker}
        </Rectangle>
      );
    }

    const callback = this.props.visible ? this.enableVideo : this.disableVideo;
    return (
      <VideoOverlay
        {...this.props}
        url={(this.props.visible && this.props.m3u8) || ''}
        ref={callback}
        key={`video-${this.key}`}
      >
        {debugMarker}
      </VideoOverlay>
    );
  }
}
