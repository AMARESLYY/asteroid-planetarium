"use client";
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const API_KEY = "Y3k0lX9C6HlyfKxJYaXgwHzy7k9wJF96TH4ve0AT";
const startDate = "2023-09-01";
const endDate = "2023-09-08";
const apiUrl = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=${API_KEY}`;

let asteroids = [];
let currentIndex = 0;
let scene, camera, renderer, asteroidMesh, chicxulubMesh;

const Asteroids = () => {
    const canvasRef = useRef(null);
    const [asteroidData, setAsteroidData] = useState(null);

    const fetchAsteroids = async () => {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            asteroids = Object.values(data.near_earth_objects).flat();
            setAsteroidData(asteroids[currentIndex]);
        } catch (error) {
            console.error("Error fetching asteroids:", error);
        }
    };

    const initThreeJS = () => {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 3;

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        canvasRef.current.appendChild(renderer.domElement);

        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(5, 5, 5);
        scene.add(light);

        createChicxulubAsteroid();
        animate();
    };

    const createChicxulubAsteroid = () => {
        const chicxulubDiameter = 12; 
        const scaledRadius = chicxulubDiameter * 0.1;

        const geometry = new THREE.SphereGeometry(scaledRadius, 32, 32);
        const textureLoader = new THREE.TextureLoader();
        const yucatanTexture = textureLoader.load('asteroidote.jpg');
        const material = new THREE.MeshStandardMaterial({ map: yucatanTexture });

        chicxulubMesh = new THREE.Mesh(geometry, material);
        chicxulubMesh.position.set(-2, 0, 0); 
        scene.add(chicxulubMesh);
    };

    const displayAsteroid = (index) => {
        if (index < 0 || index >= asteroids.length) return;

        const asteroid = asteroids[index];
        const diameter = asteroid.estimated_diameter.kilometers.estimated_diameter_max;
        const scaledRadius = diameter * 0.1;

        if (asteroidMesh) {
            scene.remove(asteroidMesh);
        }

        const geometry = new THREE.SphereGeometry(scaledRadius, 32, 32);
        const textureLoader = new THREE.TextureLoader();
        const asteroidTexture = textureLoader.load('asteroide.jpg'); 
        const material = new THREE.MeshStandardMaterial({ map: asteroidTexture });

        asteroidMesh = new THREE.Mesh(geometry, material);
        asteroidMesh.position.set(2, 0, 0); 
        scene.add(asteroidMesh);

        // Actualiza los datos del asteroide actual
        setAsteroidData(asteroid);
    };

    const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    };

    useEffect(() => {
        const fetchAndInit = async () => {
            await fetchAsteroids();
            initThreeJS();
            displayAsteroid(currentIndex);
        };

        fetchAndInit();

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (renderer) {
                renderer.dispose();
            }
        };
    }, []);

    const handlePrev = () => {
        currentIndex = Math.max(0, currentIndex - 1);
        displayAsteroid(currentIndex); // Actualiza la visualización
    };

    const handleNext = () => {
        currentIndex = Math.min(asteroids.length - 1, currentIndex + 1);
        displayAsteroid(currentIndex); // Actualiza la visualización
    };

    return (
        <div>
            <div ref={canvasRef} style={{ width: '100%', height: '100vh' }} />
            <div className="info-panel">
                <button className="button" onClick={handlePrev} disabled={currentIndex === 0}>Anterior</button>
                <button className="button" onClick={handleNext} disabled={currentIndex === asteroids.length - 1}>Siguiente</button>
                {asteroidData && (
                    <div>
                        <h2>{asteroidData.name} ({asteroidData.id})</h2>
                        <p>Estimated Diameter: {asteroidData.estimated_diameter.kilometers.estimated_diameter_max.toFixed(2)} km</p>
                        {asteroidData.close_approach_data.length > 0 && (
                            <>
                                <p>Miss Distance: {parseFloat(asteroidData.close_approach_data[0]?.miss_distance.kilometers).toFixed(2)} km</p>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Asteroids;