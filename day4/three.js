
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
      requestAnimationFrame(heroAnimate);
      points.rotation.y += 0.002 + hoverBoost;
      stars.rotation.y -= 0.0008;
      points.rotation.x = mouse.y * 0.1;
      heroCamera.position.x = mouse.x * 0.2;
      heroCamera.position.y = mouse.y * 0.2;
      heroCamera.lookAt(0, 0, 0);
      heroRenderer.render(heroScene, heroCamera);
    }
    heroAnimate();

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
      requestAnimationFrame(aboutAnimate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.012;
      wireSphere.rotation.y -= 0.005;
      cube.scale.setScalar(hover ? 1.06 : 1.0);
      controls.update();
      aboutRenderer.render(aboutScene, aboutCamera);
    }
    aboutAnimate();

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
      requestAnimationFrame(featuresAnimate);
      torus1.rotation.x += 0.005; torus1.rotation.y += 0.004;
      torus2.rotation.x -= 0.004; torus2.rotation.y += 0.006;
      torus3.rotation.x += 0.003; torus3.rotation.y -= 0.005;
      featuresRenderer.render(featuresScene, featuresCamera);
    }
    featuresAnimate();

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
      requestAnimationFrame(contactAnimate);
      bubbles.forEach(b => {
        b.position.x += b.userData.vx; b.position.y += b.userData.vy;
        if (b.position.x > 4 || b.position.x < -4) b.userData.vx *= -1;
        if (b.position.y > 2 || b.position.y < -2) b.userData.vy *= -1;
        const dx = b.position.x - cMouse.x*2;
        const dy = b.position.y - cMouse.y*1;
        const dist2 = dx*dx + dy*dy;
        if (dist2 < 0.3) { b.userData.vx += dx*0.002; b.userData.vy += dy*0.002; }
      });
      contactRenderer.render(contactScene, contactCamera);
    }
    contactAnimate();

    /* ---------------- IGLOO-STYLE UI EFFECTS ---------------- */
    // Cursor blob that follows pointer and grows over interactive elements
    (function setupCursorBlob() {
      const blob = document.getElementById('cursorBlob');
      if (!blob) return;
      let currentX = -9999;
      let currentY = -9999;
      let targetX = currentX;
      let targetY = currentY;
      let rafId = 0;
      const followSpeed = 0.18;

      function animate() {
        currentX += (targetX - currentX) * followSpeed;
        currentY += (targetY - currentY) * followSpeed;
        const offsetX = currentX - blob.offsetWidth / 2;
        const offsetY = currentY - blob.offsetHeight / 2;
        blob.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        rafId = requestAnimationFrame(animate);
      }

      window.addEventListener('pointermove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
        if (!rafId) rafId = requestAnimationFrame(animate);
      });
      window.addEventListener('pointerenter', () => {
        blob.style.opacity = '1';
      });
      window.addEventListener('pointerleave', () => {
        blob.style.transform = 'translate(-9999px, -9999px)';
        cancelAnimationFrame(rafId);
        rafId = 0;
      });

      const growTargets = document.querySelectorAll('a, button, .magnetic, input, textarea, label');
      growTargets.forEach((el) => {
        el.addEventListener('mouseenter', () => blob.classList.add('grow'));
        el.addEventListener('mouseleave', () => blob.classList.remove('grow'));
      });
    })();

    // Magnetic hover for small UI elements
    (function setupMagnetic() {
      const magnets = document.querySelectorAll('.magnetic');
      magnets.forEach((el) => {
        const strength = 0.25; // px shift per px distance from center
        function onMove(e) {
          const rect = el.getBoundingClientRect();
          const dx = e.clientX - (rect.left + rect.width / 2);
          const dy = e.clientY - (rect.top + rect.height / 2);
          el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
        }
        function onLeave() {
          el.style.transform = 'translate(0, 0)';
        }
        el.addEventListener('mousemove', onMove);
        el.addEventListener('mouseleave', onLeave);
      });
    })();

    // Tilt cards for feature items
    (function setupTilt() {
      const tilts = document.querySelectorAll('.tilt');
      tilts.forEach((card) => {
        const maxRotation = 8; // degrees
        function onMove(e) {
          const rect = card.getBoundingClientRect();
          const px = (e.clientX - rect.left) / rect.width; // 0..1
          const py = (e.clientY - rect.top) / rect.height; // 0..1
          const rotateX = (py - 0.5) * -2 * maxRotation;
          const rotateY = (px - 0.5) * 2 * maxRotation;
          card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        }
        function onLeave() {
          card.style.transform = 'rotateX(0deg) rotateY(0deg)';
        }
        card.addEventListener('mousemove', onMove);
        card.addEventListener('mouseleave', onLeave);
      });
    })();

    // Scroll reveal for elements with .reveal
    (function setupReveal() {
      const revealEls = document.querySelectorAll('.reveal');
      if (!revealEls.length) return;
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.18, rootMargin: '0px 0px -40px 0px' });
      revealEls.forEach((el) => io.observe(el));
    })();

    // Subtle parallax on background canvases
    (function setupParallax() {
      const items = [
        { el: document.getElementById('heroCanvas'), factor: 0.05 },
        { el: document.getElementById('featuresCanvas'), factor: 0.12 },
        { el: document.getElementById('contactCanvas'), factor: 0.10 },
      ];
      function update() {
        const vh = window.innerHeight;
        items.forEach((it) => {
          if (!it.el) return;
          const rect = it.el.getBoundingClientRect();
          const center = rect.top + rect.height / 2;
          const delta = center - vh / 2;
          const translateY = -delta * it.factor;
          it.el.style.transform = `translateY(${translateY}px)`;
        });
        ticking = false;
      }
      let ticking = false;
      window.addEventListener('scroll', () => {
        if (!ticking) {
          requestAnimationFrame(update);
          ticking = true;
        }
      }, { passive: true });
      window.addEventListener('resize', update);
      update();
    })();

    // Make hero gradient react to pointer
    (function setupHeroGradientFollow() {
      const hero = document.getElementById('hero');
      if (!hero) return;
      hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        hero.style.setProperty('--gx', `${x}%`);
        hero.style.setProperty('--gy', `${y}%`);
      });
    })();
  })();
});
