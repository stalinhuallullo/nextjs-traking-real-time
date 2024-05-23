"use client";

import { useCallback, useContext, useEffect, useState } from "react";
import MapboxMap from "@/components/mapbox-map";
import MapLoadingHolder from "@/components/loading/map-loading-holder";
import { getMatchedRoute } from "@/utils/map-box/mapMatching";
import mapbox from "@/utils/map-wrapper";
import mapboxgl from "mapbox-gl";
import { fetchGET } from "@/utils/fetcher";
import { UIContext } from "@/context/ui";
import { RoutesWhereabout, Whereabout } from "@/interfaces/routes-interface";

export default function Details() {
    const { localStorageRute } = useContext(UIContext);
    const [loading, setLoading] = useState(true);
    const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null);
    const [carMarker, setCarMarker] = useState<mapboxgl.Marker | null>(null);
    const [routeMarkers, setRouteMarkers] = useState<mapboxgl.Marker[]>([]);
    const handleMapLoading = () => setLoading(false);
    const [viewport, setViewport] = useState({
        center: [-77.0248, -12.0925],
        zoom: "13.00"
    });

    const { center: [lng, lat], zoom } = viewport;

    useEffect(() => {
        const intervalId = setInterval(() => {
            updateVehicleLocation();
        }, 5000);

        return () => clearInterval(intervalId);
    }, [carMarker]);


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


    const getData = async () => {
        const apiResponse: RoutesWhereabout = await fetchGET(`${process.env.NEXT_PUBLIC_REST_API_DUMMY}/whereabout/${localStorageRute}`);
        return apiResponse;
    }

    const showDataWhereAbout = async () => {
        const points = localStorage.getItem('_WHEREABOUTS_');
        let pointsJson: RoutesWhereabout | null = points ? JSON.parse(points) : null;

        if (!(pointsJson?.route.code === localStorageRute)) {
            pointsJson = await getData();
            localStorage.setItem('_WHEREABOUTS_', JSON.stringify(pointsJson));
        }

        if (pointsJson) {
            drawingRoutes(pointsJson, mapInstance!!);
        }
    }

    const cleanMarker = () => {
        routeMarkers.forEach((marker) => {
            marker.remove()
            setTimeout(() => marker.remove(), 500);
        })
        setRouteMarkers([])
    }
    const showMarkerWhereAbout = async () => {
        cleanMarker()

        const points = localStorage.getItem('_WHEREABOUTS_');
        let pointsJson: RoutesWhereabout | null = points ? JSON.parse(points) : null;

        if (!(pointsJson?.route.code === localStorageRute)) {
            pointsJson = await getData();
            localStorage.setItem('_WHEREABOUTS_', JSON.stringify(pointsJson));
        }

        const newMarkers  = pointsJson.whereabout.map((point: Whereabout) => {
            const el = document.createElement('div');
            el.className = 'marker';

            return new mapboxgl.Marker(el)
                .setLngLat([+point.coordinates.lat, +point.coordinates.lng])
                // .setPopup(new mapboxgl.Popup({ offset: 25 }) // agregar una ventana emergente
                //     .setHTML(`<h3>${store.name}</h3><p>${store.address}</p>`))
                .addTo(mapbox.map)
                .setPopup(
                    new mapboxgl.Popup({ offset: 25 }) // add popups
                      .setHTML('</h3><p>' + point.name + '</p>' )
                  )
                // .addEventListener('click', () => {
                //     //Fly to the point
                //     flyToStore(point);

                //     // Close all other popups and display popup for clicked store 
                //     createPopUp(point);
                // })
        })
        setRouteMarkers(newMarkers )


    }

    const createPopUp = (point: Whereabout) => {
        const popUps = document.getElementsByClassName('mapboxgl-popup');
        /** Check if there is already a popup on the map and if so, remove it */
        if (popUps[0]) popUps[0].remove();

        const popup = new mapboxgl.Popup({ closeOnClick: false })
            .setLngLat([+point.coordinates.lat, +point.coordinates.lng])
            .setHTML(`
                <h3>PARADERO</h3>
                <h4>${point.name}</h4>
            `)
            .addTo(mapbox.map);
    }

    const flyToStore = (point: Whereabout) => {
        mapbox.map.flyTo({
            center: [+point.coordinates.lat, +point.coordinates.lng],
            zoom: 15
        });
    }

    const drawingRoutes = async (coordinates: RoutesWhereabout, mapInstance: mapboxgl.Map) => {
        const coordinatesTmp = coordinates.whereabout.map(item => [+item.coordinates.lat, +item.coordinates.lng]);

        const matchedRoute = await getMatchedRoute(coordinatesTmp);

        if (matchedRoute && matchedRoute.matchings && matchedRoute.matchings[0]) {
            const route = matchedRoute.matchings[0].geometry;

            // if (mapInstance.getLayer('line')) {
            //     mapInstance.removeLayer('line');
            //     mapInstance.removeSource('line');
            // }


            if (mapInstance.getLayer('line')) {
                // Hide the layer instead of removing it
                mapInstance.setLayoutProperty('line', 'visibility', 'none');
                // Or you can remove the layer after a delay
                setTimeout(() => {
                    if (mapInstance.getLayer('line')) {
                        mapInstance.removeLayer('line');
                        mapInstance.removeSource('line');
                    }
                }, 500); // Wait for the animation to complete
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

    }, []);

    const createMarkerCar = () => {
        const carIcon = document.createElement('div');
        carIcon.className = 'car-icon';
        const marker = new mapboxgl.Marker(carIcon).setLngLat([lng, lat]).addTo(mapbox.map);
        setCarMarker(marker);
    }

    useEffect(() => {
        if (mapInstance) {
            showDataWhereAbout();
            showMarkerWhereAbout()
        }
    }, [localStorageRute, mapInstance]);

    return (
        <section id="mapView" className="fullscreen">
            <MapboxMap
                onLoaded={handleMapLoading}
                onCreatedMapDraw={onCreatedMapDraw}
                initialOptions={{ center: [+lng, +lat], zoom: +zoom }}
            />
            {loading && <MapLoadingHolder className="loading-holder" />}
        </section>
    );
}