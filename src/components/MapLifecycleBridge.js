import { useEffect } from "react";
import { useMapEvents } from "react-leaflet";

export default function MapLifecycleBridge({ onMapReady, onMove }) {
  const map = useMapEvents({
    move: () => {
      if (onMove) {
        onMove();
      }
    },
  });

  useEffect(() => {
    if (onMapReady) {
      onMapReady(map);
    }
  }, [map, onMapReady]);

  return null;
}
