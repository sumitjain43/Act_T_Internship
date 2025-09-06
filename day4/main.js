import * as THREE from 'https://unpkg.com/three@0.127.0/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.127.0/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://unpkg.com/three@0.127.0/examples/jsm/controls/OrbitControls.js';

// --- CORE SETUP -----------------------------------------------
const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

// --- CAMERA ---------------------------------------------------
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(0, 1, 3); // Positioned slightly up and back
scene.add(camera);

// --- RENDERER -------------------------------------------------
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true, // Smoothens the edges
    alpha: true // Allows for a transparent background if needed
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputEncoding = THREE.sRGBEncoding; // For accurate colors

// --- LIGHTS ---------------------------------------------------
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(3, 3, 3);
scene.add(directionalLight);

// --- CONTROLS -------------------------------------------------
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true; // Makes the movement smoother

// --- MODEL LOADING --------------------------------------------
const gltfLoader = new GLTFLoader();
let heartModel = null;

gltfLoader.load(
    'heart_model/scene.gltf', // IMPORTANT: Path to your model
    (gltf) => {
        heartModel = gltf.scene;
        heartModel.scale.set(0.02, 0.02, 0.02); // Scale it down to a reasonable size
        scene.add(heartModel);
    }
);

// --- INTERACTIVITY (RAYCASTING) -------------------------------
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click', (event) => {
    // Update mouse coordinates
    mouse.x = (event.clientX / sizes.width) * 2 - 1;
    mouse.y = - (event.clientY / sizes.height) * 2 + 1;

    // Cast a ray from the camera through the mouse position
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    // If the heart is clicked
    if (intersects.length > 0 && heartModel) {
        // Traverse the model to find the mesh and change its material
        heartModel.traverse((child) => {
            if (child.isMesh) {
                // Change to a random color on click
                child.material.color.set(Math.random() * 0xffffff);
            }
        });
    }
});

// --- WINDOW RESIZE --------------------------------------------
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// --- ANIMATION LOOP -------------------------------------------
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Pulsing animation
    if (heartModel) {
        const pulse = Math.sin(elapsedTime * 3) * 0.05 + 1; // Simple sine wave for scale
        heartModel.scale.set(0.02 * pulse, 0.02 * pulse, 0.02 * pulse);
    }

    // Update controls
    controls.update();

    // Render the scene
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();