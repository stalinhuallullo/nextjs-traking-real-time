import mapboxgl from "mapbox-gl"
import mapbox from "@/utils/map-wrapper";
import { RoutesWhereabout, Whereabout } from "@/interfaces/routes-interface";
import { fetchGET } from "./fetcher";

export const flyToStore = (point: Whereabout) => {
    mapbox.map.flyTo({
        center: [+point.coordinates.lat, +point.coordinates.lng],
        zoom: 15
    });
    createPopUp(point)
}

export const createPopUp = (point: Whereabout) => {
    const popUps = document.getElementsByClassName('mapboxgl-popup');
    /** Check if there is already a popup on the map and if so, remove it */
    if (popUps[0]) popUps[0].remove();

    newPopup(point)
}

export const newMarker = (point: Whereabout, classNameElement: string = 'marker') => {

    const el = document.createElement('div');
    el.className = classNameElement;

    return new mapboxgl.Marker(el)
        .setLngLat([+point.coordinates.lat, +point.coordinates.lng])
        .addTo(mapbox.map)
        .setPopup(newPopup(point, false))
}

export const newMarkerWithoutPopup = (point: Whereabout, classNameElement: string = 'marker') => {

    const el = document.createElement('div');
    el.className = classNameElement;

    return new mapboxgl.Marker(el)
        .setLngLat([+point.coordinates.lat, +point.coordinates.lng])
        .addTo(mapbox.map)
}


export const newPopup = (point: Whereabout, init: boolean = true) => {
    const popup = new mapboxgl.Popup({ offset: 25 })
        .setLngLat([+point.coordinates.lat, +point.coordinates.lng])
        .setHTML(`
            <h3>PARADERO</h3>
            <h4>${point.name}</h4>
        `)

    if (init) popup.addTo(mapbox.map)
    return popup
}

export const getDataWhereAbout = async (localStorageRute: string) => {
    const apiResponse: RoutesWhereabout = await fetchGET(`${process.env.NEXT_PUBLIC_REST_API_DUMMY}/whereabout/${localStorageRute}`);
    return apiResponse;
}


export const getCurrentPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            });
        } else {
            reject(new Error('Geolocation not supported by this browser.'));
        }
    });
};