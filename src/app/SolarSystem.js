"use client";
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const SolarSystem = () => {
  const mountRef = useRef(null);
  const [selectedPlanet, setSelectedPlanet] = useState(null); // Estado para almacenar el planeta seleccionado

  useEffect(() => {
    const currentMount = mountRef.current;

    // Escena, cámara y renderizador
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    currentMount.appendChild(renderer.domElement);

    // Controles de la cámara (OrbitControls)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.autoRotate = false;

    // Raycaster para detectar clics
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Cargar texturas
    const textureLoader = new THREE.TextureLoader();
    const sunTexture = textureLoader.load('/sun.jpg');
    const mercuryTexture = textureLoader.load('/mercury.jpg');
    const venusTexture = textureLoader.load('/venus.jpg');
    const earthTexture = textureLoader.load('/earth.jpg');
    const marsTexture = textureLoader.load('/mars.jpg');
    const jupiterTexture = textureLoader.load('/jupiter.jpg');
    const saturnTexture = textureLoader.load('/saturn.jpg');
    const uranusTexture = textureLoader.load('/uranus.jpg');
    const neptuneTexture = textureLoader.load('/neptune.jpg');

    // Crear el Sol con textura
    const sunGeometry = new THREE.SphereGeometry(3, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);
    
    // Luz brillante para el Sol
    const sunLight = new THREE.PointLight(0xffaa33, 2, 50); // Luz anaranjada intensa
    sunLight.position.set(0, 0, 0); // Posición del Sol
    scene.add(sunLight);

    // Crear efecto de resplandor para el Sol
    const sunGlowGeometry = new THREE.SphereGeometry(3.5, 32, 32);
    const sunGlowMaterial = new THREE.ShaderMaterial({
      uniforms: {
        viewVector: { type: "v3", value: camera.position },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPositionNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPositionNormal = normalize((modelViewMatrix * vec4(position, 1.0)).xyz);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 viewVector;
        varying vec3 vNormal;
        varying vec3 vPositionNormal;
        void main() {
          float intensity = pow(0.6 - dot(vNormal, vPositionNormal), 2.0);
          gl_FragColor = vec4(1.0, 0.6, 0.0, 1.0) * intensity;
        }
      `,
      blending: THREE.AdditiveBlending,
      transparent: true
    });

    const sunGlow = new THREE.Mesh(sunGlowGeometry, sunGlowMaterial);
    scene.add(sunGlow);

    const planetData = [
      {
        name: 'Mercury',
        texture: mercuryTexture,
        distance: 5,
        size: 0.5,
        speed: 0.02,
        rotationSpeed: 0.005,
        info: 'Mercury is the closest planet to the Sun. It is the smallest planet in our solar system. It has a thin exosphere and no moons. The surface of Mercury can reach temperatures of up to 427 degrees Celsius during the day and drop to -184 degrees Celsius at night. The poles of Mercury have water ice. A day on Mercury lasts 59 Earth days.',
      },
      {
        name: 'Venus',
        texture: venusTexture,
        distance: 8,
        size: 0.7,
        speed: 0.015,
        rotationSpeed: 0.003,
        info: 'Venus is the second planet in the solar system. Although it is not the closest to the Sun, it is the hottest planet due to its carbon dioxide-rich atmosphere, which creates a greenhouse effect. A day on Venus lasts 243 Earth days, while a year lasts 225 Earth days. Venus has no moons, and its gravity is 8.87 m/s².',
      },
      {
        name: 'Earth',
        texture: earthTexture,
        distance: 11,
        size: 0.9,
        speed: 0.01,
        rotationSpeed: 0.01,
        info: 'Earth is our home and the third planet in the solar system. It is the only planet we know of that supports life. Earth\'s atmosphere protects us from incoming meteoroids, and it is primarily composed of nitrogen and oxygen. A day on Earth lasts 24 hours, and a year lasts 365.25 days.',
      },
      {
        name: 'Mars',
        texture: marsTexture,
        distance: 14,
        size: 0.8,
        speed: 0.0075,
        rotationSpeed: 0.008,
        info: 'Mars is known as the red planet. It has an average temperature of -65 degrees Celsius and its red color is due to iron oxide in its soil. A day on Mars lasts 24.6 hours, while a year lasts 687 Earth days. Mars has two moons: Phobos and Deimos.',
      },
      {
        name: 'Jupiter',
        texture: jupiterTexture,
        distance: 20,
        size: 2.0,
        speed: 0.005,
        rotationSpeed: 0.02,
        info: 'Jupiter is the largest planet in the solar system. Its mass is more than double that of all the other planets combined. Jupiter has 95 officially recognized moons and its atmosphere is primarily composed of hydrogen and helium. A day on Jupiter lasts only 10 hours, and a year is equivalent to 11.8 Earth years.',
      },
      {
        name: 'Saturn',
        texture: saturnTexture,
        distance: 25,
        size: 1.8,
        speed: 0.003,
        rotationSpeed: 0.02,
        info: 'Saturn is famous for its rings, which are made of ice and rock. It is a gas giant, and its gravity is 10.44 m/s². A day on Saturn lasts 10.7 hours, and it has at least 146 moons.',
      },
      {
        name: 'Uranus',
        texture: uranusTexture,
        distance: 30,
        size: 1.3,
        speed: 0.002,
        rotationSpeed: 0.015,
        info: 'Uranus is an ice giant with a blue color due to methane in its atmosphere. It is the only planet that rotates on its side. A day on Uranus lasts just over 17 hours, and 28 moons have been identified.',
      },
      {
        name: 'Neptune',
        texture: neptuneTexture,
        distance: 35,
        size: 1.2,
        speed: 0.0015,
        rotationSpeed: 0.01,
        info: 'Neptune is the farthest planet from the Sun and is known for having some of the fastest winds in the solar system, reaching speeds of up to 2,100 km/h. It is composed of a thick mixture of water, ammonia, and methane over a solid core the size of Earth. A full rotation on its axis lasts only 16 hours, but its orbit around the Sun (one year) lasts 165 Earth years. Neptune has 14 known moons, with Triton being the largest.',
      }
    ];
    
    // Crear planetas y órbitas con texturas
    const planets = [];
    const orbits = [];
    planetData.forEach((planet) => {
      const planetGeometry = new THREE.SphereGeometry(planet.size, 32, 32);
      const planetMaterial = new THREE.MeshBasicMaterial({ map: planet.texture });
      const mesh = new THREE.Mesh(planetGeometry, planetMaterial);
      mesh.name = planet.name; // Agrega el nombre del planeta como propiedad del mesh
      scene.add(mesh);

      // Crear la órbita con material tenue y tono marrón con resplandor
      const orbitGeometry = new THREE.BufferGeometry().setFromPoints(
        new THREE.Path().absarc(0, 0, planet.distance, 0, Math.PI * 2).getPoints(100)
      );
      const orbitMaterial = new THREE.LineBasicMaterial({
        color: 0xA26A42, // Tono marrón
        transparent: true, // Transparencia
        opacity: 0.3 // Mayor difuminado
      });
      const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
      orbitLine.rotation.x = Math.PI / 2; // Colocar la órbita en el plano XZ
      scene.add(orbitLine);

      planets.push({ mesh, data: planet, distance: planet.distance, speed: planet.speed, angle: 0, rotationSpeed: planet.rotationSpeed });
      orbits.push({ line: orbitLine, data: planet });
    });

    // Crear fondo de estrellas
    const createStars = () => {
      const starGeometry = new THREE.BufferGeometry();
      const starMaterial = new THREE.PointsMaterial({ color: 0xffffff });

      const starVertices = [];
      for (let i = 0; i < 10000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starVertices.push(x, y, z);
      }

      starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));

      const stars = new THREE.Points(starGeometry, starMaterial);
      scene.add(stars);
    };

    createStars();

    // Posicionar la cámara
    camera.position.set(0, 40, 40);
    camera.lookAt(0, 0, 0);

    // Animar el sistema solar
    const animate = () => {
      requestAnimationFrame(animate);

      // Actualizar controles
      controls.update();

      // Rotación de los planetas
      planets.forEach((planet) => {
        planet.angle += planet.speed;
        planet.mesh.position.x = planet.distance * Math.cos(planet.angle);
        planet.mesh.position.z = planet.distance * Math.sin(planet.angle);
        planet.mesh.rotation.y += planet.rotationSpeed;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Manejar clics en los planetas o las órbitas
    const handlePlanetClick = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(planets.map((planet) => planet.mesh));

      if (intersects.length > 0) {
        const clickedPlanet = intersects[0].object;
        const planetInfo = planetData.find((p) => p.name === clickedPlanet.name);
        if (planetInfo) {
          setSelectedPlanet(planetInfo);
        }
      }
    };

    currentMount.addEventListener('click', handlePlanetClick);

    // Limpiar el evento al desmontar el componente
    return () => {
      currentMount.removeEventListener('click', handlePlanetClick);
      currentMount.removeChild(renderer.domElement);
    };
  }, []);

  const handleCloseInfo = () => {
    setSelectedPlanet(null); // Cerrar la información del planeta
  };

  return (
    <div ref={mountRef} style={{ width: '100vw', height: '100vh' }}>
      {selectedPlanet && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold">{selectedPlanet.name}</h2>
            <p>{selectedPlanet.info}</p>
            <button onClick={handleCloseInfo} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SolarSystem;
