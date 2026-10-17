// ---------- Responsive navigation menu ----------
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');

menuBtn.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close the menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

// ---------- Dark mode ----------
const themeToggle = document.getElementById('themeToggle');

// Load the saved theme (if any)
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark');
  themeToggle.textContent = '☀️';
}

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');

  if (document.body.classList.contains('dark')) {
    localStorage.setItem('theme', 'dark');
    themeToggle.textContent = '☀️';
  } else {
    localStorage.setItem('theme', 'light');
    themeToggle.textContent = '🌙';
  }
});

// ---------- Typing animation ----------
const typingEl = document.getElementById('typing');
const phrases = [
  'Explore the Universe...',
  'Touch the Stars...',
  'Capture the Night...'
];

let phraseIndex = 0;
let charIndex = 0;
let deleting = false;

function typeEffect() {
  if (!typingEl) return;

  const current = phrases[phraseIndex];

  if (!deleting) {
    charIndex++;
    typingEl.textContent = current.substring(0, charIndex);

    if (charIndex === current.length) {
      deleting = true;
      setTimeout(typeEffect, 1500);
      return;
    }
  } else {
    charIndex--;
    typingEl.textContent = current.substring(0, charIndex);

    if (charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  }

  setTimeout(typeEffect, deleting ? 50 : 100);
}

typeEffect();

// ---------- Animated counters ----------
const counters = document.querySelectorAll('.counter');

function runCounter(counter) {
  const target = +counter.dataset.target;
  const duration = 2000; // 2 seconds
  const stepTime = 20;
  const steps = duration / stepTime;
  const increment = target / steps;
  let current = 0;

  const timer = setInterval(() => {
    current += increment;

    if (current >= target) {
      counter.textContent = target.toLocaleString() + '+';
      clearInterval(timer);
    } else {
      counter.textContent = Math.floor(current).toLocaleString();
    }
  }, stepTime);
}

// Start counting only when the section scrolls into view
const counterObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      runCounter(entry.target);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

counters.forEach(counter => counterObserver.observe(counter));

// ---------- Image slider ----------
const slidesEl = document.getElementById('slides');
const dotsEl = document.getElementById('dots');

if (slidesEl) {
  const slideCount = slidesEl.children.length;
  let currentSlide = 0;
  let autoPlay;

  // Create one dot per slide
  for (let i = 0; i < slideCount; i++) {
    const dot = document.createElement('span');
    dot.classList.add('dot');
    dot.addEventListener('click', () => {
      goToSlide(i);
      restartAutoPlay();
    });
    dotsEl.appendChild(dot);
  }

  function goToSlide(index) {
    currentSlide = (index + slideCount) % slideCount;
    slidesEl.style.transform = `translateX(-${currentSlide * 100}%)`;

    document.querySelectorAll('.dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  function restartAutoPlay() {
    clearInterval(autoPlay);
    autoPlay = setInterval(() => goToSlide(currentSlide + 1), 4000);
  }

  document.getElementById('nextBtn').addEventListener('click', () => {
    goToSlide(currentSlide + 1);
    restartAutoPlay();
  });

  document.getElementById('prevBtn').addEventListener('click', () => {
    goToSlide(currentSlide - 1);
    restartAutoPlay();
  });

  goToSlide(0);
  restartAutoPlay();
}

// ---------- Scroll-to-top button ----------
const scrollTopBtn = document.getElementById('scrollTopBtn');

window.addEventListener('scroll', () => {
  scrollTopBtn.classList.toggle('show', window.scrollY > 300);
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ---------- FAQ accordion ----------
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const question = item.querySelector('.faq-question');
  const answer = item.querySelector('.faq-answer');

  question.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');

    // Close all other items first
    faqItems.forEach(other => {
      other.classList.remove('open');
      other.querySelector('.faq-answer').style.maxHeight = null;
    });

    // Open the clicked item (unless it was already open)
    if (!isOpen) {
      item.classList.add('open');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
});

// ---------- Form validation ----------
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const serviceInput = document.getElementById('service');
  const messageInput = document.getElementById('message');
  const successMsg = document.getElementById('successMsg');

  function setError(input, message) {
    const group = input.parentElement;
    group.classList.add('invalid');
    group.classList.remove('valid');
    group.querySelector('.error').textContent = message;
  }

  function setValid(input) {
    const group = input.parentElement;
    group.classList.remove('invalid');
    group.classList.add('valid');
    group.querySelector('.error').textContent = '';
  }

  function validateName() {
    const value = nameInput.value.trim();
    if (value === '') {
      setError(nameInput, 'Please enter your name.');
      return false;
    }
    if (value.length < 3) {
      setError(nameInput, 'Name must be at least 3 characters.');
      return false;
    }
    setValid(nameInput);
    return true;
  }

  function validateEmail() {
    const value = emailInput.value.trim();
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value === '') {
      setError(emailInput, 'Please enter your email.');
      return false;
    }
    if (!pattern.test(value)) {
      setError(emailInput, 'Please enter a valid email address.');
      return false;
    }
    setValid(emailInput);
    return true;
  }

  function validateService() {
    if (serviceInput.value === '') {
      setError(serviceInput, 'Please choose a service.');
      return false;
    }
    setValid(serviceInput);
    return true;
  }

  function validateMessage() {
    const value = messageInput.value.trim();
    if (value === '') {
      setError(messageInput, 'Please write a message.');
      return false;
    }
    if (value.length < 10) {
      setError(messageInput, 'Message must be at least 10 characters.');
      return false;
    }
    setValid(messageInput);
    return true;
  }

  // Check each field as the user types or leaves it
  nameInput.addEventListener('input', validateName);
  emailInput.addEventListener('input', validateEmail);
  serviceInput.addEventListener('change', validateService);
  messageInput.addEventListener('input', validateMessage);

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    successMsg.textContent = '';

    const allValid = [
      validateName(),
      validateEmail(),
      validateService(),
      validateMessage()
    ].every(Boolean);

    if (allValid) {
      successMsg.textContent = '✅ Thank you! Your message has been sent.';
      contactForm.reset();
      contactForm.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('valid', 'invalid');
      });
    }
  });
}

