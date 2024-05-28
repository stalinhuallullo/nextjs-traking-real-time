"use client";

import { useCallback, useContext, useEffect, useState } from "react";
import MapboxMap from "@/components/mapbox-map";
import MapLoadingHolder from "@/components/loading/map-loading-holder";
import { getMatchedRoute } from "@/utils/map-box/mapMatching";
import mapbox from "@/utils/map-wrapper";
import mapboxgl from "mapbox-gl";
import { fetchGET } from "@/utils/fetcher";
import { UIContext } from "@/context/ui";
import { Live, RoutesWhereabout, Whereabout } from "@/interfaces/routes-interface";
import { getDataWhereAbout, newMarker, getCurrentPosition, newMarkerWithoutPopup, newMarkerVehicle } from "@/utils/functions-map";
import { interpolatePosition } from "@/utils/interpolation";

const _TIME_REFRESH_ = 1000 // 1000 = 1 segundo
const __LOCAL_STORAGE__ = '_WHEREABOUTS_' // Variable de localStorage

export default function Details() {
    const { localStorageRute } = useContext(UIContext);
    const [loading, setLoading] = useState(true);
    const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null);
    const [carsMarker, setCarsMarker] = useState<Map<string, mapboxgl.Marker>>(new Map());
    const [routeMarkers, setRouteMarkers] = useState<mapboxgl.Marker[]>([]);
    const [userMarker, setUserMarker] = useState<mapboxgl.Marker | null>(null);

    const handleMapLoading = () => setLoading(false);
    const [viewport, setViewport] = useState({
        coordinate: {
            lat: -12.0925,
            lng: -77.0248
        },
        zoom: "13.00"
    });


    useEffect(() => {
        const intervalId = setInterval(() => {
            locateUser();
            updateVehicleLocation();
        }, _TIME_REFRESH_);

        return () => clearInterval(intervalId);
    }, [userMarker, carsMarker]);

    const updateVehicleLocation = async () => {
        const liveVehicle = await fetchGET(`${process.env.NEXT_PUBLIC_REST_API_DUMMY}/live-route-cars/${localStorageRute}`);

        if (liveVehicle && liveVehicle.error) throw new Error('Datos inválidos o no disponibles');

        const newMarkers = new Map<string, mapboxgl.Marker>();

        liveVehicle.live.forEach((vehicle: Live) => {
            const [newLng, newLat] = [+vehicle.coordinate.lng, +vehicle.coordinate.lat];

            if (carsMarker.has(vehicle.vehicle.placa)) {
                const existingMarker = carsMarker.get(vehicle.vehicle.placa)!;
                const [oldLat, oldLng] = existingMarker.getLngLat().toArray() as [number, number];

                // Animate transition using requestAnimationFrame
                const start = Date.now();
                const duration = _TIME_REFRESH_;

                const animate = () => {
                    const now = Date.now();
                    const t = Math.min((now - start) / duration, 1);
                    const [interpolatedLat, interpolatedLng] = interpolatePosition([oldLat, oldLng], [newLat, newLng], t);

                    existingMarker.setLngLat([interpolatedLat, interpolatedLng]);

                    if (t < 1) {
                        requestAnimationFrame(animate);
                    }
                };

                animate();

                newMarkers.set(vehicle.vehicle.placa, existingMarker);
            } else {
                const newMarker = newMarkerVehicle(vehicle);
                newMarkers.set(vehicle.vehicle.placa, newMarker);
            }
        });

        // Remove markers that are no longer needed
        carsMarker.forEach((marker, id) => {
            if (!newMarkers.has(id)) {
                marker.remove();
            }
        });

        setCarsMarker(newMarkers);
    };

    const showDataWhereAbout = async () => {
        const points = localStorage.getItem(__LOCAL_STORAGE__);
        let pointsJson: RoutesWhereabout | null = points ? JSON.parse(points) : null;

        if (!(pointsJson?.route.code === localStorageRute)) {
            pointsJson = await getDataWhereAbout(localStorageRute.toString());
            localStorage.setItem(__LOCAL_STORAGE__, JSON.stringify(pointsJson));
        }

        if (pointsJson) {
            drawingRoutes(pointsJson, mapInstance!!);
        }
    }

    const cleanMarker = () => {
        routeMarkers.forEach((marker) => marker.remove())
        setRouteMarkers([])
    }

    const showMarkerWhereAbout = async () => {
        cleanMarker()

        const points = localStorage.getItem(__LOCAL_STORAGE__);
        let pointsJson: RoutesWhereabout | null = points ? JSON.parse(points) : null;

        if (!(pointsJson?.route.code === localStorageRute)) {
            pointsJson = await getDataWhereAbout(localStorageRute.toString());
            localStorage.setItem(__LOCAL_STORAGE__, JSON.stringify(pointsJson));
        }

        const newMarkers = pointsJson.whereabout.map((point: Whereabout) => newMarker(point))
        setRouteMarkers(newMarkers)
    }

    const drawingRoutes = async (coordinates: RoutesWhereabout, mapInstance: mapboxgl.Map) => {
        const coordinatesTmp = coordinates.whereabout.map(item => [+item.coordinates.lat, +item.coordinates.lng]);

        const matchedRoute = await getMatchedRoute(coordinatesTmp);

        if (matchedRoute && matchedRoute.matchings && matchedRoute.matchings[0]) {
            const route = matchedRoute.matchings[0].geometry;

            if (mapInstance.getLayer('line')) {
                mapInstance.removeLayer('line');
                mapInstance.removeSource('line');
            }

            mapInstance.addLayer({
                id: 'line',
                type: 'line',
                source: {
                    type: 'geojson',
                    data: route,
                },
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round',
                    'visibility': 'visible'
                },
                paint: {
                    'line-color': coordinates.route.color,
                    'line-width': 8,
                }
            });
        }
    }

    const onCreatedMapDraw = useCallback((drawInstance: MapboxDraw, mapInstance: mapboxgl.Map) => {
        mapbox.map = mapInstance
        setMapInstance(mapInstance);

        // Location User
        locateUser()

    }, []);

    const locateUser = async () => {
        try {
            const position = await getCurrentPosition();
            const { latitude, longitude } = position.coords;

            if (userMarker) {
                userMarker.setLngLat([longitude, latitude]);
            } else {
                const pointTmp: Whereabout = {
                    code: "",
                    name: "",
                    coordinates: {
                        lat: longitude.toString(),
                        lng: latitude.toString()
                    }
                }


                setUserMarker(newMarkerWithoutPopup(pointTmp, 'custom-marker-yo'));
            }

            // mapbox.map.flyTo({
            //     center: [longitude, latitude],
            //     zoom: 15
            // });
        } catch (error) {
            console.error('Error obtaining user location:', error);
        }
    }

    useEffect(() => {
        if (mapInstance) {
            showDataWhereAbout();
            showMarkerWhereAbout();
            updateVehicleLocation();
        }
    }, [localStorageRute, mapInstance]);

    return (
        <section id="mapView" className="fullscreen">
            <MapboxMap
                onLoaded={handleMapLoading}
                onCreatedMapDraw={onCreatedMapDraw}
                initialOptions={{ center: [+viewport.coordinate.lng, +viewport.coordinate.lat], zoom: +viewport.zoom }} />
            {loading && <MapLoadingHolder className="loading-holder" />}
        </section>
    );
}