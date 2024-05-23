"use client"
import "@/components/list-points/routes/list-route.css"
import { useEffect, useState } from "react"
import ItemRoute from "./item-route"
import { fetchGET } from "@/utils/fetcher"
import { Route } from "@/interfaces/routes-interface"

const generateRandomRGBColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}

const ListRoutes = () => {
    const [response, setResponse] = useState<Route[]>([])

    const getData = async () => {
        const apiResponse: Route[] = await fetchGET(process.env.NEXT_PUBLIC_REST_API_DUMMY + "/routes")
        setResponse(apiResponse)
    }

    useEffect(() => {
        getData()
    }, [])

    return (
        <>
            <div className="sidebar">
                <div className="heading">
                    <h1>Rutas de San Isidro</h1>
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