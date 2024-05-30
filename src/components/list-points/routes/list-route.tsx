"use client"
import "@/components/list-points/routes/list-route.css"
import { useEffect, useState } from "react"
import ItemRoute from "./item-route"
import { fetchGET } from "@/utils/fetcher"
import { Route } from "@/interfaces/routes-interface"
import { TEASER_STYLE, cycle } from "@/interfaces/enum/nav-var"

const ListRoutes = () => {
    const [response, setResponse] = useState<Route[]>([])
    const [teaserIndex, setTeaserIndex] = useState(0);

    const getData = async () => {
        const apiResponse: Route[] = await fetchGET(process.env.NEXT_PUBLIC_REST_API_DUMMY + "/routes")
        setResponse(apiResponse)
    }

    const handlerTeaserStyle = () => {
        setTeaserIndex((prevIndex) => (prevIndex + 1) % cycle.length);
    };

    const teaserClassName = cycle[teaserIndex];

    useEffect(() => {
        getData()
    }, [])

    return (
        <>
            <div className={`whereabout ${teaserClassName}`}>
                {/* <div className="heading">
                    <h1>Rutas de San Isidro</h1>
                </div> */}
                <div className={`whereabout-header `}>
                    <div className="whereabout-header--title">
                        <h2 className="whereabout-header--title-text whereabout-header--title-text--only">
                            <span className="whereabout-header--title-text-longname">Rutas de San Isidro</span>
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
                <div>
                    <ul className="list-route">
                        {
                            response.map((route) => {
                                return (
                                    <ItemRoute item={route} key={route.code} />
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