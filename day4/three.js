
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

    /* ---------------- UX HELPERS (magnetic, reveal, tilt, cursor, blob) ---------------- */
    // Magnetic hover
    const makeMagnetic = (el, strength = 24) => {
      let rect;
      const onMove = (e) => {
        rect = rect || el.getBoundingClientRect();
        const mx = e.clientX - (rect.left + rect.width/2);
        const my = e.clientY - (rect.top + rect.height/2);
        el.style.transform = `translate(${mx/strength}px, ${my/strength}px)`;
      };
      const reset = () => { rect = null; el.style.transform = 'translate(0,0)'; };
      el.addEventListener('mousemove', onMove);
      el.addEventListener('mouseleave', reset);
    };
    document.querySelectorAll('.magnetic').forEach(el => makeMagnetic(el));

    // Scroll reveal
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('section h2, section p, .tilt-card, nav a, #ctaBtn').forEach(el => {
      el.classList.add('reveal');
      revealObserver.observe(el);
    });

    // Tilt cards with glare
    const clamp = (n, min, max) => Math.min(Math.max(n, min), max);
    const addTilt = (card) => {
      const maxTilt = 10;
      const update = (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        const rx = clamp((0.5 - py) * (maxTilt * 2), -maxTilt, maxTilt);
        const ry = clamp((px - 0.5) * (maxTilt * 2), -maxTilt, maxTilt);
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
        const glare = card.querySelector('.tilt-glare');
        if (glare) {
          glare.style.setProperty('--gx', `${px*100}%`);
          glare.style.setProperty('--gy', `${py*100}%`);
        }
      };
      const leave = () => { card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)'; };
      card.addEventListener('mousemove', update);
      card.addEventListener('mouseleave', leave);
    };
    document.querySelectorAll('.tilt-card').forEach(addTilt);

    // Custom cursor
    const cursorDot = document.getElementById('cursorDot');
    const cursorRing = document.getElementById('cursorRing');
    if (cursorDot && cursorRing) {
      let x = window.innerWidth/2, y = window.innerHeight/2;
      let rx = x, ry = y;
      const lerp = (a, b, t) => a + (b - a) * t;
      const move = (e) => { x = e.clientX; y = e.clientY; };
      window.addEventListener('mousemove', move, { passive: true });
      const animateCursor = () => {
        rx = lerp(rx, x, 0.24); ry = lerp(ry, y, 0.24);
        cursorDot.style.transform = `translate(${x}px, ${y}px)`;
        cursorRing.style.transform = `translate(${rx}px, ${ry}px)`;
        requestAnimationFrame(animateCursor);
      };
      animateCursor();
      const hoverables = 'a, button, .magnetic, .tilt-card';
      document.querySelectorAll(hoverables).forEach(el => {
        el.addEventListener('mouseenter', () => cursorRing.classList.add('is-hover'));
        el.addEventListener('mouseleave', () => cursorRing.classList.remove('is-hover'));
      });
    }

    // Hero animated gradient blob
    const heroBlob = document.getElementById('heroBlob');
    if (heroBlob) {
      heroBlob.style.background = 'conic-gradient(from 0deg at 50% 50%, rgba(20,184,166,.9), rgba(34,197,94,.8), rgba(14,165,233,.8), rgba(20,184,166,.9))';
      let angle = 0, t = 0;
      const tick = () => {
        angle += 0.15; t += 0.008;
        const px = 50 + Math.sin(t) * 25;
        const py = 50 + Math.cos(t*0.8) * 18;
        heroBlob.style.background = `conic-gradient(from ${angle}deg at ${px}% ${py}%, rgba(20,184,166,.9), rgba(34,197,94,.75), rgba(14,165,233,.75), rgba(245,158,11,.7), rgba(20,184,166,.9))`;
        requestAnimationFrame(tick);
      };
      tick();
      const hero = document.getElementById('hero');
      if (hero) {
        hero.addEventListener('mousemove', (e) => {
          const r = hero.getBoundingClientRect();
          const nx = (e.clientX - r.left) / r.width;
          const ny = (e.clientY - r.top) / r.height;
          heroBlob.style.transform = `translate(${(nx-0.5)*20}px, ${(ny-0.5)*20}px)`;
        });
      }
    }

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
  })();
});
