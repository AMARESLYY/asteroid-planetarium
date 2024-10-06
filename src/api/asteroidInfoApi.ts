const API_KEY = "DEMO_KEY";

if (!API_KEY) {
    throw new Error('API_KEY is not defined in the environment variables');
}

export async function getGeneralAsteroidInfo(start_date: string, end_date: string) {
    const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${start_date}&end_date=${end_date}&api_key=${API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Error fetching asteroid info: ${response.statusText}`);
    }
    return response.json();
}

export async function getSpecificAsteroidInfo(asteroidId: string) {
    const url = `https://api.nasa.gov/neo/rest/v1/neo/${asteroidId}?api_key=${API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Error fetching specific asteroid info: ${response.statusText}`);
    }
    return response.json();
}