"use client"

import React, { useContext, useEffect, useState } from 'react'
import { Rute } from './list-route'
import { UIContext } from '@/context/ui'
import { Route } from '@/interfaces/routes-interface'

interface Props {
    item: Route
}

const ItemRoute = ({ item }: Props) => {
    const { localStorageRute, setLocalStorageRute, toggleSideMenu } = useContext(UIContext);
    const [color, setColor] = useState(item.color)

    const handlerClick = () => {
        toggleSideMenu("WHEREABOUT")
        setLocalStorageRute(item.code)
    }

    return (
        <li onClick={() => handlerClick()} className={localStorageRute === item.code ? "active" : ""}>
            <div className="route-title">
                <span className="route-list-label color-bright" style={{ background: color }}>RUTA {item.code}</span>
                <span className="route-list-longname">{item.name}</span>
                <div className="route-list-alert">
                    <span className="route-list-alert-icon"></span>
                </div>
            </div>
            <div className="route-body">
                <div className="route-colored-line-container">
                    <span className="route-colored-line" style={{ background: color }}></span>
                    <span className="route-colored-stop" style={{ borderColor: color }}></span>
                </div>
                <span className="route-list-directions">{item.limit.init} -&gt; {item.limit.finish}</span>
                <span className="route-list-longname"></span>
                <div className="route-list-alert">
                    <span className="route-list-alert-icon"></span>
                </div>
            </div>
        </li>
    )
}

export default ItemRoute
