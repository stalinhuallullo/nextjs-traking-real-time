"use client";
import { useEffect, useState } from "react";
import "./list-whereabout.css"

const WHEREABOUT = {
    rute: {
        code: "01",
        name: "PERIFERICA",
        color: "rgb(228, 26, 10)"
    },
    whereabout: [
        {
            code: 1,
            name: "Av. Guardia Civil cuadra 7",
            coordinates: {
                lat: "-12.10101010",
                lng: "-12.10101010"
            }
        },
        {
            code: 2,
            name: "CEV CORPAC",
            coordinates: {
                lat: "-12.10101010",
                lng: "-12.10101010"
            }
        },
        {
            code: 3,
            name: "Av. Barrenechea con Av. Del Parque Sur",
            coordinates: {
                lat: "-12.10101010",
                lng: "-12.10101010"
            }
        },
        {
            code: 4,
            name: "Av. Parque Sur cuadra 2",
            coordinates: {
                lat: "-12.10101010",
                lng: "-12.10101010"
            }
        },
        {
            code: 5,
            name: "Av. Aramburú cuadra 9",
            coordinates: {
                lat: "-12.10101010",
                lng: "-12.10101010"
            }
        },
        {
            code: 6,
            name: "Av. Aramburu cuadra 4",
            coordinates: {
                lat: "-12.10101010",
                lng: "-12.10101010"
            }
        },
        {
            code: 7,
            name: "AV. Aramburu cuadra 1",
            coordinates: {
                lat: "-12.10101010",
                lng: "-12.10101010"
            }
        },
        {
            code: 8,
            name: "Óvalo Gutierrez",
            coordinates: {
                lat: "-12.10101010",
                lng: "-12.10101010"
            }
        },
        {
            code: 9,
            name: "Ca. Miguel Dasso con C. Victor Maurtua",
            coordinates: {
                lat: "-12.10101010",
                lng: "-12.10101010"
            }
        },
        {
            code: 10,
            name: "Residencial Santa Cruz (Av. Belén cuadra 4)",
            coordinates: {
                lat: "-12.10101010",
                lng: "-12.10101010"
            }
        },
        {
            code: 11,
            name: "Policlínico Municipal (Ca. Paul Harris) ",
            coordinates: {
                lat: "-12.10101010",
                lng: "-12.10101010"
            }
        },
        {
            code: 12,
            name: "Av. Perez Aranibar cuadra 16",
            coordinates: {
                lat: "-12.10101010",
                lng: "-12.10101010"
            }
        },
        {
            code: 13,
            name: "Av. Perez Aranibar cuadra 21",
            coordinates: {
                lat: "-12.10101010",
                lng: "-12.10101010"
            }
        },
        {
            code: 14,
            name: "CEV POLAR",
            coordinates: {
                lat: "-12.10101010",
                lng: "-12.10101010"
            }
        },
        {
            code: 15,
            name: "AV. SALAVERRY CUADRA 29",
            coordinates: {
                lat: "-12.10101010",
                lng: "-12.10101010"
            }
        }
    ]
}

const generarColorRandom = () => {
    const r = Math.floor(Math.random() * 256)
    const g = Math.floor(Math.random() * 256)
    const b = Math.floor(Math.random() * 256)
    return `rgb(${r}, ${g}, ${b})`;
}

const ListWhereAbout = () => {

    const [color, setColor] = useState(WHEREABOUT.rute.color)

    useEffect(() => {
        //setColor(generarColorRandom())
    }, [])

    return (
        <>
            {/* <div className="sidebar">
                <div className="heading">
                    <h1>Paraderos de la Ruta 1</h1>
                </div>
                <div id="listings" className="listings">

                </div>
            </div> */}
            <div className="whereabout">
                <div className="whereabout-header">
                    <div className="whereabout-header--title">
                        <h2 className="whereabout-header--title-text">
                            <span className="whereabout-header--title-text-shortname" style={{ background: color }}>RUTA {WHEREABOUT.rute.code}</span>
                            <span className="whereabout-header--title-text-longname">{WHEREABOUT.rute.name}</span>
                        </h2>
                    </div>
                </div>
                <div className="whereabout-body" style={{ background: color }}>
                    <div className="whereabout-body-scroll-container">
                        <div className="whereabout-body-route-container">
                            <ul className="whereabout-body-list">
                                {
                                    WHEREABOUT.whereabout.map((whereabout) => {
                                        return (
                                            <li className={whereabout.code === 3 ? "active" : ""} key={whereabout.code}>
                                                <div className="whereabout-body-list--details">
                                                    <span className="whereabout-body-list--details-stopName">{whereabout.name}</span>
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
export default ListWhereAbout