"use client";
import { useState, useRef, useCallback } from "react";

import classes from "@/app/(prueba)/location/Page.module.css";
import MapboxMap from "@/components/mapbox-map";
import mapboxgl from "mapbox-gl";
import MapLoadingHolder from "@/components/loading/map-loading-holder";
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import { getMatchedRoute } from '@/utils/map-box/mapMatching';
import mapbox from "@/utils/map-wrapper";

import "mapbox-gl/dist/mapbox-gl.css";


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





    const onMapCreated = useCallback((mapInstance: mapboxgl.Map) => {
        mapbox.map = mapInstance;

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

    const onCreatedMapDraw = useCallback((drawInstance: MapboxDraw, mapInstance: mapboxgl.Map) => {
        // Load saved points from localStorage
        const savedPoints = localStorage.getItem('savedPoints');
        if (savedPoints) {
            const parsedPoints = JSON.parse(savedPoints);
            drawInstance.add(parsedPoints);
            drawRoute(parsedPoints.geometry.coordinates, mapInstance);
        }

        mapbox.map.on('draw.create', async (e) => {
            handleDrawCreate(e, mapInstance)
        });
    }, [])

    const handleDrawCreate = async (e: any, mapInstance: mapboxgl.Map) => {
        const coordinates = e.features[0].geometry.coordinates;
        await drawRoute(coordinates, mapInstance!);

        // Save points to localStorage
        localStorage.setItem('savedPoints', JSON.stringify(e.features[0]));
    };

    const drawRoute = async (coordinates: number[][], mapInstance: mapboxgl.Map) => {
        localStorage.setItem("_DRAWROUTE_", coordinates.toString())
        const matchedRoute = await getMatchedRoute(coordinates);

        if (matchedRoute && matchedRoute.matchings && matchedRoute.matchings[0]) {
            const route = matchedRoute.matchings[0].geometry;
            localStorage.setItem("_DRAWROUTE_ROUTE_", route.toString())

            console.log("route ===> " + JSON.stringify(route))

            // if (mapInstance.getSource('route') != undefined) {
            //     (mapInstance.getSource('route') as mapboxgl.GeoJSONSource).setData(route);
            // } else {
            mapInstance.addLayer({
                id: 'route',
                type: 'line',
                source: {
                    type: 'geojson',
                    data: route
                },
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                paint: {
                    'line-color': '#1DB954',
                    'line-width': 4
                }
            });
            // }
        }
    };



    const onMapCreatedDirections = useCallback((mapDirections: MapboxDirections) => {
        mapDirections.on('route', (e: any) => {
            const coords = e.route[0].geometry.coordinates.map((coord: [number, number]) => new mapboxgl.LngLat(coord[0], coord[1]));
            setRouteCoords(coords);
        });

        setDirections(mapDirections);
    }, []);


    return (
        <main className="fullscreen">
            {/* <div className="map-wrapper">
                <div className="viewport-panel">
                    Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
                </div> */}
            {/* <div className="info-box">
                    <p>
                        Draw your route using the draw tools on the right. To get the most accurate
                        route match, draw points at regular intervals.
                    </p>
                    <div id="directions"></div>
                </div> */}
            <MapboxMap
                //initialOptions={{ center: [38.0983, 55.7038] }}
                onLoaded={handleMapLoading}
                onCreated={onMapCreated}
                onCreatedMapDraw={onCreatedMapDraw}
                //onCreatedDirections={onMapCreatedDirections}
                initialOptions={{ center: [+lng, +lat], zoom: +zoom }}
            />
            {/* </div> */}
            {loading && <MapLoadingHolder className="loading-holder" />}
        </main>
    );
}
