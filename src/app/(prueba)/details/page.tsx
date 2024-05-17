"use client";

import Head from "next/head";
import { useCallback, useEffect, useRef, useState } from "react";
import MapboxMap from "@/components/mapbox-map";
import MapLoadingHolder from "@/components/map-loading-holder";
import { getMatchedRoute } from "@/utils/map-box/mapMatching";
import mapbox from "@/utils/map-wrapper";
import mapboxgl from "mapbox-gl";
import { fetchGET } from "@/utils/fetcher";

export default function Home() {
    const [loading, setLoading] = useState(true);
    const handleMapLoading = () => setLoading(false);
    const [carMarker, setCarMarker] = useState<mapboxgl.Marker | null>(null);
    const [routeExists, setRouteExists] = useState<boolean>(false);
    const [viewport, setViewport] = useState({
        center: [-77.0248, -12.0925],
        zoom: "13.00",
    });

    const { center: [lng, lat], zoom } = viewport;


    useEffect(() => {
        const intervalId = setInterval(() => {
            updateVehicleLocation();
        }, 5000); // Polling interval in milliseconds

        return () => clearInterval(intervalId);
    }, [carMarker]);


    const onCreatedMapDraw = useCallback((drawInstance: MapboxDraw, mapInstance: mapboxgl.Map) => {
        mapbox.map = mapInstance;

        console.log("Inicio de Map")
        saveAndShowPoints(drawInstance, mapInstance)
        addMarker()


        if (mapInstance && drawInstance && !routeExists) {
            mapbox.map.on('draw.create', (e: any) => handleDrawCreate(e, mapInstance, drawInstance));
        }

        // Create car marker
        const carIcon = document.createElement('div');
        carIcon.className = 'car-icon';

        console.log("viewport.center ==> ", viewport.center, lng, lat)
        const marker = new mapboxgl.Marker(carIcon).setLngLat([lng, lat]).addTo(mapbox.map);
        setCarMarker(marker);
    }, [])


    const updateVehicleLocation = async () => {
        const locations = await fetchGET(process.env.NEXT_PUBLIC_REST_API_LOCATION + "/EXPRESOBUS/ListarGPSExpresoRuta?CODLINEA=01");


        if (locations.Respuesta !== "Exito" || !locations.Datos || locations.Datos.length === 0) {
            throw new Error('Datos inválidos o no disponibles');
        }

        // Filtrar las coordenadas inválidas
        const validCoordinates = locations.Datos.filter(
            (coords: [number, number]) => coords[0] !== 0.0 && coords[1] !== 0.0
        );

        // Usar la última coordenada válida
        const [tmpLat, tmpLgn] = validCoordinates[validCoordinates.length - 1];
        console.log("latestCoordinates ==>", [tmpLgn, tmpLat])
        if (locations && carMarker) {
            carMarker.setLngLat([tmpLgn, tmpLat]);
        }
    };

    const saveAndShowPoints = (drawInstance: MapboxDraw, mapInstance: mapboxgl.Map) => {
        // Load saved points from localStorage
        const savedPoints = localStorage.getItem('savedPoints');
        if (savedPoints) {
            const parsedPoints = JSON.parse(savedPoints);
            // Agregar los puntos de las tiendas al mapa
            drawInstance.add(parsedPoints);
            drawRoute(parsedPoints.geometry.coordinates, mapbox.map);
            setRouteExists(true);
            mapInstance.removeControl(drawInstance);  // Remove drawing control
        }
    }


    const addMarker = () => {
        const savedPoints = localStorage.getItem('savedPoints');
        if (savedPoints) {
            const parsedPoints = JSON.parse(savedPoints);
            parsedPoints.geometry.coordinates.forEach((store: any) => {
                // new mapboxgl.Marker()
                //     .setLngLat(store)
                //     .addTo(mapbox.map);


                // Crear marcador personalizado
                const el = document.createElement('div');
                el.className = 'marker';

                // Agregar información emergente al marcador
                new mapboxgl.Marker(el)
                    .setLngLat(store)
                    .setPopup(new mapboxgl.Popup({ offset: 25 }) // agregar una ventana emergente
                        .setHTML(`<h3>${store.name}</h3><p>${store.address}</p>`))
                    .addTo(mapbox.map);
            });
        }
    }


    const drawRoute = async (coordinates: number[][], mapInstance: mapboxgl.Map) => {
        const matchedRoute = await getMatchedRoute(coordinates);

        if (matchedRoute && matchedRoute.matchings && matchedRoute.matchings[0]) {
            const route = matchedRoute.matchings[0].geometry;

            /*console.log("mapInstance 22222 ===> ", mapInstance.getSource("route"))
            if (mapInstance.getSource('route')) {
                (mapInstance.getSource('route') as mapboxgl.GeoJSONSource).setData(route);
            } else {*/
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

    const handleDrawCreate = async (e: any, mapInstance: mapboxgl.Map, drawInstance: MapboxDraw) => {
        const coordinates = e.features[0].geometry.coordinates;
        await drawRoute(coordinates, mapInstance!);

        // Save points to localStorage
        localStorage.setItem('savedPoints', JSON.stringify(e.features[0]));
        setRouteExists(true);

        // Remove drawing control
        mapInstance!.removeControl(drawInstance!);
    };

    const centerCar = () => {
        if (carMarker && mapbox.map) {
            console.log("Mostrar ubicaicon del carrito => ", carMarker.getLngLat())
            mapbox.map.flyTo({ center: carMarker.getLngLat(), zoom: 14 });
        }
    }

    return (
        <section id="mapView" className="fullscreen">
            {/* <div className="map-wrapper"> */}
            <div className="viewport-panel">
                Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
                <br />
                <br />
                <button onClick={centerCar}>CARRITO</button>
            </div>
            <MapboxMap
                //initialOptions={{ center: [38.0983, 55.7038] }}
                onLoaded={handleMapLoading}
                onCreatedMapDraw={onCreatedMapDraw}
                //onCreatedDirections={onMapCreatedDirections}
                initialOptions={{ center: [+lng, +lat], zoom: +zoom }}
            />
            {/* </div> */}
            {loading && <MapLoadingHolder className="loading-holder" />}
        </section>
    );
}