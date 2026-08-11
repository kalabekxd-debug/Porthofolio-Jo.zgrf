(() => {
  const root = document.documentElement;
  const body = document.body;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Loader
  window.addEventListener('load', () => {
    setTimeout(() => {
      const loader = document.querySelector('.loader');
      loader.style.transition = 'transform .75s cubic-bezier(.2,0,0,1)';
      loader.style.transform = 'translateY(-100%)';
      setTimeout(() => loader.remove(), 800);
    }, reduce ? 0 : 850);
  });

  // Scroll reveal with small, controlled staggering.
  const revealItems = document.querySelectorAll('.reveal, .image-reveal');
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  revealItems.forEach(el => observer.observe(el));

  // Pointer system: dot follows immediately, ring follows with a spring-like lag.
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  let mx = innerWidth / 2, my = innerHeight / 2;
  let rx = mx, ry = my;
  window.addEventListener('pointermove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
    root.style.setProperty('--mx', `${mx}px`);
    root.style.setProperty('--my', `${my}px`);
  }, { passive:true });

  const cursorLoop = () => {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(cursorLoop);
  };
  if (!reduce && matchMedia('(pointer:fine)').matches) cursorLoop();

  const interactive = document.querySelectorAll('a, [data-tilt], .project__media');
  interactive.forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('is-hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('is-hover'));
  });
  document.querySelectorAll('.project__media').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('is-image'));
    el.addEventListener('mouseleave', () => ring.classList.remove('is-image'));
  });
  window.addEventListener('pointerdown', () => ring.classList.add('is-press'));
  window.addEventListener('pointerup', () => ring.classList.remove('is-press'));

  // Magnetic controls.
  if (!reduce && matchMedia('(pointer:fine)').matches) {
    document.querySelectorAll('.magnetic').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - (r.left + r.width / 2)) * 0.16;
        const y = (e.clientY - (r.top + r.height / 2)) * 0.16;
        el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });
      el.addEventListener('pointerleave', () => {
        el.style.transform = '';
      });
    });
  }

  // Image tilt. Two properties only: rotate + translateZ, keeping the interaction restrained.
  if (!reduce && matchMedia('(pointer:fine)').matches) {
    document.querySelectorAll('[data-tilt]').forEach(card => {
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(900px) rotateX(${py * -4}deg) rotateY(${px * 5}deg)`;
      });
      card.addEventListener('pointerleave', () => {
        card.style.transform = '';
      });
    });
  }

  // Project cursor label follows pointer inside the image.
  document.querySelectorAll('.project__media').forEach(media => {
    const label = media.querySelector('.project__cursor-label');
    if (!label) return;
    media.addEventListener('pointermove', e => {
      const r = media.getBoundingClientRect();
      label.style.left = `${e.clientX - r.left - 45}px`;
      label.style.top = `${e.clientY - r.top - 45}px`;
    });
  });

  // Lightweight canvas grid / signal field.
  const canvas = document.getElementById('grid-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, dpr, t = 0;
  const resize = () => {
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  addEventListener('resize', resize);

  const draw = () => {
    ctx.clearRect(0,0,W,H);
    const step = 70;
    const px = parseFloat(getComputedStyle(root).getPropertyValue('--mx')) || W/2;
    const py = parseFloat(getComputedStyle(root).getPropertyValue('--my')) || H/2;
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += step) {
      const dx = Math.abs(x - px);
      const alpha = Math.max(0.015, 0.07 - dx / W * 0.06);
      ctx.strokeStyle = `rgba(226,23,36,${alpha})`;
      ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke();
    }
    for (let y = 0; y < H; y += step) {
      const dy = Math.abs(y - py);
      const alpha = Math.max(0.012, 0.055 - dy / H * 0.045);
      ctx.strokeStyle = `rgba(242,240,234,${alpha})`;
      ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke();
    }
    if (!reduce) {
      const pulse = (Math.sin(t * .018) + 1) / 2;
      ctx.strokeStyle = `rgba(226,23,36,${0.08 + pulse*.07})`;
      ctx.beginPath();
      ctx.arc(px, py, 70 + pulse*35, 0, Math.PI*2);
      ctx.stroke();
      t++;
    }
    requestAnimationFrame(draw);
  };
  draw();

  // Small scroll parallax on the hero title.
  if (!reduce) {
    const heroTitle = document.querySelector('.hero__title');
    addEventListener('scroll', () => {
      const y = Math.min(scrollY, innerHeight);
      heroTitle.style.transform = `translate3d(0, ${y * -0.055}px, 0)`;
    }, { passive:true });
  }
})();
