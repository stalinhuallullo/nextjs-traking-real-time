import { HttpError } from "./exception";

export interface Route {
    code: string;
    name: string;
    color: string;
    limit: {
        init: string,
        finish: string
    };
}
export interface Coordinate {
    lat: string;
    lng: string;
}

export interface Whereabout {
    code: string;
    name: string;
    coordinates: Coordinate
}

export interface RoutesWhereabout {
    route: Route;
    whereabout: Whereabout[];
}

export interface Vehicule {
    placa: string,
    brandVehicle: string
}

export interface Live {
    vehicle: Vehicule,
    coordinate: Coordinate,
    date: string
}

export interface LiveVehicle {
    route?: Route;
    live?: Live[];
    error?: string
}
