// src/api/collisionProbabilityApi.ts
export async function getCollisionProbability(asteroidId: string) {
    const response = await fetch(`https://another-api.example.com/collision-probability/${asteroidId}`);
    return response.json();
  }