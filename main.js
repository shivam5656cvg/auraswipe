// Three.js 3D Background
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ 
  canvas: document.getElementById('3d-bg'),
  antialias: true,
  alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Floating 3D Shapes
const geometry = new THREE.IcosahedronGeometry(1, 0);
const material = new THREE.MeshBasicMaterial({ 
  color: 0x00ff87,
  wireframe: true,
  transparent: true,
  opacity: 0.7
});

const shapes = [];
const shapeCount = 15;

for (let i = 0; i < shapeCount; i++) {
  const shape = new THREE.Mesh(geometry, material);
  shape.position.set(
    Math.random() * 40 - 20,
    Math.random() * 40 - 20,
    Math.random() * -40
  );
  shape.scale.setScalar(Math.random() * 2 + 0.5);
  shapes.push(shape);
  scene.add(shape);
}

camera.position.z = 5;

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  
  shapes.forEach(shape => {
    shape.rotation.x += 0.005;
    shape.rotation.y += 0.005;
    
    // Gentle floating movement
    shape.position.y += Math.sin(Date.now() * 0.001 + shape.position.x) * 0.01;
    shape.position.x += Math.cos(Date.now() * 0.001 + shape.position.y) * 0.01;
  });
  
  renderer.render(scene, camera);
}
animate();

// Handle Window Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Custom Cursor
const cursor = document.querySelector('.cursor');
document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});

document.querySelectorAll('button, a, .swiper-slide').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('active');
  });
  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('active');
  });
});

// GSAP Animations
gsap.registerEffect({
  name: "fadeIn",
  effect: (targets, config) => {
    return gsap.from(targets, {
      opacity: 0,
      y: 50,
      duration: config.duration,
      stagger: config.stagger
    });
  },
  defaults: { duration: 1, stagger: 0.2 }
});

gsap.effects.fadeIn(".hero h1");
gsap.effects.fadeIn(".neon-button", { delay: 0.5 });

// Swiper.js Initialization
const swiper = new Swiper('.swiper-container', {
  effect: 'cards',
  grabCursor: true,
  centeredSlides: true,
  slidesPerView: 'auto',
  cardsEffect: {
    rotate: false,
    perSlideOffset: 15,
    perSlideRotate: 5
  },
  on: {
    slideChange: function() {
      // Haptic feedback on mobile
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
    }
  }
});

// Load Influencer Data
async function loadInfluencers() {
  try {
    const response = await fetch('assets/influencers.json');
    const data = await response.json();
    const container = document.getElementById('influencer-cards');
    
    data.forEach(influencer => {
      const card = document.createElement('div');
      card.className = 'swiper-slide';
      card.innerHTML = `
        <h3>${influencer.name}</h3>
        <p class="followers">${influencer.followers} 🚀</p>
        <p class="engagement">Engagement: ${influencer.engagement}% ⚡</p>
        <p class="niche">${influencer.niche}</p>
      `;
      container.appendChild(card);
    });
    
    swiper.update();
  } catch (error) {
    console.error('Error loading influencer data:', error);
  }
}

loadInfluencers();

// Manual Swipe Controls
document.querySelector('.swipe-left').addEventListener('click', () => {
  swiper.slidePrev();
  if ('vibrate' in navigator) navigator.vibrate(50);
});

document.querySelector('.swipe-right').addEventListener('click', () => {
  swiper.slideNext();
  if ('vibrate' in navigator) navigator.vibrate(50);
});

// Animated Counters
document.querySelectorAll('.stat').forEach(stat => {
  const target = +stat.getAttribute('data-count');
  const suffix = stat.textContent.includes('%') ? '%' : '';
  const duration = 3;
  
  gsap.to(stat, {
    innerText: target,
    duration: duration,
    snap: { innerText: 1 },
    ease: "power3.out",
    onUpdate: function() {
      stat.textContent = Math.floor(this.targets()[0].innerText) + suffix;
    },
    scrollTrigger: {
      trigger: stat,
      start: "top 80%",
      toggleActions: "play none none none"
    }
  });
});

// Confetti Button
document.getElementById('cta-btn').addEventListener('click', () => {
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 }
  });
});

// Scroll Trigger for Sections
gsap.utils.toArray('section').forEach(section => {
  gsap.from(section, {
    opacity: 0,
    y: 50,
    duration: 1,
    scrollTrigger: {
      trigger: section,
      start: "top 75%",
      toggleActions: "play none none none"
    }
  });
});
