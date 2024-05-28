import { NextResponse } from "next/server"

import ROUTES from '@/dummyData/rutes.json'

export async function GET(request: Request) {

    return NextResponse.json(ROUTES)
}