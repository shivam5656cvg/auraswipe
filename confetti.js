// Simple confetti implementation
function confetti(options = {}) {
  const defaults = {
    particleCount: 100,
    spread: 70,
    startVelocity: 30,
    decay: 0.9,
    gravity: 1,
    colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'],
    shapes: ['circle', 'square'],
    ticks: 200
  };

  const config = {...defaults, ...options};
  const particles = [];
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '999';
  document.body.appendChild(canvas);
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  // Create particles
  for (let i = 0; i < config.particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: canvas.height + Math.random() * 100,
      size: Math.random() * 10 + 5,
      color: config.colors[Math.floor(Math.random() * config.colors.length)],
      shape: config.shapes[Math.floor(Math.random() * config.shapes.length)],
      velocity: {
        x: (Math.random() - 0.5) * config.spread,
        y: -Math.random() * config.startVelocity
      },
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.2
    });
  }
  
  let tick = 0;
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(p => {
      p.x += p.velocity.x;
      p.y += p.velocity.y;
      p.velocity.y += config.gravity;
      p.velocity.x *= config.decay;
      p.velocity.y *= config.decay;
      p.rotation += p.rotationSpeed;
      
      ctx.fillStyle = p.color;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      
      if (p.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      }
      
      ctx.restore();
    });
    
    tick++;
    
    if (tick < config.ticks) {
      requestAnimationFrame(animate);
    } else {
      document.body.removeChild(canvas);
    }
  }
  
  animate();
}
