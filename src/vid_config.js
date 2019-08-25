export const img_height = 1080;
export const img_width = 1920;

export const opening_bounds = [[0, 0], [img_height, img_width]];

export const num_rows = 9;
export const num_cols = 15;

export const init_center = [
  num_cols * img_height / 3,
  num_rows * img_width * 3
].map(e => Math.ceil(e));

export const base_url = "https://s3.amazonaws.com/lifeundertheice/";

export const init_zoom = 0;

export const hls_config = {
  capLevelToPlayerSize: true,
  maxBufferSize: 30,
  maxBufferLength: 5
};

export const vid_config = {
  muted: true,
  autoplay: true,
  loop: true
};

export const style = { height: img_height + "px", width: img_width + "px" };

const overlap = 0; // 1;
// builds a list of loc bounds that make a grid based on rows, with small overlaps

export const all_locs = [];
for (let i = 0; i < num_rows; i++) {
  for (let j = 0; j < num_cols; j++) {
    all_locs.push([
      [i * img_height - overlap, j * img_width - overlap],
      [(i + 1) * img_height + overlap, (j + 1) * img_width + overlap]
    ]);
  }
}
