// utils/interpolation.ts
export const interpolatePosition = (start: [number, number], end: [number, number], t: number): [number, number] => {
    const [startLng, startLat] = start;
    const [endLng, endLat] = end;
    const interpolatedLng = startLng + (endLng - startLng) * t;
    const interpolatedLat = startLat + (endLat - startLat) * t;
    return [interpolatedLng, interpolatedLat];
};