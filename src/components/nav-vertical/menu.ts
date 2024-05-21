import icon_car_nav from '@public/icons/icon_car_nav.png'
import icon_bell from '@public/icons/icon_bell.png'
import icon_whereabout_peaple from '@public/icons/icon_whereabout_peaple.png'

export interface IItemMenu {
    menu: string,
    image: any,
    span: string,
}

export const MENU: IItemMenu[] = [
    {
        menu: "BELL",
        image: icon_bell.src,
        span: "Mensaje",
    },
    {
        menu: "RUTE",
        image: icon_car_nav.src,
        span: "Rutas",
    },
    {
        menu: "WHEREABOUT",
        image: icon_whereabout_peaple.src,
        span: "Paraderos",
    },
]