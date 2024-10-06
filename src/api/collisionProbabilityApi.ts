export async function getSentryTrackedAsteroids() {
    const url = `https://ssd-api.jpl.nasa.gov/sentry.api`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Error fetching sentry tracked asteroids: ${response.statusText}`);
    }
    return response.json();
  }

export async function getTrackedAsteroidInfo(asteroid_designation: string) {
    const response = await fetch(`https://ssd-api.jpl.nasa.gov/sentry.api?des=${asteroid_designation}`);
    if (!response.ok) {
        throw new Error(`Error fetching sentry tracked asteroids: ${response.statusText}`);
    }
    return response.json();
  }