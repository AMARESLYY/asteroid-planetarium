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
        info: `Did you know?<br />
          It’s the closest planet to the Sun, but it’s not actually the hottest.<br /><br />
          <strong>Structure and Surface</strong><br />
          Mercury is the smallest planet in our solar system.<br />
          It’s a terrestrial planet—small and rocky.<br />
          It has a thin exosphere.<br />
          Mercury has no moons.<br />
          The surface of Mercury can reach up to 427°C during the day and drop to -184°C at night.<br />
          Mercury's poles have water ice.<br /><br />
          <strong>Tiempo en Mercurio</strong><br />
          One day on Mercury lasts 59 Earth days.`,
      },
      {
        name: 'Venus',
        texture: venusTexture,
        distance: 8,
        size: 0.7,
        speed: 0.015,
        rotationSpeed: 0.003,
        info: `Did you know?<br />
          Although it's not the closest to the Sun, Venus is the hottest planet due to its atmosphere filled with carbon dioxide, which causes a greenhouse effect, and clouds made of sulfuric acid. These gases trap heat and keep Venus very warm.<br /><br />
          On Venus, a day is longer than a year! This planet rotates very slowly and in the opposite direction to most other planets, taking 243 Earth days to rotate once, while it takes 225 Earth days to orbit the Sun.<br /><br />
          Venus has no moons because its gravitational pull would make it difficult for any moon to stay in orbit.<br />
          Its gravity is 8.87 m/s², which is 0.9 times Earth's gravity!<br />
          Its mass is 4.867 x 10²⁶ kg, about 0.82 times that of Earth.`,
      },
      {
        name: 'Earth',
        texture: earthTexture,
        distance: 11,
        size: 0.9,
        speed: 0.01,
        rotationSpeed: 0.01,
        info: `Did you know?<br />
          Earth's atmosphere protects us from incoming meteors; most of them disintegrate in the atmosphere before reaching the surface.<br /><br />
          <strong>Structure and Surface</strong><br />
          Earth is a small, rocky terrestrial planet.<br />
          Earth’s atmosphere is just the right thickness to keep the planet warm and allow life to exist.<br />
          It is the only planet in our solar system known to support life.<br />
          The atmosphere is mostly nitrogen, with enough oxygen for us to breathe.<br /><br />
          <strong>Time on Earth</strong><br />
          One day on Earth lasts 24 hours.<br />
          One year on Earth lasts 365.25 days. Those extra 0.25 days mean we add a day to our calendar every four years. We call it a leap day.`,
      },
      {
        name: 'Mars',
        texture: marsTexture,
        distance: 14,
        size: 0.8,
        speed: 0.0075,
        rotationSpeed: 0.008,
        info: `Did you know?<br />
          Mars has an average temperature of -65°C, far below freezing!<br />
          It’s about half the size of Earth.<br />
          Its red color is due to iron oxide (rust) in its soil.<br />
          Mars has seasons!<br />
          A day on Mars lasts 24.6 hours, just a little longer than a day on Earth, while a year lasts 687 Earth days.<br />
          Mars has two moons. Their names are Phobos and Deimos.`,
      },
      {
        name: 'Jupiter',
        texture: jupiterTexture,
        distance: 20,
        size: 2.0,
        speed: 0.005,
        rotationSpeed: 0.02,
        info: `Did you know?<br />
          Jupiter is the largest planet in our solar system. Its mass is more than double that of all the other planets combined. It’s similar to a star, but never got massive enough to ignite.<br /><br />
          <strong>Structure and Surface</strong><br />
          Jupiter has 95 officially recognized moons.<br />
          It’s made primarily of hydrogen and helium.<br />
          It has a very dense atmosphere.<br />
          Jupiter has rings, but they’re very hard to see.<br />
          The Great Red Spot on this giant planet is a centuries-old storm, bigger than Earth.<br /><br />
          <strong>Time on Jupiter</strong><br />
          A day on Jupiter lasts only 10 hours.<br />
          A year on Jupiter equals 11.8 Earth years.`,
      },
      {
        name: 'Saturn',
        texture: saturnTexture,
        distance: 25,
        size: 1.8,
        speed: 0.003,
        rotationSpeed: 0.02,
        info: `Did you know?<br />
          Saturn is not the only planet with rings, but it certainly has the most beautiful ones. The rings are made up of countless small rings of ice and rock.<br />
          When Galileo Galilei first observed Saturn through a telescope in the 17th century, he wasn’t sure what he was seeing. At first, he thought he was looking at three planets or a planet with handles. We now know those "handles" turned out to be Saturn’s rings.<br /><br />
          <strong>Structure and Surface</strong><br />
          Saturn is a gas giant like Jupiter. It’s made primarily of hydrogen and helium.<br />
          Saturn has a thick atmosphere.<br />
          Saturn has a stunning system of seven main rings with gaps between them.<br />
          Its gravity is 10.44 m/s², about 1.06 times Earth’s gravity.<br />
          Its mass is 5.683 x 10²⁶ kg, nearly 95 times the mass of Earth!<br /><br />
          <strong>Time on Saturn</strong><br />
          A day on Saturn lasts only 10.7 hours.<br />
          As of June 8, 2023, Saturn has 146 moons.`,
      },
      {
        name: 'Uranus',
        texture: uranusTexture,
        distance: 30,
        size: 1.3,
        speed: 0.002,
        rotationSpeed: 0.015,
        info: `Did you know?<br />
          Uranus is made of water, methane, and ammonia over a small rocky core. Methane gives Uranus its blue color.<br /><br />
          <strong>Structure and Surface</strong><br />
          Uranus is surrounded by 13 rings.<br />
          It’s an ice giant. It consists mainly of icy materials flowing over a solid core.<br />
          It has a thick atmosphere made of methane, hydrogen, and helium.<br />
          It’s the only planet that rotates on its side.<br />
          Uranus spins in the opposite direction to Earth and most other planets.<br />
          28 moons have been identified.<br /><br />
          <strong>Time on Uranus</strong><br />
          A day on Uranus lasts a little over 17 hours (17 hours and 14 minutes to be exact).`,
      },
      {
        name: 'Neptune',
        texture: neptuneTexture,
        distance: 35,
        size: 1.2,
        speed: 0.0015,
        rotationSpeed: 0.01,
        info: `Did you know?<br />
          Neptune is the farthest planet from the Sun, but despite its distance, it’s famous for having some of the fastest winds in the solar system, reaching up to 2,100 km/h!<br />
          It’s composed of a thick mixture of water, ammonia, and methane over a solid core the size of Earth. Methane gives Neptune its distinct blue color.<br />
          A complete rotation on its axis takes only 16 hours, but its orbit around the Sun (a year) lasts 165 Earth years.<br />
          It has 14 known moons, with Triton being the largest and most famous!<br />
          Neptune has a system of 7 faint and dark rings, made of dust and rocky material from collisions between moons or asteroids captured by the planet’s gravity.<br />
          Its gravity is 11.15 m/s², about 1.14 times Earth’s gravity!<br />
          Its mass is 1.024 x 10²⁶ kg, about 17 times that of Earth!`
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
            <p dangerouslySetInnerHTML={{ __html: selectedPlanet.info }}></p>
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
