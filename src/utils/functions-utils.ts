import { Route } from "@/interfaces/routes-interface"
import { fetchGET } from "./fetcher"


export const getApiRoutes = async () => {
    const apiResponse: Route[] = await fetchGET(process.env.NEXT_PUBLIC_REST_API_DUMMY + "/routes")
    return apiResponse
}

