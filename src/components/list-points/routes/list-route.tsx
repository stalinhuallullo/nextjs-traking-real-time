"use client"
import "@/components/list-points/routes/list-route.css"
import { useEffect, useState } from "react"
import ItemRoute from "./item-route"
export interface Rute {
    code: string,
    name: string,
    color: string,
    rutes: {
        init: string,
        finish: string
    }
}

const RUTES: Rute[] = [
    {
        code: "01",
        name: "PERIFERICA",
        color: "rgb(228, 26, 10)",
        rutes: {
            init: "Guardia Civil",
            finish: "Av. Parque Norte"
        }
    },
    {
        code: "02",
        name: "NORTE CENTRO FINANCIERO",
        color: "rgb(201, 15, 250)",
        rutes: {
            init: "Calle Barcelona",
            finish: "Av Guillermo Prescott"
        }
    },
    {
        code: "03",
        name: "SUR CENTRO FINANCIERO",
        color: "rgb(160, 230, 11)",
        rutes: {
            init: "Calle Clemente X",
            finish: "Av. Salaverry"
        }
    }
]

const generateRandomRGBColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}

const ListRoutes = () => {


    return (
        <>
            <div className="sidebar">
                <div className="heading">
                    <h1>Rutas de San Isidro</h1>
                </div>
                <div>
                    <ul className="list-route">
                        {
                            RUTES.map((rute) => {
                                return (
                                    <ItemRoute item={rute} key={rute.code} />
                                    // <li>
                                    //     <div className="route-title">
                                    //         <span className="route-list-label color-bright" style={{ background: color }}>RUTA {rute.code}</span>
                                    //         <span className="route-list-longname">{rute.name}</span>
                                    //         <div className="route-list-alert">
                                    //             <span className="route-list-alert-icon"></span>
                                    //         </div>
                                    //     </div>
                                    //     <div className="route-body">
                                    //         <div className="route-colored-line-container">
                                    //             <span className="route-colored-line" style={{ background: color }}></span>
                                    //             <span className="route-colored-stop" style={{ borderColor: color }}></span>
                                    //         </div>
                                    //         <span className="route-list-directions">{rute.rutes.init} -&gt; {rute.rutes.finish}</span>
                                    //         <span className="route-list-longname"></span>
                                    //         <div className="route-list-alert">
                                    //             <span className="route-list-alert-icon"></span>
                                    //         </div>
                                    //     </div>
                                    // </li>
                                )
                            })
                        }
                    </ul>
                </div>
            </div>
        </>
    )
}
export default ListRoutes