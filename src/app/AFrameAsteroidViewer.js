"use client";
import { useEffect } from 'react';

const API_KEY = "Y3k0lX9C6HlyfKxJYaXgwHzy7k9wJF96TH4ve0AT";
const startDate = "2023-09-01";
const endDate = "2023-09-08";
const apiUrl = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=${API_KEY}`;

export default function AFrameAsteroidViewer() {
  useEffect(() => {
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

      const diameter = asteroid.estimated_diameter.kilometers.estimated_diameter_max;
      const scaledRadius = diameter * 0.05;

      asteroidEntity.setAttribute("geometry", {
        primitive: "sphere",
        radius: scaledRadius,
      });
      asteroidEntity.setAttribute("position", { x: 0, y: 1, z: -5 }); // Centrar el asteroide en la escena

      document.getElementById("asteroid-name").innerText = asteroid.name;
      document.getElementById("asteroid-info").innerText = `
        Estimated Diameter: ${diameter.toFixed(2)} km
        Close Approach Date: ${new Date(asteroid.close_approach_data[0].close_approach_date).toLocaleDateString()}
        Miss Distance: ${asteroid.close_approach_data[0].miss_distance.kilometers} km
      `;
    }

    // Manejar clicks de botones
    document.getElementById("prev-btn").addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + asteroids.length) % asteroids.length;
      displayAsteroid(currentIndex);
    });

    document.getElementById("next-btn").addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % asteroids.length;
      displayAsteroid(currentIndex);
    });

    fetchAsteroids();
  }, []);

  return (
    <div>
      <a-scene background="color: #000"> {/* Cambia el color de fondo para asegurar visibilidad */}
        {/* Cielo y luz */}
        <a-sky color="#000"></a-sky>
        <a-light type="ambient" color="#fff" intensity="0.5"></a-light>
        <a-light type="point" intensity="1" position="2 4 -3"></a-light>

        {/* Asteroide */}
        <a-entity id="asteroid" geometry="primitive: sphere; radius: 1" material="color: gray"></a-entity>

        {/* Cámara */}
        <a-camera position="0 1.6 0"></a-camera>
      </a-scene>

      {/* Panel de información */}
      <div className="info-panel" style={infoPanelStyles}>
        <h3 id="asteroid-name">Asteroid Name</h3>
        <p id="asteroid-info">Information about the asteroid will appear here.</p>
        <button className="button" style={buttonStyles} id="prev-btn">Previous</button>
        <button className="button" style={buttonStyles} id="next-btn">Next</button>
      </div>
    </div>
  );
}

// Estilos en línea
const infoPanelStyles = {
  position: 'fixed',
  bottom: '10px',
  left: '10px',
  background: 'rgba(255, 255, 255, 0.8)',
  padding: '10px',
  borderRadius: '5px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
};

const buttonStyles = {
  cursor: 'pointer',
  margin: '5px',
  padding: '10px',
  backgroundColor: '#007BFF',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
};
