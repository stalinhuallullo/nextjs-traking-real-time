import { NextResponse } from "next/server"
import JSON_LIVE_RUTA_1 from "@/dummyData/route-live-car_1.json"
import JSON_LIVE_RUTA_2 from "@/dummyData/route-live-car_2.json"
import JSON_LIVE_RUTA_3 from "@/dummyData/route-live-car_3.json"

interface Props {
    params: {
        id: string
    }
}

/**
 * Seguimiento de buses acorde a la ruta
 * @param id Ruta seleccionada 
 * @returns Ubicación actual
 */
export async function GET(request: Request, { params }: Props) {
    const { id } = params

    // Validate that id exists and is a number
    if (!id || isNaN(Number(id))) {
        return NextResponse.json({ error: 'Parametro invalido. El parametro debe ser un valor numérico.' }, { status: 400 });
    }

    try {
        if (id === "01") return NextResponse.json(JSON_LIVE_RUTA_1);
        else if (id === "02") return NextResponse.json(JSON_LIVE_RUTA_2);
        else if (id === "03") return NextResponse.json(JSON_LIVE_RUTA_3);
        //throw new Error('No se pudieron recuperar datos de la API externa');
        return NextResponse.json({ error: 'No se pudieron recuperar datos de la API externa' }, { status: 200 });


        // const response = await fetch(`http://test.munisanisidro.gob.pe/EXPRESOBUS/ListarGPSExpresoRuta?CODLINEA=${id}`);

        // // Check if the response is okay
        // if (!response.ok) {
        //     //throw new Error('No se pudieron recuperar datos de la API externa');
        //     return NextResponse.json({ error: 'No se pudieron recuperar datos de la API externa' }, { status: 400 });
        // }

        // const data = await response.json();

        // return NextResponse.json(data);
    } catch (error: any) {
        console.error('Error fetching data:', error);

        // Handle specific error messages
        const errorMessage = error.message || 'Internal Server Error';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }

}