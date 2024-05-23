import { NextRequest, NextResponse } from "next/server"
import WHEREABOUT_1 from "@/dummyData/whereabout_1.json"
import WHEREABOUT_2 from "@/dummyData/whereabout_2.json"
import WHEREABOUT_3 from "@/dummyData/whereabout_3.json"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {

    const { id } = params

    if (id === "01") return NextResponse.json(WHEREABOUT_1)
    else if (id === "02") return NextResponse.json(WHEREABOUT_2)
    else if (id === "03") return NextResponse.json(WHEREABOUT_3)

    return NextResponse.json(id)
}