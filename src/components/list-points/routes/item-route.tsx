"use client"

import React, { useEffect, useState } from 'react'
import { Rute } from './list-route'

interface Props {
    rute: Rute
}

const ItemRoute = ({rute}: Props) => {
    const [color, setColor] = useState(rute.color)

 
    return (
        <li>
            <div className="route-title">
                <span className="route-list-label color-bright" style={{ background: color }}>RUTA {rute.code}</span>
                <span className="route-list-longname">{rute.name}</span>
                <div className="route-list-alert">
                    <span className="route-list-alert-icon"></span>
                </div>
            </div>
            <div className="route-body">
                <div className="route-colored-line-container">
                    <span className="route-colored-line" style={{ background: color }}></span>
                    <span className="route-colored-stop" style={{ borderColor: color }}></span>
                </div>
                <span className="route-list-directions">{rute.rutes.init} -&gt; {rute.rutes.finish}</span>
                <span className="route-list-longname"></span>
                <div className="route-list-alert">
                    <span className="route-list-alert-icon"></span>
                </div>
            </div>
        </li>
    )
}

export default ItemRoute