// ---------- Animated starfield background ----------
// Stars are WHITE over blue areas and BLUE over white areas.
(function () {
  // Back canvas = behind the page, front canvas = on top of the blue sections
  const back = document.createElement('canvas');
  back.id = 'starfield';
  const front = document.createElement('canvas');
  front.id = 'starfieldTop';
  document.body.prepend(back);
  document.body.appendChild(front);

  const bctx = back.getContext('2d');
  const fctx = front.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let stars = [];
  let shooting = null;
  let blueAreas = [];
  let w, h;

  function resize() {
    w = back.width = front.width = window.innerWidth;
    h = back.height = front.height = window.innerHeight;

    const count = Math.floor((w * h) / 6000);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.4 + 0.5,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.02 + 0.005,
      drift: Math.random() * 0.15 + 0.02
    }));
  }

  // The areas of the page that have a blue background
  function updateAreas() {
    blueAreas = Array.from(document.querySelectorAll('.hero, .page-header, .footer'))
      .map(el => el.getBoundingClientRect());
  }

  function inBlue(x, y) {
    return blueAreas.some(r => x >= r.left && x <= r.right && y >= r.top && y <= r.bottom);
  }

  function drawShooting(ctx, rgb) {
    const tailX = shooting.x - shooting.vx * 8;
    const tailY = shooting.y - shooting.vy * 8;
    const grad = ctx.createLinearGradient(shooting.x, shooting.y, tailX, tailY);
    grad.addColorStop(0, `rgba(${rgb}, 0.9)`);
    grad.addColorStop(1, `rgba(${rgb}, 0)`);

    ctx.strokeStyle = grad;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(shooting.x, shooting.y);
    ctx.lineTo(tailX, tailY);
    ctx.stroke();
  }

  function draw() {
    bctx.clearRect(0, 0, w, h);
    fctx.clearRect(0, 0, w, h);
    updateAreas();

    const isDark = document.body.classList.contains('dark');
    const WHITE = '255, 255, 255';
    const BLUE = '37, 99, 235';
    // On the plain page background: white in dark mode, blue in light mode
    const pageColor = isDark ? WHITE : BLUE;
    const pageSize = isDark ? 1 : 1.5;
    const pageMin = isDark ? 0.35 : 0.4;

    stars.forEach(s => {
      s.phase += s.speed;
      const twinkle = Math.abs(Math.sin(s.phase));

      if (!reduceMotion) {
        s.y -= s.drift;
        if (s.y < 0) {
          s.y = h;
          s.x = Math.random() * w;
        }
      }

      if (inBlue(s.x, s.y)) {
        // Over a blue section: white star
        const alpha = 0.35 + 0.65 * twinkle;
        fctx.beginPath();
        fctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        fctx.fillStyle = `rgba(${WHITE}, ${alpha})`;
        fctx.fill();
      } else {
        // Over the page background
        const alpha = pageMin + (1 - pageMin) * twinkle;
        bctx.beginPath();
        bctx.arc(s.x, s.y, s.r * pageSize, 0, Math.PI * 2);
        bctx.fillStyle = `rgba(${pageColor}, ${alpha})`;
        bctx.fill();
      }
    });

    if (shooting) {
      if (inBlue(shooting.x, shooting.y)) {
        drawShooting(fctx, WHITE);
      } else {
        drawShooting(bctx, pageColor);
      }

      shooting.x += shooting.vx;
      shooting.y += shooting.vy;

      if (shooting.x > w + 100 || shooting.y > h + 100) {
        shooting = null;
      }
    }

    if (!reduceMotion) {
      requestAnimationFrame(draw);
    }
  }

  // A shooting star every 5 seconds
  if (!reduceMotion) {
    setInterval(() => {
      if (!shooting) {
        shooting = {
          x: Math.random() * w * 0.7,
          y: Math.random() * h * 0.4,
          vx: 9,
          vy: 4
        };
      }
    }, 5000);
  } else {
    // With reduced motion, just redraw when needed
    window.addEventListener('scroll', draw);
    themeToggle.addEventListener('click', draw);
  }

  window.addEventListener('resize', () => {
    resize();
    if (reduceMotion) draw();
  });
  resize();
  draw();
})();