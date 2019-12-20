const _ = require("lodash");

export const img_height = 1080;
export const img_width = 1920;

export const x_count = video_layout =>
  _.max(video_layout.map(l => parseInt(l.x, 10))) + 1;
export const y_count = video_layout =>
  _.max(video_layout.map(l => parseInt(l.y, 10))) + 1;

export const base_url = "https://lifeundertheice.s3.amazonaws.com/";
export const cloudfront_base_url = "https://d30lzybxi44477.cloudfront.net/";

export const init_zoom = -1.6;

export const hls_config = {
  debug: false,
  enableWorker: true,
  capLevelToPlayerSize: true,
  maxBufferSize: 30,
  maxBufferLength: 5
};

export const vid_config = {
  muted: true,
  autoplay: true,
  playsinline: true,
  loop: true,
  controls: true
};

export const style = { height: `${img_height}px`, width: `${img_width}px` };

export const bounds_to_xy = bounds => {
  return {
    x_bottom_left: Math.floor(bounds.getSouthWest().lng / (img_width - 1)),
    y_bottom_left: Math.floor(bounds.getSouthWest().lat / (img_height - 1)),
    x_top_right: Math.floor(bounds.getNorthEast().lng / (img_width - 1)),
    y_top_right: Math.floor(bounds.getNorthEast().lat / (img_height - 1))
  };
};

export const xy_to_bounds = (x, y) => {
  return [
    [(y + 0) * (img_height - 1), (x + 0) * (img_width - 1)],
    [(y + 1) * (img_height + 0), (x + 1) * (img_width + 0)]
  ];
};

export const zoomSettings = () => {
  const screenPixels = window.screen.width * window.screen.height;
  const isMobile = screenPixels < 450 * 900; // bigger than an iPhone X Max
  if (isMobile) {
    return {
      minZoom: -1.5,
      initZoom: -1.01,
      maxZoom: 0.2,
      boundsPad: 0.1
    };
  }
  return {
    minZoom: -0.85,
    initZoom: -0.6,
    maxZoom: -0.1,
    boundsPad: 0.25
  };
};
