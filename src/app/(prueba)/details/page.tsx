"use client";

import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { addDataLayer } from "@/utils/addDataLayer";
import { initializeMap } from "@/utils/initializeMap";
import { fetcher } from "@/utils/fetcher";
import classes from "@/app/(prueba)/location/Page.module.css";

const mapboxgl = require("mapbox-gl/dist/mapbox-gl.js");

export default function Home() {
    const mapContainerRef = useRef<HTMLDivElement>(null);

    const { data, error } = useSWR("/api/liveMusic", fetcher);
    const [viewport, setViewport] = useState({
        center: ["-77.0248", "-12.0925"],
        zoom: "13.00",
    });

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;


    var r = Math.round(Math.random() * 255);
    var g = Math.round(Math.random() * 255);
    var b = Math.round(Math.random() * 255);
    var sc = Math.random() * 2.5 + 0.5;

    useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapContainerRef.current!,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: viewport.center,
            zoom: viewport.zoom,
        });


        map.on('load', function () {
            var marker = new mapboxgl.Marker({
                color: `rgb(${r}, ${g}, ${b})`,
                scale: sc,
                draggable: true,
            })
                .setLngLat(viewport.center)
                .addTo(map);

        });

        map.on('click', (event: any) => {
            console.log("click", event)
            console.log("event.lngLat.lng", event.lngLat.lng)
            console.log("event.lngLat.lat", event.lngLat.lat)
            new mapboxgl.Marker({
                color: `rgb(${r}, ${g}, ${b})`,
                scale: sc,
                draggable: true,
            })
                .setLngLat([event.lngLat.lat, event.lngLat.lng])
                .addTo(map);
        });

        return () => map.remove();
    }, []);


    return (
        <main className={classes.mainStyle}>
            <div className="map-wrapper">
                <div ref={mapContainerRef} style={{ width: '100%', height: '100vh' }} />
            </div>

        </main>
    );
}