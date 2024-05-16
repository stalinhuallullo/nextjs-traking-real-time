"use client";
import { useState, useRef, useCallback } from "react";

import classes from "@/app/(prueba)/location/Page.module.css";
import MapboxMap from "@/components/mapbox-map";
import mapboxgl from "mapbox-gl";
import MapLoadingHolder from "@/components/map-loading-holder";
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import "mapbox-gl/dist/mapbox-gl.css";

import mapbox from "@/utils/map-wrapper";

const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

export default function Home() {
    const [loading, setLoading] = useState(true);
    const handleMapLoading = () => setLoading(false);

    const [directions, setDirections] = useState<MapboxDirections | null>(null);
    const [routeCoords, setRouteCoords] = useState<mapboxgl.LngLat[]>([]);
    const [isSimulating, setIsSimulating] = useState(false);


    const [viewport, setViewport] = useState({
        center: ["-77.0248", "-12.0925"],
        zoom: "13.00",
    });

    const {
        center: [lng, lat],
        zoom,
    } = viewport;

    const onMapCreated = useCallback((map: mapboxgl.Map) => {
        mapbox.map = map;

        mapbox.map.on("move", () => {
            setViewport({
                center: [
                    mapbox.map.getCenter().lng.toFixed(4),
                    mapbox.map.getCenter().lat.toFixed(4),
                ],
                zoom: mapbox.map.getZoom().toFixed(2),
            });
        });

        /*mapbox.map.on('click', (event) => {
            const color = getRandomColor();
            const markerElement = document.createElement('div');
            markerElement.style.backgroundColor = color;
            markerElement.style.width = '30px';
            markerElement.style.height = '30px';
            markerElement.style.borderRadius = '50%';

            new mapboxgl.Marker(markerElement)
                .setLngLat([event.lngLat.lng, event.lngLat.lat])
                .addTo(map);
        });*/

    }, []);

    const onMapCreatedDirections = useCallback((mapDirections: MapboxDirections) => {
        mapDirections.on('route', (e: any) => {
            const coords = e.route[0].geometry.coordinates.map((coord: [number, number]) => new mapboxgl.LngLat(coord[0], coord[1]));
            setRouteCoords(coords);
          });

          setDirections(mapDirections);
    }, []);

    const simulateRoute = () => {
        if (!routeCoords.length) return;
    
        let index = 0;
        const marker = new mapboxgl.Marker().setLngLat(routeCoords[0]).addTo(map);
    
        const moveMarker = () => {
          if (index < routeCoords.length) {
            marker.setLngLat(routeCoords[index]);
            index++;
            requestAnimationFrame(moveMarker);
          }
        };
    
        setIsSimulating(true);
        moveMarker();
      };


    return (
        <main className={classes.mainStyle}>
            <div className="map-wrapper">
                <div className="viewport-panel">
                    Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
                </div>
                <MapboxMap
                    //initialOptions={{ center: [38.0983, 55.7038] }}
                    onLoaded={handleMapLoading}
                    onCreated={onMapCreated}
                    onCreatedDirections={onMapCreatedDirections}
                    initialOptions={{ center: [+lng, +lat], zoom: +zoom }}
                />
            </div>
            <button onClick={simulateRoute} disabled={isSimulating || !routeCoords.length}>
                Simular
            </button>
            {loading && <MapLoadingHolder className="loading-holder" />}
        </main>
    );
}
