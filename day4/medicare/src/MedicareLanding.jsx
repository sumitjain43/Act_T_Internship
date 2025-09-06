import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { useInView } from "react-intersection-observer";

function MedicareLanding() {
  const mountRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Basic setup (scene, camera, renderer)
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x88ccff, 0.0007);
    
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    camera.position.set(0, 200, 800);

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);

    // Controls and lights
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    controls.minDistance = 400;
    controls.maxDistance = 1500;

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(200, 500, 300);
    scene.add(directionalLight);
    
    const pointLight1 = new THREE.PointLight(0x00c896, 2, 1000);
    pointLight1.position.set(200, 300, 300);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0x4f9cff, 2, 1000);
    pointLight2.position.set(-200, 300, -300);
    scene.add(pointLight2);
    
    // Animated grid
    const gridHelper = new THREE.GridHelper(2000, 50, 0x4f9cff, 0xcccccc);
    gridHelper.position.y = -50;
    scene.add(gridHelper);

    // 3D Medical Symbols
    // Cross geometry with improved materials
    const crossShape = new THREE.Shape();
    const s = 40;
    crossShape.moveTo(-s, s / 3);
    crossShape.lineTo(-s, -s / 3);
    crossShape.lineTo(-s / 3, -s / 3);
    crossShape.lineTo(-s / 3, -s);
    crossShape.lineTo(s / 3, -s);
    crossShape.lineTo(s / 3, -s / 3);
    crossShape.lineTo(s, -s / 3);
    crossShape.lineTo(s, s / 3);
    crossShape.lineTo(s / 3, s / 3);
    crossShape.lineTo(s / 3, s);
    crossShape.lineTo(-s / 3, s);
    crossShape.lineTo(-s / 3, s / 3);

    const extrudeSettings = { 
      depth: 20, 
      bevelEnabled: true,
      bevelThickness: 2,
      bevelSize: 1,
      bevelSegments: 3
    };
    
    const crossGeometry = new THREE.ExtrudeGeometry(crossShape, extrudeSettings);
    const crossMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x4f9cff,
      roughness: 0.3,
      metalness: 0.7
    });
    
    const cross = new THREE.Mesh(crossGeometry, crossMaterial);
    cross.position.set(0, 200, -600);
    cross.rotation.x = Math.PI * 0.15;
    scene.add(cross);
    
    // Add a pulsing heart model
    const heartGeometry = new THREE.TorusKnotGeometry(30, 8, 64, 16, 2, 3);
    const heartMaterial = new THREE.MeshStandardMaterial({
      color: 0xff4466,
      roughness: 0.2,
      metalness: 0.5
    });
    const heart = new THREE.Mesh(heartGeometry, heartMaterial);
    heart.position.set(-200, 150, -400);
    scene.add(heart);
    
    // Add floating spheres for DNA-like effect
    const sphereGroup = new THREE.Group();
    const dnaSphereGeometry = new THREE.SphereGeometry(8, 16, 16); // Renamed to avoid conflict
    const sphereMaterial1 = new THREE.MeshStandardMaterial({ color: 0x00c896 });
    const sphereMaterial2 = new THREE.MeshStandardMaterial({ color: 0x4f9cff });
    
    // Create 30 spheres in a helix-like pattern
    for (let i = 0; i < 30; i++) {
      const material = i % 2 === 0 ? sphereMaterial1 : sphereMaterial2;
      const sphere = new THREE.Mesh(dnaSphereGeometry, material); // Use the new name
      
      // Position in a spiral
      const angle = i * 0.2;
      const radius = 100 + i * 5;
      sphere.position.x = Math.cos(angle) * radius;
      sphere.position.y = i * 10;
      sphere.position.z = Math.sin(angle) * radius - 400;
      
      sphereGroup.add(sphere);
    }
    
    scene.add(sphereGroup);

    // Simplified particles system for better performance
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 500;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    const colorOptions = [
      new THREE.Color(0x00c896), // teal
      new THREE.Color(0x4f9cff), // blue
      new THREE.Color(0xffffff)  // white
    ];
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      // Position particles in a sphere
      const radius = 1000;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.6; // flatten vertically
      positions[i3 + 2] = radius * Math.cos(phi);
      
      // Random color from options
      const color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
      
      // Random size
      sizes[i] = Math.random() * 3 + 2;
    }
    
    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    particlesGeometry.setAttribute(
      "originalPosition",
      new THREE.BufferAttribute(positions.slice(), 3)
    );
    particlesGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(colors, 3)
    );
    particlesGeometry.setAttribute(
      "size",
      new THREE.BufferAttribute(sizes, 1)
    );

    // Create a simplified material for particles
    const particlesMaterial = new THREE.PointsMaterial({
      size: 4,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.7,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
    });
    
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
    
    // Add dark particles in blue-shaded areas
    const darkParticlesGeometry = new THREE.BufferGeometry();
    const darkParticleCount = 300;
    const darkPositions = new Float32Array(darkParticleCount * 3);
    const darkColors = new Float32Array(darkParticleCount * 3);
    const darkSizes = new Float32Array(darkParticleCount);
    
    const darkColorOptions = [
      new THREE.Color(0x222233), // dark blue
      new THREE.Color(0x111122), // very dark blue
      new THREE.Color(0x000011)  // almost black with blue tint
    ];
    
    for (let i = 0; i < darkParticleCount; i++) {
      const i3 = i * 3;
      // Position dark particles in lower part of the scene (where grid is)
      const radius = 800 + Math.random() * 400;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 0.5 + 0.5); // Concentrate in lower hemisphere
      
      darkPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      darkPositions[i3 + 1] = -100 + Math.random() * 200; // Keep near grid level
      darkPositions[i3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
      
      // Dark color from options
      const color = darkColorOptions[Math.floor(Math.random() * darkColorOptions.length)];
      darkColors[i3] = color.r;
      darkColors[i3 + 1] = color.g;
      darkColors[i3 + 2] = color.b;
      
      // Varied sizes for depth effect
      darkSizes[i] = Math.random() * 4 + 3;
    }
    
    darkParticlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(darkPositions, 3)
    );
    darkParticlesGeometry.setAttribute(
      "originalPosition",
      new THREE.BufferAttribute(darkPositions.slice(), 3)
    );
    darkParticlesGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(darkColors, 3)
    );
    darkParticlesGeometry.setAttribute(
      "size",
      new THREE.BufferAttribute(darkSizes, 1)
    );

    // Create material for dark particles with less opacity
    const darkParticlesMaterial = new THREE.PointsMaterial({
      size: 5,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.5,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
    });
    
    const darkParticles = new THREE.Points(darkParticlesGeometry, darkParticlesMaterial);
    scene.add(darkParticles);
    
    // Add floating medical icons with enhanced variety
    const iconCount = 30; // Increased count for more visual interest
    const iconGroup = new THREE.Group();
    
    // Create different medical icon geometries with more variety
    const pillGeometry = new THREE.CapsuleGeometry(5, 15, 8, 8);
    const torusGeometry = new THREE.TorusGeometry(10, 3, 16, 32);
    const boxGeometry = new THREE.BoxGeometry(10, 10, 10);
    const octahedronGeometry = new THREE.OctahedronGeometry(8, 0);
    const tetrahedronGeometry = new THREE.TetrahedronGeometry(10, 0);
    
    const iconGeometries = [
      pillGeometry, 
      dnaSphereGeometry, 
      torusGeometry, 
      boxGeometry, 
      octahedronGeometry, 
      tetrahedronGeometry
    ];
    
    // More vibrant color palette
    const iconMaterials = [
      new THREE.MeshStandardMaterial({ color: 0xff5555, roughness: 0.3, metalness: 0.7 }), // Red
      new THREE.MeshStandardMaterial({ color: 0x55ff55, roughness: 0.3, metalness: 0.7 }), // Green
      new THREE.MeshStandardMaterial({ color: 0x5555ff, roughness: 0.3, metalness: 0.7 }), // Blue
      new THREE.MeshStandardMaterial({ color: 0xffaa00, roughness: 0.3, metalness: 0.7 }), // Orange
      new THREE.MeshStandardMaterial({ color: 0xaa55ff, roughness: 0.3, metalness: 0.7 }), // Purple
      new THREE.MeshStandardMaterial({ color: 0x00ffff, roughness: 0.3, metalness: 0.7 })  // Cyan
    ];
    
    for (let i = 0; i < iconCount; i++) {
      const geomIndex = Math.floor(Math.random() * iconGeometries.length);
      const matIndex = Math.floor(Math.random() * iconMaterials.length);
      
      const icon = new THREE.Mesh(iconGeometries[geomIndex], iconMaterials[matIndex]);
      
      // Random position in a larger sphere with more spread
      const radius = Math.random() * 800 + 400;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      icon.position.x = radius * Math.sin(phi) * Math.cos(theta);
      icon.position.y = radius * Math.sin(phi) * Math.sin(theta) * 0.6;
      icon.position.z = radius * Math.cos(phi);
      
      icon.rotation.x = Math.random() * Math.PI;
      icon.rotation.y = Math.random() * Math.PI;
      icon.rotation.z = Math.random() * Math.PI;
      
      // Fixed scale for all icons
      icon.scale.setScalar(0.5);
      icon.castShadow = true;
      
      // Store original position and additional animation parameters
      icon.userData.originalPosition = icon.position.clone();
      icon.userData.randomOffset = Math.random() * Math.PI * 2;
      icon.userData.speed = Math.random() * 0.5 + 0.5; // Random speed for varied animation
      icon.userData.amplitude = Math.random() * 20 + 10; // Random amplitude for movement
      
      iconGroup.add(icon);
    }
    
    scene.add(iconGroup);

    const clock = new THREE.Clock();
    const initialCameraZ = camera.position.z;
    
    const animate = () => {
      requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Enhanced camera animation with dynamic movement patterns
      const cameraRadius = 100 + Math.sin(elapsedTime * 0.05) * 30; // Breathing radius effect
      const cameraHeight = Math.sin(elapsedTime * 0.1) * 40 + 250; // More dramatic height variation
      const cameraSpeed = 0.1 + Math.sin(elapsedTime * 0.03) * 0.05; // Variable speed
      
      // Orbital movement with dynamic radius and height
      camera.position.x = 300 + Math.sin(elapsedTime * cameraSpeed) * cameraRadius;
      camera.position.y = cameraHeight;
      camera.position.z = 700 + Math.cos(elapsedTime * cameraSpeed) * cameraRadius;
      
      // Animate cross
      cross.rotation.y += 0.005;
      cross.position.y = 200 + Math.sin(elapsedTime * 0.8) * 20;
      
      // Animate heart with rotation only (no pulse)
       // Fixed scale without pulsing
       heart.scale.set(1.15, 1.15, 1.15);
       
       // Add subtle rotation to heart
       heart.rotation.y = elapsedTime * 0.1; // Slow rotation
       
       // Fixed color without pulsing
       if (heart.material) {
         heart.material.emissive.setRGB(0.3, 0, 0.1);
       }
      
      // Enhanced grid animation with faster movement and rotation
      gridHelper.position.y = -50 + Math.sin(elapsedTime * 0.8) * 15;
      gridHelper.rotation.z = Math.sin(elapsedTime * 0.2) * 0.08;
      
      // Fixed grid color with reduced blue
      if (gridHelper.material) {
        // Set a fixed color for the grid with less blue
        const color = new THREE.Color(0x444466);
        gridHelper.material.color = color;
      }
      
      // Enhanced particle animation with color changes and more dynamic movement
      const positions = particlesGeometry.attributes.position.array;
      const originalPositions = particlesGeometry.attributes.originalPosition.array;
      const sizes = particlesGeometry.attributes.size.array;
      const colors = particlesGeometry.attributes.color.array;
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const x = originalPositions[i3];
        const y = originalPositions[i3 + 1];
        const z = originalPositions[i3 + 2];

        // More dynamic wave motion with increased speed
        positions[i3] = x + Math.cos(elapsedTime * 0.8 + x * 0.01) * 30 * (Math.sin(elapsedTime * 0.3) * 0.3 + 1.0);
        positions[i3 + 1] = y + Math.sin(elapsedTime * 0.6 + y * 0.01) * 20 * (Math.cos(elapsedTime * 0.25) * 0.3 + 1.0);
        positions[i3 + 2] = z + Math.sin(elapsedTime * 1.0 + z * 0.01) * 30 * (Math.sin(elapsedTime * 0.4) * 0.3 + 1.0);
        
        // Fixed size without pulsing
         sizes[i] = 5;
        
        // Fixed colors without shifting
         colors[i3] = colorOptions[i % 3].r;
         colors[i3 + 1] = colorOptions[i % 3].g;
         colors[i3 + 2] = colorOptions[i % 3].b;
      }
      
      particlesGeometry.attributes.position.needsUpdate = true;
      particlesGeometry.attributes.size.needsUpdate = true;
      particlesGeometry.attributes.color.needsUpdate = true;
      
      // Animate dark particles with subtle wave motion
      const darkPositions = darkParticlesGeometry.attributes.position.array;
      const darkOriginalPositions = darkParticlesGeometry.attributes.originalPosition.array;
      
      for (let i = 0; i < darkParticleCount; i++) {
        const i3 = i * 3;
        const x = darkOriginalPositions[i3];
        const y = darkOriginalPositions[i3 + 1];
        const z = darkOriginalPositions[i3 + 2];

        // Subtle wave motion for dark particles
        darkPositions[i3] = x + Math.cos(elapsedTime * 0.4 + x * 0.005) * 15;
        darkPositions[i3 + 1] = y + Math.sin(elapsedTime * 0.3 + y * 0.005) * 10;
        darkPositions[i3 + 2] = z + Math.sin(elapsedTime * 0.5 + z * 0.005) * 15;
      }
      
      darkParticlesGeometry.attributes.position.needsUpdate = true;
      
      // Animate floating medical icons with enhanced motion
      iconGroup.children.forEach((icon, i) => {
        const originalPos = icon.userData.originalPosition;
        const offset = icon.userData.randomOffset;
        const speed = icon.userData.speed || 1.0;
        const amplitude = icon.userData.amplitude || 20;
        
        // Enhanced floating motion with varied speeds and amplitudes
        icon.position.x = originalPos.x + Math.cos(elapsedTime * 0.5 * speed + offset) * amplitude;
        icon.position.y = originalPos.y + Math.sin(elapsedTime * 0.7 * speed + offset) * amplitude;
        icon.position.z = originalPos.z + Math.cos(elapsedTime * 0.3 * speed + offset) * amplitude;
        
        // Dynamic rotation speeds based on position
        icon.rotation.x += 0.003 * speed;
        icon.rotation.y += 0.005 * speed;
        icon.rotation.z += 0.002 * speed;
        
        // Fixed scale without any randomness or pulsing
        const fixedScale = 0.5;
        icon.scale.set(fixedScale, fixedScale, fixedScale);
      });

      // Rotate sphere group with increased speed
      sphereGroup.rotation.y += 0.01;
      
      // Add wave-like motion to individual spheres (without pulsing)
       sphereGroup.children.forEach((sphere, i) => {
         // Store original position if not already stored
         if (!sphere.userData.originalY) {
           sphere.userData.originalY = sphere.position.y;
           sphere.userData.phaseOffset = i * 0.2;
         }
         
         // Wave motion along the helix with increased speed
         sphere.position.y = sphere.userData.originalY + 
                            Math.sin(elapsedTime * 3 + sphere.userData.phaseOffset) * 6;
         
         // Fixed scale without pulsing
         sphere.scale.set(0.8, 0.8, 0.8);
       });

      // Update controls and render
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Intersection observer for animations
  const { ref: heroRef, inView: heroInView } = useInView({ threshold: 0.4, triggerOnce: true });
  const { ref: aboutRef, inView: aboutInView } = useInView({ threshold: 0.4, triggerOnce: true });
  const { ref: featuresRef, inView: featuresInView } = useInView({ threshold: 0.2, triggerOnce: true });
  const { ref: contactRef, inView: contactInView } = useInView({ threshold: 0.3, triggerOnce: true });

  const getStaggeredAnimation = (inView, delay) => `
    transition-all duration-1000 ease-out transform
    ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}
    ${delay}
  `;

  return (
    <div className="flex flex-col min-h-screen relative w-full">
      {/* Background gradient */}
      {/* Enhanced background gradient with animation */}
      <div className="fixed inset-0 bg-gradient-to-b from-cyan-100 to-white animate-gradient" />

      {/* 3D Animation */}
      <div ref={mountRef} className="fixed inset-0 z-0" />

      {/* Responsive NavBar */}
      <nav className="fixed top-0 left-0 right-0 z-30 shadow-md bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <a href="#hero" className="text-xl font-extrabold flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 text-white">✚</span>
            MedicoCare
          </a>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center gap-6 font-medium">
            <li><a href="#hero" className="hover:text-teal-600 transition-colors">Home</a></li>
            <li><a href="#about" className="hover:text-teal-600 transition-colors">About</a></li>
            <li><a href="#features" className="hover:text-teal-600 transition-colors">Features</a></li>
            <li><a href="#contact" className="hover:text-teal-600 transition-colors">Contact</a></li>
            <li><a href="#cta" className="rounded-full bg-teal-600 px-4 py-2 text-white hover:bg-teal-700 transition-colors">SignIn/SignUp</a></li>
          </ul>

          {/* Mobile Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex items-center px-3 py-2 border rounded text-teal-600 border-teal-600"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${menuOpen ? 'max-h-60' : 'max-h-0'}`}>
          <ul className="px-48 pb-4 space-y-2 font-medium bg-white shadow-md">
            <li><a href="#hero" className="block py-2 hover:text-teal-600 transition-colors">Home</a></li>
            <li><a href="#about" className="block py-2 hover:text-teal-600 transition-colors">About</a></li>
            <li><a href="#features" className="block py-2 hover:text-teal-600 transition-colors">Features</a></li>
            <li><a href="#contact" className="block py-2 hover:text-teal-600 transition-colors">Contact</a></li>
            <li><a href="#cta" className="block rounded-full bg-teal-600 px-4 py-2 text-white hover:bg-teal-700 transition-colors">SignIn/SignUp</a></li>
          </ul>
        </div>
      </nav>

      {/* Main Content Sections */}
      <main className="relative z-10 flex-grow pt-20">
        <div className="mx-auto max-w-7xl px-4">
          {/* Hero Section */}
          <section id="hero" ref={heroRef} className={`min-h-screen flex items-center justify-center`}>
            <div className={`text-center glass rounded-3xl px-6 py-10 shadow-soft max-w-2xl mx-auto ${getStaggeredAnimation(heroInView, 'transition-delay-150')}`}>
              <h1 className="text-4xl md:text-6xl font-extrabold">Welcome to <span className="text-teal-600">MedicoCare</span></h1>
              <p className="mt-4 text-lg md:text-xl text-slate-700">Smart Healthcare Management</p>
              <div className="mt-6">
                <a id="ctaBtn" href="#about" className="inline-block rounded-2xl bg-teal-600 px-6 py-3 text-white font-semibold hover:bg-teal-700 active:scale-95 transition">Get Started</a>
              </div>
            </div>
          </section>

          {/* About Section */}
          <section id="about" ref={aboutRef} className={`py-16 mt-8`}>
            <div className="flex flex-col items-center justify-center max-w-3xl text-center glass rounded-3xl p-8 ring-1 ring-slate-200 shadow-lg mx-auto">
              <h2 className={`text-2xl md:text-3xl font-extrabold ${getStaggeredAnimation(aboutInView, 'transition-delay-150')}`}>About MedicoCare</h2>
              <p className={`mt-3 text-slate-600 ${getStaggeredAnimation(aboutInView, 'transition-delay-300')}`}>MedicoCare streamlines appointments, unifies patient data, and connects you with the right specialists. Built for speed, security, and a great patient experience.</p>
              <ul className={`mt-4 list-disc flex list-inside text-slate-700 ${getStaggeredAnimation(aboutInView, 'transition-delay-450')}`}>
                <li className={`rounded-2xl glass m-2 p-4 shadow-soft border border-slate-100 hover:scale-105 transition-transform duration-300`} >Book appointments in seconds</li>
                <li className={`rounded-2xl glass m-2 p-4 shadow-soft border border-slate-100 hover:scale-105 transition-transform duration-300`}>Manage records securely</li>
                <li className={`rounded-2xl glass m-2 p-4 shadow-soft border border-slate-100 hover:scale-105 transition-transform duration-300`}>Access care anywhere</li>
              </ul>
            </div>
          </section>

          {/* Features Section */}
          <section id="features" ref={featuresRef} className={`py-16 mt-8`}>
            <div className="glass rounded-3xl p-8 ring-1 ring-slate-200 shadow-lg">
              <h2 className={`text-2xl md:text-3xl font-extrabold ${getStaggeredAnimation(featuresInView, 'transition-delay-150')}`}>Why Choose Us</h2>
              <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className={`rounded-2xl glass p-6 shadow-soft border border-slate-100 hover:scale-105 transition-transform duration-300 ${getStaggeredAnimation(featuresInView, 'transition-delay-300')}`}>
                  <div className="text-3xl">⚡</div>
                  <h3 className="mt-3 font-bold text-lg">Fast</h3>
                  <p className="mt-1 text-slate-600">Optimized workflows and instant syncing for a snappy experience.</p>
                </div>
                <div className={`rounded-2xl glass p-6 shadow-soft border border-slate-100 hover:scale-105 transition-transform duration-300 ${getStaggeredAnimation(featuresInView, 'transition-delay-450')}`}>
                  <div className="text-3xl">🔒</div>
                  <h3 className="mt-3 font-bold text-lg">Secure</h3>
                  <p className="mt-1 text-slate-600">Best-in-class security to keep your data private and protected.</p>
                </div>
                <div className={`rounded-2xl glass p-6 shadow-soft border border-slate-100 hover:scale-105 transition-transform duration-300 ${getStaggeredAnimation(featuresInView, 'transition-delay-600')}`}>
                  <div className="text-3xl">📞</div>
                  <h3 className="mt-3 font-bold text-lg">24/7 Support</h3>
                  <p className="mt-1 text-slate-600">Get help anytime with our round-the-clock support team.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" ref={contactRef} className={`py-16 mt-8`}>
            <div className="glass rounded-3xl p-8 ring-1 ring-slate-200 shadow-lg mx-auto max-w-3xl">
              <div className="flex flex-col items-center justify-center">
                <h2 className={`text-2xl md:text-3xl font-extrabold ${getStaggeredAnimation(contactInView, 'transition-delay-150')}`}>Contact Us</h2>
                <p className={`mt-2 text-slate-600 ${getStaggeredAnimation(contactInView, 'transition-delay-300')}`}>We'd love to hear from you.</p>
                <form className="mt-8 w-full">
                  <div className={`grid md:grid-cols-2 gap-4 ${getStaggeredAnimation(contactInView, 'transition-delay-450')}`}>
                    <div>
                      <label className="block text-sm font-medium mb-1">Name</label>
                      <input className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors" placeholder="Your name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Email</label>
                      <input type="email" className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors" placeholder="you@example.com" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">Message</label>
                      <textarea rows="4" className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors" placeholder="Write your message..."></textarea>
                    </div>
                  </div>
                  <div className={`mt-4 justify-center items-center flex ${getStaggeredAnimation(contactInView, 'transition-delay-600')}`}>
                    <button type="button" className="rounded-2xl bg-teal-600 px-6 py-3 font-semibold text-white hover:bg-teal-700 active:scale-95 transition-transform">Submit</button>
                  </div>
                </form>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-teal-100 mt-20 w-full">
        <div className="mx-auto max-w-7xl px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-600">© 2025 MedicoCare. All rights reserved.</p>
          <div className="flex items-center gap-5 text-sm">
            <a href="#" className="hover:text-teal-600 transition-colors">Home</a>
            <a href="#about" className="hover:text-teal-600 transition-colors">About</a>
            <a href="#features" className="hover:text-teal-600 transition-colors">Features</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default MedicareLanding;