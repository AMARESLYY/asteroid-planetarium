"use client"; 

import React, { useEffect, useState } from 'react';
import { getSentryTrackedAsteroids, getTrackedAsteroidInfo } from '../api/collisionProbabilityApi';
import '../AsteroidTracker.css'; // Import the CSS file


const AsteroidTracker = () => {
  const [asteroids, setAsteroids] = useState([]);
  const [currentAsteroid, setCurrentAsteroid] = useState(null);
  const [asteroidIndex, setAsteroidIndex] = useState(0);
  const [impactProbability, setImpactProbability] = useState(null);

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
    <div>
      <h1>Asteroid Tracker</h1>

      {asteroids.length > 0 && (
        <div>
          <h3>Asteroids Being Tracked</h3>
          <ul>
            {asteroids.map((asteroid, index) => (
              <li
                key={asteroid.des}
                style={{ cursor: 'pointer', color: asteroidIndex === index ? 'blue' : '#757575' }}
                onClick={() => {
                  setAsteroidIndex(index);
                  setCurrentAsteroid(asteroid.des);
                }}
              >
                {asteroid.des}
              </li>
            ))}
          </ul>
        </div>
      )}

      {currentAsteroid && impactProbability !== null ? (
        <div className='impact-info'>
          <h2>Asteroid: {currentAsteroid}</h2>
          <p>Probability of Impact: {impactProbability}</p>
        </div>
      ) : (
        <p>Loading asteroid info...</p>
      )}

      <div>
        <button onClick={handlePreviousAsteroid} disabled={asteroids.length === 0}>
          Previous Asteroid
        </button>
        <button onClick={handleNextAsteroid} disabled={asteroids.length === 0}>
          Next Asteroid
        </button>
      </div>
    </div>
  );
};



export default AsteroidTracker;
