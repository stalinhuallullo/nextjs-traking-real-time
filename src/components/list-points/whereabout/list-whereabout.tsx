"use client";

import { useContext, useEffect, useMemo, useState } from "react";
import "./list-whereabout.css"
import { UIContext } from "@/context/ui";
import { fetchGET } from "@/utils/fetcher";
import { RoutesWhereabout } from "@/interfaces/routes-interface";

const generarColorRandom = () => {
    const r = Math.floor(Math.random() * 256)
    const g = Math.floor(Math.random() * 256)
    const b = Math.floor(Math.random() * 256)
    return `rgb(${r}, ${g}, ${b})`;
}

const Item = ({ items, color }: any) => {

    return (
        <>
            <div className="whereabout">
                <div className="whereabout-header">
                    <div className="whereabout-header--title">
                        <h2 className="whereabout-header--title-text">
                            <span className="whereabout-header--title-text-shortname" style={{ background: color }}>RUTA {items?.route.code}</span>
                            <span className="whereabout-header--title-text-longname">{items?.route.name}</span>
                        </h2>
                    </div>
                </div>
                <div className="whereabout-body" style={{ background: color }}>
                    <div className="whereabout-body-scroll-container">
                        <div className="whereabout-body-route-container">

                            <ul className="whereabout-body-list">
                                {
                                    items?.whereabout.map((item: any) => {
                                        return (
                                            <li className={item.code === 3 ? "active" : ""} key={item.code}>
                                                <div className="whereabout-body-list--details">
                                                    <span className="whereabout-body-list--details-stopName">{item.name}</span>
                                                    {/* <span className="whereabout-body-list--details-desc">Paso planificado a 10h49</span> */}
                                                </div>
                                                <div className="whereabout-body-list--line">
                                                    <span className="colored-line" style={{ background: color }}></span>
                                                    <span className="colored-busStop" style={{ background: color }}></span>
                                                </div>
                                                <div className="whereabout-body-list--bus" style={{ color: color }}>
                                                    <div className="whereabout-body-list--bus-elements" style={{ background: color }}>
                                                        <div className="whereabout-body-list--bus-elements-glass"></div>
                                                    </div>
                                                    <div className="whereabout-body-list--bus-indicator"></div>
                                                </div>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

const ListWhereAbout = () => {

    const { localStorageRute } = useContext(UIContext);
    const [whereabout, setWhereabout] = useState<RoutesWhereabout | null>(null)

    const getData = async () => {
        const apiResponse: RoutesWhereabout = await fetchGET(process.env.NEXT_PUBLIC_REST_API_DUMMY + "/whereabout/" + localStorageRute)
        return apiResponse
    }

    useMemo(() => {
        (async () => {
            const data = await getData();
            setWhereabout(data)
        })();
    }, [localStorageRute]);

    return (
        <>
            {/* <div className="sidebar">
                <div className="heading">
                    <h1>Paraderos de la Ruta 1</h1>
                </div>
                <div id="listings" className="listings">

                </div>
            </div> */}

            {whereabout ? (
                <Item items={whereabout} color={whereabout.route.color} />
            ) : (
                <div className="whereabout"></div>
            )}
        </>
    )
}
export default ListWhereAbout