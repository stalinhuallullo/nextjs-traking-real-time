"use client";

import { useContext, useMemo, useState } from "react";
import "./list-whereabout.css"
import { UIContext } from "@/context/ui";
import { fetchGET } from "@/utils/fetcher";
import { RoutesWhereabout, Whereabout } from "@/interfaces/routes-interface";
import { flyToStore } from "@/utils/functions-map";
import { TEASER_STYLE, cycle } from "@/interfaces/enum/nav-var";


interface Propsitem {
    items: RoutesWhereabout
    color: string
}



const Item = ({ items, color }: Propsitem) => {
    const [teaserIndex, setTeaserIndex] = useState(0);

    const handlerClick = (point: Whereabout) => {
        flyToStore(point)
    }

    const handlerTeaserStyle = () => {
        setTeaserIndex((prevIndex) => (prevIndex + 1) % cycle.length);
    };

    const teaserClassName = cycle[teaserIndex];

    return (
        <>
            <div className={`whereabout ${teaserClassName}`}>
                <div className={`whereabout-header `}>
                    <div className="whereabout-header--title">
                        <h2 className="whereabout-header--title-text">
                            <span className="whereabout-header--title-text-shortname" style={{ background: color }}>RUTA {items?.route.code}</span>
                            <span className="whereabout-header--title-text-longname">{items?.route.name}</span>
                        </h2>
                    </div>
                    <div className="whereabout-button" onClick={() => handlerTeaserStyle()}>
                        <span className="teaser-label teaser-label--top">desarollar</span>
                        <button className="teaser-button-size" title="Afficher plus ou moins de détails"></button>
                        <span className="teaser-label teaser-label--bottom">
                            {
                                teaserClassName === TEASER_STYLE.small
                                    ? "minimizar" :
                                    teaserClassName === TEASER_STYLE.fullscreen
                                        ? "reducir" : ""
                            }
                        </span>
                    </div>
                </div>
                <div className="whereabout-body" style={{ background: color }}>
                    <div className="whereabout-body-scroll-container">
                        <div className="whereabout-body-route-container">

                            <ul className="whereabout-body-list">
                                {
                                    items?.whereabout.map((item: Whereabout) => {
                                        return (
                                            <li className={item.code === "03" ? "active" : ""} key={item.code} onClick={() => handlerClick(item)}>
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
        console.log("localStorageRute ==> ", localStorageRute)
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