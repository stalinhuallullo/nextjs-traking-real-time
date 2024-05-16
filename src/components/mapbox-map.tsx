import { useState, useRef, useCallback, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import "mapbox-gl/dist/mapbox-gl.css";

import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css';


interface MapboxMapProps {
  initialOptions?: Omit<mapboxgl.MapboxOptions, "container">;
  onCreated?(map: mapboxgl.Map): void;
  onCreatedDirections?(mapDirections: MapboxDirections): void;
  onLoaded?(map: mapboxgl.Map): void;
  onRemoved?(): void;
}

const MapboxMap = ({
  initialOptions = {},
  onCreated,
  onCreatedDirections,
  onLoaded,
  onRemoved,
}: MapboxMapProps) => {

  const mapNode = useRef(null);

  useEffect(() => {
    const node = mapNode.current;
    if (typeof window === "undefined" || node === null) return;


    const mapboxMap = new mapboxgl.Map({
      container: node,
      accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-74.5, 40],
      zoom: 9,
      ...initialOptions,
    });

    // Generar ruta de bus
    const mapboxDirections = new MapboxDirections({
      accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
      unit: 'metric',
      profile: 'mapbox/driving',
      steps: true,
      overview: 'full',
    });
    mapboxMap.addControl(mapboxDirections, 'top-left');
    


    if (onCreated) onCreated(mapboxMap);
    if (onCreatedDirections) onCreatedDirections(mapboxDirections);
    if (onLoaded) mapboxMap.once("load", () => onLoaded(mapboxMap));

    return () => {
      mapboxMap.remove();
      if (onRemoved) onRemoved();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={mapNode} style={{ width: "100%", height: "100%" }} />;
}

export default MapboxMap;