"use client";

import Head from "next/head";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import MapboxMap from "@/components/mapbox-map";
import MapLoadingHolder from "@/components/loading/map-loading-holder";
import { getMatchedRoute } from "@/utils/map-box/mapMatching";
import mapbox from "@/utils/map-wrapper";
import mapboxgl from "mapbox-gl";
import { fetchGET } from "@/utils/fetcher";
import { UIContext } from "@/context/ui";

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
        
        mapInstance.on('click', 'route', () => {
            console.log("ssssssssssss")
            // const newColor = routeColor === 'blue' ? 'red' : 'blue';
            // setRouteColor(newColor);
    
            if (mapInstance.getLayer('route')) {
              mapInstance.setPaintProperty('route', 'line-color', "blue");
            }
          });

        buildLocationList();
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
                el.className = 'marker fill-red';

                // Agregar información emergente al marcador
                new mapboxgl.Marker(el)
                    .setLngLat(store)
                    .setPopup()
                    // .setPopup(new mapboxgl.Popup({ offset: 25 }) // agregar una ventana emergente
                    //     .setHTML(`<h3>${store.name}</h3><p>${store.address}</p>`))
                    .addTo(mapbox.map)
                    .getElement()
                    .addEventListener('click', () => {
                        //Fly to the point
                        flyToStore(store);

                        // Close all other popups and display popup for clicked store 
                        createPopUp(store);

                        // Highlight listing in sidebar (and remove highlight for all other listings) 
                        const activeItem = document.getElementsByClassName('active');
                        if (activeItem[0]) {
                            activeItem[0].classList.remove('active');
                        }
                        const listing = document.getElementById(
                            `listing-${store[0]}`
                        );
                        listing?.classList.add('active');
                    });
            });
        }
    }


    const drawRoute = async (coordinates: number[][], mapInstance: mapboxgl.Map) => {
        const matchedRoute = await getMatchedRoute(coordinates);

        if (matchedRoute && matchedRoute.matchings && matchedRoute.matchings[0]) {
            const route = matchedRoute.matchings[0].geometry;

            // console.log("mapInstance 22222 ===> ", mapInstance.getSource("route"))
            // if (mapInstance.getSource('route')) {
            //     (mapInstance.getSource('route') as mapboxgl.GeoJSONSource).setData(route);
            // } else {
           
            
            mapInstance.addLayer({
                id: 'route',
                type: 'line',
                source: {
                    type: 'geojson',
                    data: route,
                },
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                paint: {
                    'line-color': 'rgb(228, 26, 10)',
                    'line-width': 8,
                }
            });
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

    const buildLocationList = () => {
        const savedPoints = localStorage.getItem('savedPoints');
        if (savedPoints) {
            const parsedPoints = JSON.parse(savedPoints);
            parsedPoints.geometry.coordinates.forEach((store: any, index: number) => {

                console.log("ssssssssss ==> ", store[0])
                /* Add a new listing section to the sidebar. */
                const listings = document.getElementById('listings');
                if (!listings) return

                const listing = listings.appendChild(document.createElement('div'));
                /* Assign a unique `id` to the listing. */
                listing.id = `listing-${store[0]}`;
                /* Assign the `item` class to each listing for styling. */
                listing.className = 'item';

                /* Add the link to the individual listing created above. */
                const link = listing.appendChild(document.createElement('a'));
                link.href = '#';
                link.className = 'title';
                link.id = `link-${store[0]}`;
                link.innerHTML = `${store[0]}`;
                link.addEventListener('click', function (e) {
                    console.log("this.id", this.id)
                    if (this.id == `link-${store[0]}`) {
                        flyToStore(store);
                        createPopUp(store);
                    }
                    const activeItem = document.getElementsByClassName('active');
                    if (activeItem[0]) {
                        activeItem[0].classList.remove('active');
                    }

                    //parentNode.classList.add('active');
                    this.parentNode?.classList.add('active')
                })

                /* Add details to the individual listing. */
                const details = listing.appendChild(document.createElement('div'));
                details.innerHTML = `${store[0]}`;
                if (store.properties?.phone != undefined) {
                    details.innerHTML += ` &middot; ${store[0]}`;
                }
                if (store.properties?.distance) {
                    const roundedDistance = Math.round(store[0] * 100) / 100;
                    details.innerHTML += `<div><strong>${roundedDistance} miles away</strong></div>`;
                }
            })
        }
    }

    const flyToStore = (currentFeature: any) => {
        mapbox.map.flyTo({
            center: currentFeature,
            zoom: 15
        });
    }

    const createPopUp = (currentFeature: any) => {
        const popUps = document.getElementsByClassName('mapboxgl-popup');
        /** Check if there is already a popup on the map and if so, remove it */
        if (popUps[0]) popUps[0].remove();

        const popup = new mapboxgl.Popup({ closeOnClick: false })
            .setLngLat(currentFeature)
            .setHTML(`<h3>PARADERO</h3><h4>${currentFeature[0]} aaaa</h4>`)
            .addTo(mapbox.map);
    }

    return (
        <>
            <section id="mapView" className="fullscreen">
                {/* <div className="map-wrapper"> */}
                {/* <div className="viewport-panel">
                    Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
                    <br />
                    <br />
                    <button onClick={centerCar}>CARRITO</button>
                </div> */}
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
        </>
    );
}