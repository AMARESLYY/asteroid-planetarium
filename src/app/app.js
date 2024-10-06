const API_KEY = "Y3k0lX9C6HlyfKxJYaXgwHzy7k9wJF96TH4ve0AT";
const startDate = "2023-09-01"; // Cambia estas fechas según necesites
const endDate = "2023-09-08";
const apiUrl = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=${API_KEY}`;

let asteroids = [];
let currentIndex = 0;

// Función para obtener los asteroides
async function fetchAsteroids() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json();
        asteroids = Object.values(data.near_earth_objects).flat();
        displayAsteroid(currentIndex);
    } catch (error) {
        console.error("Error fetching asteroids:", error);
    }
}

// Función para mostrar un asteroide
function displayAsteroid(index) {
    if (index < 0 || index >= asteroids.length) return;

    const asteroid = asteroids[index];
    const asteroidEntity = document.getElementById("asteroid");

    // Escala del asteroide
    const diameter = asteroid.estimated_diameter.kilometers.estimated_diameter_max; // Tamaño máximo
    const scaledRadius = diameter * 0.05; // Ajustar la escala para mejor visibilidad

    asteroidEntity.setAttribute("geometry", {
        primitive: "sphere",
        radius: scaledRadius,
    });
    asteroidEntity.setAttribute("position", { x: 0, y: 0, z: -5 }); // Asegurarse de que esté en la vista

    // Muestra la información del asteroide
    document.getElementById("asteroid-name").innerText = asteroid.name;
    document.getElementById("asteroid-info").innerText = `
        Estimated Diameter: ${diameter.toFixed(2)} km
        Close Approach Date: ${new Date(asteroid.close_approach_data[0].close_approach_date).toLocaleDateString()}
        Miss Distance: ${asteroid.close_approach_data[0].miss_distance.kilometers} km
    `;
}

// Eventos de los botones
document.getElementById("prev-btn").addEventListener("click", () => {
    currentIndex--;
    displayAsteroid(currentIndex);
});

document.getElementById("next-btn").addEventListener("click", () => {
    currentIndex++;
    displayAsteroid(currentIndex);
});

// Inicia la aplicación
fetchAsteroids();
