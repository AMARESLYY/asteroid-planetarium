"use client";

import React, { useEffect, useState } from 'react';
import { getSentryTrackedAsteroids, getTrackedAsteroidInfo } from '../api/collisionProbabilityApi';
import '../AsteroidTracker.css';
import Image from "next/image";

const AsteroidTracker = () => {
  const [asteroids, setAsteroids] = useState([]);
  const [currentAsteroid, setCurrentAsteroid] = useState(null);
  const [asteroidIndex, setAsteroidIndex] = useState(0);
  const [impactProbability, setImpactProbability] = useState(null);
  const [energy, setEnergy] = useState(null);
  const [showExplosion, setShowExplosion] = useState(false); // State to control the pop-up

  const asteroidImages = [
    '/Asteroids/1.png',
    '/Asteroids/2.png',
    '/Asteroids/3.png',
    '/Asteroids/5.png',
    '/Asteroids/7.png',
    '/Asteroids/8.png',
    '/Asteroids/13.png',
  ];

  const imageIndex = asteroidIndex % asteroidImages.length;
  const asteroidImage = asteroidImages[imageIndex];

  useEffect(() => {
    const fetchAsteroids = async () => {
      try {
        const data = await getSentryTrackedAsteroids();
        setAsteroids(data.data); 
        if (data.data.length > 0) {
          setCurrentAsteroid(data.data[0].des);
        }
      } catch (error) {
        console.error('Error fetching asteroids:', error);
      }
    };
    fetchAsteroids();
  }, []);

  useEffect(() => {
    const fetchAsteroidInfo = async () => {
      if (!currentAsteroid) return;
      try {
        const data = await getTrackedAsteroidInfo(currentAsteroid);
        setImpactProbability(data['data'][0].ip);
        setEnergy(data['data'][0].energy); // Assuming energy is part of the API response
      } catch (error) {
        console.error('Error fetching asteroid details:', error);
      }
    };
    fetchAsteroidInfo();
  }, [currentAsteroid]);

  const handleNextAsteroid = () => {
    const nextIndex = (asteroidIndex + 1) % asteroids.length;
    setAsteroidIndex(nextIndex);
    setCurrentAsteroid(asteroids[nextIndex].des);
  };

  const handlePreviousAsteroid = () => {
    const prevIndex = (asteroidIndex - 1 + asteroids.length) % asteroids.length;
    setAsteroidIndex(prevIndex);
    setCurrentAsteroid(asteroids[prevIndex].des);
  };

  // Calculate crater diameter based on energy
  const craterDiameter = energy ? 300 * Math.cbrt(energy) * .01: 0; // in pixels (km = pixels)

  const handleShowExplosion = () => {
    setShowExplosion(true);
  };

  const handleCloseExplosion = () => {
    setShowExplosion(false);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'black' }}>
      
      <div style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', fontSize: '2rem', color: 'white' }} onClick={handlePreviousAsteroid}>
        ←
      </div>

      <div style={{ textAlign: 'center' }}>
        <img
          src={asteroidImage}
          alt={`Asteroide ${currentAsteroid}`}
          style={{ width: '500px', height: '500px', objectFit: 'contain', borderRadius: '10px' }}
          />
        {currentAsteroid && impactProbability !== null ? (
          <div className='impact-info' style={{ marginTop: '10px', color: 'white', textAlign: 'center' }}>
            <h2>Asteroid: {currentAsteroid}</h2>
            <p>Probability of Impact: {(impactProbability * 100).toFixed(6)}%</p>
            {energy !== null ? (
              <p>Energy: {energy} MT</p>
            ) : (
              <p>Loading energy data...</p>
            )}

            {/* Show explosion button */}
            <button onClick={handleShowExplosion} style={{ marginTop: '10px', padding: '10px', fontSize: '1rem' }}>
              Show explosion
            </button>
          </div>
        ) : (
          <p style={{ color: 'white' }}>Loading asteroid info...</p>
        )}
      </div>

      <div style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', fontSize: '2rem', color: 'white' }} onClick={handleNextAsteroid}>
        →
      </div>

      {/* Explosion pop-up */}
      {showExplosion && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '80%', height: '80%', textAlign: 'center' }}>
          <Image className="object-cover" fill alt="Image" src={"/img.png"} />
            <div
              style={{
                position: 'absolute',
                width: `${craterDiameter}px`, // Crater diameter based on energy
                height: `${craterDiameter}px`,
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 0, 0, 0.5)', // Red circle
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)', // Center the crater
              }}
            ></div>
            <button onClick={handleCloseExplosion} style={{ marginTop: '10px', padding: '10px', fontSize: '1rem', position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)' }}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AsteroidTracker;
