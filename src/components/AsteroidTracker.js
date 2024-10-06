"use client";

import React, { useEffect, useState } from 'react';
import { getSentryTrackedAsteroids, getTrackedAsteroidInfo } from '../api/collisionProbabilityApi';
import '../AsteroidTracker.css';

const AsteroidTracker = () => {
  const [asteroids, setAsteroids] = useState([]);
  const [currentAsteroid, setCurrentAsteroid] = useState(null);
  const [asteroidIndex, setAsteroidIndex] = useState(0);
  const [impactProbability, setImpactProbability] = useState(null);

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
          </div>
        ) : (
          <p style={{ color: 'white' }}>Loading asteroid info...</p>
        )}
      </div>

      <div style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', fontSize: '2rem', color: 'white' }} onClick={handleNextAsteroid}>
        →
      </div>

    </div>
  );
};

export default AsteroidTracker;
