import React, { Component } from "react"
import Hls from "hls.js"

const base_url =
  "https://s3.amazonaws.com/lifeundertheice/112118_CanadaGlacierCryoconite1_NikonE200_10x_PinkRotifer.m3u8"

export default class Player extends React.Component {
  state = {}

  componentDidMount() {
    if (Hls.isSupported() && this.player) {
      const video = this.player
      const hls = new Hls()
      hls.loadSource(base_url)
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED, function() {
        video.play()
      })
    }
  }

  render() {
    return (
      <video
        preload="none"
        className="videoCanvas"
        ref={player => (this.player = player)}
        autoPlay={true}
      />
    )
  }
}
