"use client"
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const API_KEY = "Y3k0lX9C6HlyfKxJYaXgwHzy7k9wJF96TH4ve0AT";
const startDate = "2023-09-01";
const endDate = "2023-09-08";
const apiUrl = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=${API_KEY}`;

let asteroids = [];
let currentIndex = 0;

const Asteroids = () => {
    const canvasRef = useRef(null);
    const [asteroidData, setAsteroidData] = useState(null);
    const rendererRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const asteroidMeshRef = useRef(null);
    const chicxulubMeshRef = useRef(null);

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
        sceneRef.current = new THREE.Scene();
        cameraRef.current = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        cameraRef.current.position.z = 3;

        rendererRef.current = new THREE.WebGLRenderer({ antialias: true });
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
        canvasRef.current.appendChild(rendererRef.current.domElement);

        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(5, 5, 5);
        sceneRef.current.add(light);

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

        chicxulubMeshRef.current = new THREE.Mesh(geometry, material);
        chicxulubMeshRef.current.position.set(-2, 0, 0); 
        sceneRef.current.add(chicxulubMeshRef.current);
    };

    const displayAsteroid = (index) => {
        if (index < 0 || index >= asteroids.length) return;

        const asteroid = asteroids[index];
        const diameter = asteroid.estimated_diameter.kilometers.estimated_diameter_max;
        const scaledRadius = diameter * 0.1;

        if (asteroidMeshRef.current) {
            sceneRef.current.remove(asteroidMeshRef.current);
        }

        const geometry = new THREE.SphereGeometry(scaledRadius, 32, 32);
        const textureLoader = new THREE.TextureLoader();
        const asteroidTexture = textureLoader.load('asteroide.jpg'); 
        const material = new THREE.MeshStandardMaterial({ map: asteroidTexture });

        asteroidMeshRef.current = new THREE.Mesh(geometry, material);
        asteroidMeshRef.current.position.set(2, 0, 0); 
        sceneRef.current.add(asteroidMeshRef.current);

        setAsteroidData(asteroid);
    };

    const animate = () => {
        requestAnimationFrame(animate);
        rendererRef.current.render(sceneRef.current, cameraRef.current);
    };

    useEffect(() => {
        const fetchAndInit = async () => {
            await fetchAsteroids();
            initThreeJS();
            displayAsteroid(currentIndex);
        };
    
        fetchAndInit();
    
        const handleResize = () => {
            cameraRef.current.aspect = window.innerWidth / window.innerHeight;
            cameraRef.current.updateProjectionMatrix();
            rendererRef.current.setSize(window.innerWidth, window.innerHeight);
        };
    
        window.addEventListener('resize', handleResize);
    
        return () => {
            window.removeEventListener('resize', handleResize);
            if (rendererRef.current) {
                rendererRef.current.dispose();
                canvasRef.current.removeChild(rendererRef.current.domElement);
            }
        };
    }, []);
    
    const handlePrev = () => {
        currentIndex = Math.max(0, currentIndex - 1);
        displayAsteroid(currentIndex);
    };

    const handleNext = () => {
        currentIndex = Math.min(asteroids.length - 1, currentIndex + 1);
        displayAsteroid(currentIndex);
    };

    return (
        <div>
            <div ref={canvasRef} style={{ width: '100%', height: '100vh' }} />
            <div className="info-panel">
                <button className="button" onClick={handlePrev} disabled={currentIndex === 0}>Anterior</button>
                <button className="button" onClick={handleNext} disabled={currentIndex === asteroids.length - 1}>Siguiente</button>
                {asteroidData && (
                    <div>
                        <h2>{asteroidData.name}</h2>
                        <p>Diámetro: {asteroidData.estimated_diameter.kilometers.estimated_diameter_max.toFixed(2)} km</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Asteroids;
