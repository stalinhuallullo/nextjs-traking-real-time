"use client";

import { useCallback, useContext, useEffect, useState } from "react";
import MapboxMap from "@/components/mapbox-map";
import MapLoadingHolder from "@/components/loading/map-loading-holder";
import { getMatchedRoute } from "@/utils/map-box/mapMatching";
import mapbox from "@/utils/map-wrapper";
import mapboxgl from "mapbox-gl";
import { fetchGET } from "@/utils/fetcher";
import { UIContext } from "@/context/ui";
import { Route, RoutesWhereabout, Whereabout } from "@/interfaces/routes-interface";
import { getApiRoutes } from "@/utils/functions-utils";
import { getDataWhereAbout, newMarker, getCurrentPosition, newMarkerWithoutPopup } from "@/utils/functions-map";

export default function Details() {
    const { localStorageRute, setLocalStorageRute } = useContext(UIContext);
    const [loading, setLoading] = useState(true);
    const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null);
    const [carMarker, setCarMarker] = useState<mapboxgl.Marker | null>(null);
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
            updateVehicleLocation();
        }, 5000);

        return () => clearInterval(intervalId);
    }, [carMarker]);


    const updateVehicleLocation = async () => {
        const locations = await fetchGET(`${process.env.NEXT_PUBLIC_REST_API_DUMMY}/live-route-cars/${localStorageRute}`);


        if (locations.Respuesta !== "Exito" || !locations.Datos || locations.Datos.length === 0) {
            throw new Error('Datos inválidos o no disponibles');
        }

        // Filtrar las coordenadas inválidas
        const validCoordinates = locations.Datos.filter(
            (coords: [number, number]) => coords[0] !== 0.0 && coords[1] !== 0.0
        );

        // Usar la última coordenada válida
        const [tmpLat, tmpLgn] = validCoordinates[validCoordinates.length - 1];
        if (locations && carMarker) {
            carMarker.setLngLat([tmpLgn, tmpLat]);
        }
    };

    const showDataWhereAbout = async () => {
        const points = localStorage.getItem('_WHEREABOUTS_');
        let pointsJson: RoutesWhereabout | null = points ? JSON.parse(points) : null;

        if (!(pointsJson?.route.code === localStorageRute)) {
            pointsJson = await getDataWhereAbout(localStorageRute.toString());
            localStorage.setItem('_WHEREABOUTS_', JSON.stringify(pointsJson));
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

        const points = localStorage.getItem('_WHEREABOUTS_');
        let pointsJson: RoutesWhereabout | null = points ? JSON.parse(points) : null;

        if (!(pointsJson?.route.code === localStorageRute)) {
            pointsJson = await getDataWhereAbout(localStorageRute.toString());
            localStorage.setItem('_WHEREABOUTS_', JSON.stringify(pointsJson));
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

        // Create car marker
        createMarkerCar()

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

    const createMarkerCar = () => {
        const carIcon = document.createElement('div');
        carIcon.className = 'car-icon';
        const marker = new mapboxgl.Marker(carIcon).setLngLat([viewport.coordinate.lng, viewport.coordinate.lat]).addTo(mapbox.map);
        setCarMarker(marker);
    }

    useEffect(() => {
        if (mapInstance) {
            console.log("cambio de local", localStorageRute)
            showDataWhereAbout();
            showMarkerWhereAbout()
        }
    }, [localStorageRute, mapInstance]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            console.log("sssss")
            locateUser
        }, 5000);

        return () => clearInterval(intervalId);
    }, [userMarker]);

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