export const img_height = 1080
export const img_width = 1920

export const rows = 10 // square grid number of rows/columns
export const map_bounds = [[0, 0], [rows * img_height, rows * img_width]]

export const init_center = [
  (rows / 2) * img_height,
  (rows / 2) * img_width
].map(e => Math.ceil(e))

export const base_url = "https://s3.amazonaws.com/lifeundertheice/"

export const init_zoom = -1

export const hls_config = {
  capLevelToPlayerSize: true,
  maxBufferSize: 30,
  maxBufferLength: 5
}

export const vid_config = {
  muted: true,
  autoplay: true,
  loop: true
}

export const style = { height: img_height + "px", width: img_width + "px" }

export const overlap = 10

// builds a list of loc bounds that make a grid based on rows
export const all_locs = []
for (let i = 0; i < rows; i++) {
  for (let j = 0; j < rows; j++) {
    all_locs.push([
      [i * img_height - overlap, j * img_width - overlap],
      [(i + 1) * img_height + overlap, (j + 1) * img_width + overlap]
    ])
  }
}

export const all_vid_names = [
  "112118_CanadaGlacierCryoconite1_NikonE200_10x_PinkRotifer.m3u8",
  "112118_CanadaGlacierCryoconite1_NikonE200_10x_Tardigrade_Beginning.m3u8",
  "112118_CanadaGlacierCryoconite1_NikonE200_10x_Tardigrade_End.m3u8",
  "112118_CanadaGlacierCryoconite1_NikonE200_40x_TwoSpirals_02.m3u8",

  "112118_CanadaGlacierCryoconite1_NikonE200_10x_PinkRotifer.m3u8",
  "112118_CanadaGlacierCryoconite1_NikonE200_10x_Tardigrade_Beginning.m3u8",
  "112118_CanadaGlacierCryoconite1_NikonE200_10x_Tardigrade_End.m3u8",
  "112118_CanadaGlacierCryoconite1_NikonE200_40x_TwoSpirals_02.m3u8",

  "112118_CanadaGlacierCryoconite1_NikonE200_10x_PinkRotifer.m3u8",
  "112118_CanadaGlacierCryoconite1_NikonE200_10x_Tardigrade_Beginning.m3u8",
  "112118_CanadaGlacierCryoconite1_NikonE200_10x_Tardigrade_End.m3u8",
  "112118_CanadaGlacierCryoconite1_NikonE200_40x_TwoSpirals_02.m3u8",

  "112118_CanadaGlacierCryoconite1_NikonE200_10x_PinkRotifer.m3u8",
  "112118_CanadaGlacierCryoconite1_NikonE200_10x_Tardigrade_Beginning.m3u8",
  "112118_CanadaGlacierCryoconite1_NikonE200_10x_Tardigrade_End.m3u8",
  "112118_CanadaGlacierCryoconite1_NikonE200_40x_TwoSpirals_02.m3u8",

  "112118_CanadaGlacierCryoconite1_NikonE200_10x_PinkRotifer.m3u8",
  "112118_CanadaGlacierCryoconite1_NikonE200_10x_Tardigrade_Beginning.m3u8",
  "112118_CanadaGlacierCryoconite1_NikonE200_10x_Tardigrade_End.m3u8",
  "112118_CanadaGlacierCryoconite1_NikonE200_40x_TwoSpirals_02.m3u8",

  "112118_CanadaGlacierCryoconite1_NikonE200_10x_PinkRotifer.m3u8",
  "112118_CanadaGlacierCryoconite1_NikonE200_10x_Tardigrade_Beginning.m3u8",
  "112118_CanadaGlacierCryoconite1_NikonE200_10x_Tardigrade_End.m3u8",
  "112118_CanadaGlacierCryoconite1_NikonE200_40x_TwoSpirals_02.m3u8",

  "112118_CanadaGlacierCryoconite1_NikonE200_10x_PinkRotifer.m3u8"
]
