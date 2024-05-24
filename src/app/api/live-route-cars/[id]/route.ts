import { NextResponse } from "next/server"

interface Props {
    params: {
        id: string
    }
}

export async function GET(request: Request, { params }: Props) {

    const { id } = params

    // Validate that id exists and is a number
    if (!id || isNaN(Number(id))) {
        return NextResponse.json({ error: 'Parametro invalido. El parametro debe ser un valor numérico.' }, { status: 400 });
    }

    try {
        const response = await fetch(`http://test.munisanisidro.gob.pe/EXPRESOBUS/ListarGPSExpresoRuta?CODLINEA=${id}`);

        // Check if the response is okay
        if (!response.ok) {
            //throw new Error('No se pudieron recuperar datos de la API externa');
            return NextResponse.json({ error: 'No se pudieron recuperar datos de la API externa' }, { status: 400 });
        }

        const data = await response.json();

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Error fetching data:', error);

        // Handle specific error messages
        const errorMessage = error.message || 'Internal Server Error';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }

}