import { useState, useRef, useCallback, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import MapboxDraw from '@mapbox/mapbox-gl-draw';

import "mapbox-gl/dist/mapbox-gl.css";
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';


interface MapboxMapProps {
  initialOptions?: Omit<mapboxgl.MapboxOptions, "container">;
  onCreated?(map: mapboxgl.Map): void;
  onCreatedMapDraw?(draw: MapboxDraw, map: mapboxgl.Map): void;
  //onCreatedDirections?(mapDirections: MapboxDirections): void;
  onLoaded?(map: mapboxgl.Map): void;
  onRemoved?(): void;
}

const MapboxMap = ({
  initialOptions = {},
  onCreated,
  onCreatedMapDraw,
  //onCreatedDirections,
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
    /*const mapboxDirections = new MapboxDirections({
      accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
      unit: 'metric',
      profile: 'mapbox/driving',
      steps: true,
      overview: 'full',
    });
    mapboxMap.addControl(mapboxDirections, 'top-left');*/

    // Dibujar ruta de acuerdo a los puntos marcados
    const draw = new MapboxDraw({
      // Instead of showing all the draw tools, show only the line string and delete tools.
      displayControlsDefault: false,
      controls: {
        line_string: true,
        trash: true
      },
      // Set the draw mode to draw LineStrings by default.
      defaultMode: 'draw_line_string',
      styles: [
        // Set the line style for the user-input coordinates.
        {
          id: 'gl-draw-line',
          type: 'line',
          filter: ['all', ['==', '$type', 'LineString'], ['!=', 'mode', 'static']],
          layout: {
            'line-cap': 'round',
            'line-join': 'round'
          },
          paint: {
            'line-color': '#438EE4',
            'line-dasharray': [0.2, 2],
            'line-width': 4,
            'line-opacity': 0.7
          }
        },
        // Style the vertex point halos.
        {
          id: 'gl-draw-polygon-and-line-vertex-halo-active',
          type: 'circle',
          filter: [
            'all',
            ['==', 'meta', 'vertex'],
            ['==', '$type', 'Point'],
            ['!=', 'mode', 'static']
          ],
          paint: {
            'circle-radius': 12,
            'circle-color': '#FFF'
          }
        },
        // Style the vertex points.
        {
          id: 'gl-draw-polygon-and-line-vertex-active',
          type: 'circle',
          filter: [
            'all',
            ['==', 'meta', 'vertex'],
            ['==', '$type', 'Point'],
            ['!=', 'mode', 'static']
          ],
          paint: {
            'circle-radius': 8,
            'circle-color': '#438EE4'
          }
        }
      ]
    });
    mapboxMap.addControl(draw);


    
    if (onCreated) onCreated(mapboxMap);
    if (onCreatedMapDraw) onCreatedMapDraw(draw, mapboxMap);
    //if (onCreatedDirections) onCreatedDirections(mapboxDirections);
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