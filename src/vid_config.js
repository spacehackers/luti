const _ = require('lodash');

export const img_height = 1080;
export const img_width = 1920;

export const x_count = video_layout =>
  _.max(video_layout.map(l => parseInt(l.x, 10))) + 1;
export const y_count = video_layout =>
  _.max(video_layout.map(l => parseInt(l.y, 10))) + 1;

export const init_center = video_layout =>
  [
    (x_count(video_layout) * img_height) / 2 + img_height / 2,
    (y_count(video_layout) * img_width) / 2 + img_width / 2
  ].map(e => Math.ceil(e));
// export const init_center = [img_height / 2, img_width / 2].map(e => Math.ceil(e));

export const base_url = 'https://lifeundertheice.s3.amazonaws.com/';

export const init_zoom = -0.6;

export const hls_config = {
  debug: false,
  enableWorker: false,
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

export const xy_to_bounds = (x, y) => {
  return [
    [y * img_height, x * img_width],
    [y * img_height + img_height, x * img_width + img_width]
  ];
};
