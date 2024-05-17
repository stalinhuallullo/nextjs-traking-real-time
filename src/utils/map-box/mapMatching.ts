/*import axios from 'axios';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export const getMatchedRoute = async (coordinates: number[][]) => {
  const baseUrl = 'https://api.mapbox.com/matching/v5/mapbox/driving';
  const coordString = coordinates.map(coord => coord.join(',')).join(';');
  const url = `${baseUrl}/${coordString}?access_token=${MAPBOX_TOKEN}&geometries=geojson`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching matched route:', error);
    throw error;
  }
};

*/

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export const getMatchedRoute = async (coordinates: number[][]) => {
    const baseUrl = 'https://api.mapbox.com/matching/v5/mapbox/driving';
    const coordString = coordinates.map(coord => coord.join(',')).join(';');
    const url = `${baseUrl}/${coordString}?access_token=${MAPBOX_TOKEN}&geometries=geojson`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Error fetching matched route');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching matched route:', error);
        throw error;
    }
};