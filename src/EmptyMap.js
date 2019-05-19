import React from "react"
import { Map, ImageOverlay, Marker, Popup } from "react-leaflet"
import L from "leaflet"

const bounds = [[0, 0], [50000, 50000]]
const style = { height: "80vh", width: "75vw" }

export default class EmptyMap extends React.Component {
  render() {
    const init_zoom = -1
    return (
      <Map
        crs={L.CRS.Simple}
        center={[0, 0]}
        minZoom={-1}
        minZoom={init_zoom - 1}
        maxZoom={init_zoom + 4}
        bounds={bounds}
        style={style}
      />
    )
  }
}
