
window.addEventListener('load', () => {
  const loadScript = (src) => new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.crossOrigin = 'anonymous';
    s.referrerPolicy = 'no-referrer';
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });

  (async () => {
    // Load THREE.js and OrbitControls
    if (!window.THREE) {
      try { await loadScript('https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.min.js'); }
      catch (e) { console.error('Failed to load three.js', e); }
    }
    if (window.THREE && !window.THREE.OrbitControls) {
      try { await loadScript('https://cdn.jsdelivr.net/npm/three@0.161.0/examples/js/controls/OrbitControls.js'); }
      catch (e) { console.error('Failed to load OrbitControls', e); }
    }
    if (!window.THREE) {
      console.error('THREE is not available. Check your network/CDN.');
      return;
    }

    document.getElementById('year').textContent = new Date().getFullYear();
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------------- HERO SECTION ---------------- */
    const heroCanvas = document.getElementById('heroCanvas');
    const heroRenderer = new THREE.WebGLRenderer({ canvas: heroCanvas, antialias: true, alpha: true });
    heroRenderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    const heroScene = new THREE.Scene();
    const heroCamera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    heroCamera.position.z = 3.5;

    const heroSizer = new ResizeObserver(() => {
      const rect = heroCanvas.getBoundingClientRect();
      heroRenderer.setSize(rect.width, rect.height, false);
      heroCamera.aspect = rect.width / rect.height;
      heroCamera.updateProjectionMatrix();
    });
    heroSizer.observe(heroCanvas);

    // Sphere points
    const sphereGeo = new THREE.SphereGeometry(1.2, 64, 64);
    const pointsGeo = new THREE.BufferGeometry().setAttribute(
      'position',
      new THREE.Float32BufferAttribute(sphereGeo.attributes.position.array, 3)
    );
    const points = new THREE.Points(pointsGeo, new THREE.PointsMaterial({ color: 0x14b8a6, size: 0.02 }));
    heroScene.add(points);

    // Stars
    const starCount = 1200;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const r = 6 + Math.random() * 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starPositions[i*3] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
      starPositions[i*3+2] = r * Math.cos(phi);
    }
    const stars = new THREE.Points(
      new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(starPositions, 3)),
      new THREE.PointsMaterial({ color: 0x94a3b8, size: 0.01, transparent: true, opacity: 0.7 })
    );
    heroScene.add(stars);

    // Mouse & CTA
    const mouse = new THREE.Vector2(0, 0);
    document.getElementById('hero').addEventListener('mousemove', (e) => {
      const rect = heroCanvas.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    });
    let hoverBoost = 0;
    document.getElementById('ctaBtn').addEventListener('mouseenter', () => hoverBoost = 0.015);
    document.getElementById('ctaBtn').addEventListener('mouseleave', () => hoverBoost = 0);

    function heroAnimate() {
      if (!prefersReducedMotion) {
        points.rotation.y += 0.002 + hoverBoost;
        stars.rotation.y -= 0.0008;
        points.rotation.x = mouse.y * 0.1;
        heroCamera.position.x = mouse.x * 0.2;
        heroCamera.position.y = mouse.y * 0.2;
        heroCamera.lookAt(0, 0, 0);
      }
      heroRenderer.render(heroScene, heroCamera);
      requestAnimationFrame(heroAnimate);
    }
    requestAnimationFrame(heroAnimate);

    /* ---------------- ABOUT SECTION ---------------- */
    const aboutCanvas = document.getElementById('aboutCanvas');
    const aboutRenderer = new THREE.WebGLRenderer({ canvas: aboutCanvas, antialias: true, alpha: true });
    aboutRenderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    const aboutScene = new THREE.Scene();
    const aboutCamera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    aboutCamera.position.set(2.2, 1.6, 2.2);
    aboutScene.add(new THREE.DirectionalLight(0xffffff, 1).position.set(3, 5, 4));
    aboutScene.add(new THREE.AmbientLight(0xffffff, 0.5));

    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial({ color: 0x0ea5e9, roughness: 0.35, metalness: 0.2 })
    );
    aboutScene.add(cube);

    const wireSphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.6, 24, 24),
      new THREE.MeshBasicMaterial({ color: 0x22c55e, wireframe: true, transparent: true, opacity: 0.6 })
    );
    aboutScene.add(wireSphere);

    const controls = new THREE.OrbitControls(aboutCamera, aboutRenderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;

    const aboutSizer = new ResizeObserver(() => {
      const rect = aboutCanvas.getBoundingClientRect();
      aboutRenderer.setSize(rect.width, rect.height, false);
      aboutCamera.aspect = rect.width / rect.height;
      aboutCamera.updateProjectionMatrix();
    });
    aboutSizer.observe(aboutCanvas);

    let hover = false;
    aboutCanvas.addEventListener("mouseenter", () => hover = true);
    aboutCanvas.addEventListener("mouseleave", () => hover = false);
    aboutCanvas.addEventListener("click", () => {
      cube.material.color = new THREE.Color(`hsl(${Math.random() * 360}, 80%, 55%)`);
    });

    function aboutAnimate() {
      if (!prefersReducedMotion) {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.012;
        wireSphere.rotation.y -= 0.005;
        cube.scale.setScalar(hover ? 1.06 : 1.0);
      }
      controls.update();
      aboutRenderer.render(aboutScene, aboutCamera);
      requestAnimationFrame(aboutAnimate);
    }
    requestAnimationFrame(aboutAnimate);

    /* ---------------- FEATURES SECTION ---------------- */
    const featuresCanvas = document.getElementById('featuresCanvas');
    const featuresRenderer = new THREE.WebGLRenderer({ canvas: featuresCanvas, antialias: true, alpha: true });
    featuresRenderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    const featuresScene = new THREE.Scene();
    const featuresCamera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    featuresCamera.position.set(0, 0, 6);
    featuresScene.add(new THREE.DirectionalLight(0xffffff, 1).position.set(5, 5, 5));
    featuresScene.add(new THREE.AmbientLight(0xffffff, 0.4));

    const knotMaterial = new THREE.MeshStandardMaterial({ color: 0x0ea5e9, metalness: 0.3, roughness: 0.4 });
    const torus1 = new THREE.Mesh(new THREE.TorusKnotGeometry(0.8, 0.26, 150, 20), knotMaterial.clone());
    const torus2 = new THREE.Mesh(new THREE.TorusKnotGeometry(0.6, 0.2, 120, 18), knotMaterial.clone());
    torus2.material.color = new THREE.Color(0x22c55e);
    const torus3 = new THREE.Mesh(new THREE.TorusKnotGeometry(0.7, 0.22, 140, 22), knotMaterial.clone());
    torus3.material.color = new THREE.Color(0xf59e0b);

    torus1.position.set(-2.2, 0.6, -1);
    torus2.position.set(0.2, -0.2, 0);
    torus3.position.set(2.4, 0.8, -0.5);
    featuresScene.add(torus1, torus2, torus3);

    const featuresSizer = new ResizeObserver(() => {
      const rect = featuresCanvas.getBoundingClientRect();
      featuresRenderer.setSize(rect.width, rect.height, false);
      featuresCamera.aspect = rect.width / rect.height;
      featuresCamera.updateProjectionMatrix();
    });
    featuresSizer.observe(featuresCanvas);

    function featuresAnimate() {
      if (!prefersReducedMotion) {
        torus1.rotation.x += 0.005; torus1.rotation.y += 0.004;
        torus2.rotation.x -= 0.004; torus2.rotation.y += 0.006;
        torus3.rotation.x += 0.003; torus3.rotation.y -= 0.005;
      }
      featuresRenderer.render(featuresScene, featuresCamera);
      requestAnimationFrame(featuresAnimate);
    }
    requestAnimationFrame(featuresAnimate);

    /* ---------------- CONTACT SECTION ---------------- */
    const contactCanvas = document.getElementById('contactCanvas');
    const contactRenderer = new THREE.WebGLRenderer({ canvas: contactCanvas, antialias: true, alpha: true });
    contactRenderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    const contactScene = new THREE.Scene();
    const contactCamera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    contactCamera.position.z = 5;

    const contactSizer = new ResizeObserver(() => {
      const rect = contactCanvas.getBoundingClientRect();
      contactRenderer.setSize(rect.width, rect.height, false);
      contactCamera.aspect = rect.width / rect.height;
      contactCamera.updateProjectionMatrix();
    });
    contactSizer.observe(contactCanvas);

    const bubbleGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const bubbles = [];
    for (let i = 0; i < 180; i++) {
      const mat = new THREE.MeshPhongMaterial({
        color: new THREE.Color(`hsl(${180 + Math.random()*80},70%,85%)`),
        transparent: true, opacity: 0.85
      });
      const b = new THREE.Mesh(bubbleGeo, mat);
      b.position.set((Math.random()-0.5)*8, (Math.random()-0.5)*4, (Math.random()-0.5)*2);
      b.userData.vx = (Math.random()-0.5)*0.01;
      b.userData.vy = (Math.random()-0.5)*0.01;
      bubbles.push(b); contactScene.add(b);
    }
    contactScene.add(new THREE.AmbientLight(0xffffff, 0.8));

    const cMouse = new THREE.Vector2(0, 0);
    document.getElementById('contact').addEventListener('mousemove', (e) => {
      const rect = contactCanvas.getBoundingClientRect();
      cMouse.x = ((e.clientX - rect.left)/rect.width)*2 - 1;
      cMouse.y = -(((e.clientY - rect.top)/rect.height)*2 - 1);
    });

    function contactAnimate() {
      if (!prefersReducedMotion) {
        bubbles.forEach(b => {
          b.position.x += b.userData.vx; b.position.y += b.userData.vy;
          if (b.position.x > 4 || b.position.x < -4) b.userData.vx *= -1;
          if (b.position.y > 2 || b.position.y < -2) b.userData.vy *= -1;
          const dx = b.position.x - cMouse.x*2;
          const dy = b.position.y - cMouse.y*1;
          const dist2 = dx*dx + dy*dy;
          if (dist2 < 0.3) { b.userData.vx += dx*0.002; b.userData.vy += dy*0.002; }
        });
      }
      contactRenderer.render(contactScene, contactCamera);
      requestAnimationFrame(contactAnimate);
    }
    requestAnimationFrame(contactAnimate);

    /* ---------------- MICROINTERACTIONS ---------------- */
    // Reveal on scroll
    const revealEls = Array.from(document.querySelectorAll('.reveal'));
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach((el) => revealObserver.observe(el));

    // Magnetic button for CTA and any .magnetic
    const magneticStrength = 18;
    const magneticEls = Array.from(document.querySelectorAll('.magnetic'));
    function handleMagneticMove(event) {
      const target = event.currentTarget;
      const inner = target.querySelector('span');
      const rect = target.getBoundingClientRect();
      const relX = event.clientX - rect.left - rect.width / 2;
      const relY = event.clientY - rect.top - rect.height / 2;
      const dx = relX / magneticStrength;
      const dy = relY / magneticStrength;
      if (inner) inner.style.transform = `translate(${dx}px, ${dy}px)`;
    }
    function handleMagneticLeave(event) {
      const inner = event.currentTarget.querySelector('span');
      if (inner) inner.style.transform = 'translate(0px, 0px)';
    }
    magneticEls.forEach((el) => {
      el.addEventListener('mousemove', handleMagneticMove);
      el.addEventListener('mouseleave', handleMagneticLeave);
      el.addEventListener('touchend', handleMagneticLeave, { passive: true });
    });

    // Spotlight cursor over hero
    const spotlight = document.querySelector('#hero .spotlight-mask');
    const heroSection = document.getElementById('hero');
    if (spotlight && heroSection) {
      heroSection.addEventListener('mousemove', (e) => {
        const r = heroSection.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width) * 100;
        const y = ((e.clientY - r.top) / r.height) * 100;
        spotlight.style.setProperty('--mx', `${x}%`);
        spotlight.style.setProperty('--my', `${y}%`);
      });
      heroSection.addEventListener('mouseleave', () => {
        spotlight.style.setProperty('--mx', `50%`);
        spotlight.style.setProperty('--my', `50%`);
      });
    }

    // Marquee duplication to ensure seamless loop
    const marqueeTrack = document.getElementById('marqueeTrack');
    if (marqueeTrack) {
      const clone = marqueeTrack.cloneNode(true);
      marqueeTrack.parentElement.appendChild(clone);
    }
  })();
});
