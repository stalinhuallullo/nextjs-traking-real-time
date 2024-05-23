import { NextResponse } from "next/server"

export async function GET(request: Request) {

    let ruoutes = [
        {
            "code": "01",
            "name": "PERIFERICA",
            "color": "rgb(228, 26, 10)",
            "limit": {
                "init": "Guardia Civil",
                "finish": "Av. Parque Norte"
            }
        },
        {
            "code": "02",
            "name": "NORTE CENTRO FINANCIERO",
            "color": "rgb(201, 15, 250)",
            "limit": {
                "init": "Calle Barcelona",
                "finish": "Av Guillermo Prescott"
            }
        },
        {
            "code": "03",
            "name": "SUR CENTRO FINANCIERO",
            "color": "rgb(160, 230, 11)",
            "limit": {
                "init": "Calle Clemente X",
                "finish": "Av. Salaverry"
            }
        }
    ]

    return NextResponse.json(ruoutes)
}