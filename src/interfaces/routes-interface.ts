export interface Route {
    code: string;
    name: string;
    color: string;
    limit: {
        init: string,
        finish: string
    };
}

export interface Whereabout {
    code: string;
    name: string;
    coordinates: {
        lat: string,
        lng: string
    };
}

export interface RoutesWhereabout {
    route: Route;
    whereabout: Whereabout[];
}