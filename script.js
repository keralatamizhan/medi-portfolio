/* ════════════════════════════════════════════════════════════
   FOOD SCIENCE & NUTRITION PORTFOLIO — script.js
   ════════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════
   1. NAVBAR — scroll shadow + active link + hamburger
   ══════════════════════════════════════════ */
const navbar    = document.getElementById('navbar');
const navLinks  = document.querySelectorAll('.nav-links a');
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('nav-links');
const sections  = document.querySelectorAll('section[id]');

// Scroll shadow
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
  updateActiveLink();
});

// Highlight active nav link based on scroll position
function updateActiveLink() {
  const scrollPos = window.scrollY + 100;

  let currentSectionId = "";

  sections.forEach(section => {
    const top    = section.offsetTop;
    const bottom = top + section.offsetHeight;

    if (scrollPos >= top && scrollPos < bottom) {
      currentSectionId = section.getAttribute('id');
    }
  });

  // REMOVE all active first
  navLinks.forEach(link => link.classList.remove('active'));

  // ADD only current one
  const activeLink = document.querySelector(`.nav-links a[href="#${currentSectionId}"]`);
  if (activeLink) {
    activeLink.classList.add('active');
  }
}
// Hamburger toggle
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navMenu.classList.toggle('open');
});

// Close menu when a link is clicked (mobile)
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
  });
});


/* ══════════════════════════════════════════
   2. SCROLL REVEAL (IntersectionObserver)
   ══════════════════════════════════════════ */
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      // Stagger children in the same parent
      const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, idx * 100);
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));


/* ══════════════════════════════════════════
   3. DOWNLOAD RESUME
   ══════════════════════════════════════════ */
const downloadBtn = document.getElementById('downloadBtn');

downloadBtn.addEventListener('click', () => {

  const link   = document.createElement('a');
  link.href    = 'my resume.pdf';          // place resume.pdf next to index.html
  link.download = 'my resume.pdf';
  link.click();
  const blob     = new Blob([resumeText], { type: 'text/plain' });
  const url      = URL.createObjectURL(blob);
  const anchor   = document.createElement('a');
  anchor.href     = url;
  anchor.download = 'Resume_FoodScience_Nutrition.txt';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);

  showToast('✓ Resume downloaded successfully!');
});


/* ══════════════════════════════════════════
   4. CONTACT FORM SUBMIT
   ══════════════════════════════════════════ */
const contactForm = document.getElementById('contactForm');
const submitBtn   = document.getElementById('submitBtn');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name    = document.getElementById('fname').value.trim();
  const email   = document.getElementById('femail').value.trim();
  const subject = document.getElementById('fsubject').value.trim();
  const message = document.getElementById('fmsg').value.trim();

  // Simple validation
  if (!name || !email || !subject || !message) {
    showToast('⚠ Please fill in all fields.', true);
    return;
  }

  if (!isValidEmail(email)) {
    showToast('⚠ Please enter a valid email address.', true);
    return;
  }

  // Send via EmailJS
  submitBtn.textContent = 'Sending…';
  submitBtn.disabled = true;

  // IMPORTANT: Replace these with your actual EmailJS credentials
  const serviceID = "service_vjjigse";
  const templateID = "template_3ry1ml4";
  const publicKey = "pJ95BmOBzMOBIR3h2";

  // The template parameters must match the variables in your EmailJS template
  const templateParams = {
    from_name: name,
    from_email: email,
    subject: subject,
    message: message
  };

  emailjs.send(serviceID, templateID, templateParams, {
    publicKey: publicKey,
  })
  .then((response) => {
    console.log('SUCCESS!', response.status, response.text);
    contactForm.reset();
    submitBtn.innerHTML = `
      Send Message
      <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="22" y1="2" x2="11" y2="13"/>
        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
      </svg>`;
    submitBtn.disabled = false;
    showToast('✓ Message sent successfully!');
  })
  .catch((error) => {
    console.error('FAILED...', error);
    submitBtn.innerHTML = `
      Send Message
      <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="22" y1="2" x2="11" y2="13"/>
        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
      </svg>`;
    submitBtn.disabled = false;
    showToast('⚠ Error sending message. Please check EmailJS config.', true);
  });
});

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


/* ══════════════════════════════════════════
   5. TOAST NOTIFICATION
   ══════════════════════════════════════════ */
const toast    = document.getElementById('toast');
const toastMsg = document.getElementById('toast-msg');
let toastTimer;

function showToast(message, isWarning = false) {
  toastMsg.textContent = message;
  toast.style.background = isWarning ? '#d97706' : '#0d7377';
  toast.classList.add('show');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}


/* ══════════════════════════════════════════
   6. SMOOTH SCROLL for internal anchors
   ══════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = navbar.offsetHeight + 12;
      window.scrollTo({
        top: target.offsetTop - offset,
        behavior: 'smooth'
      });
    }
  });
});


/* ══════════════════════════════════════════
   7. SKILL TAG hover ripple effect
   ══════════════════════════════════════════ */
document.querySelectorAll('.sk-tags span').forEach(tag => {
  tag.addEventListener('mouseenter', () => {
    tag.style.transform = 'scale(1.05)';
  });
  tag.addEventListener('mouseleave', () => {
    tag.style.transform = 'scale(1)';
  });
});


/* ══════════════════════════════════════════
   8. TYPING EFFECT in hero subtitle
   ══════════════════════════════════════════ */
const roles = [
  'Food Science Researcher',
  'Clinical Nutrition Enthusiast',
  'Functional Food Developer',
  'Nutraceutical Explorer'
];

let roleIndex  = 0;
let charIndex  = 0;
let isDeleting = false;
const typingSpeed   = 65;
const deletingSpeed = 40;
const pauseTime     = 2000;

// Create a span inside hero-tag for the typed role
const heroTag = document.querySelector('.hero-tag');
if (heroTag) {
  const typedEl = document.createElement('span');
  typedEl.id = 'typed-role';
  typedEl.style.cssText = 'font-family:"DM Mono",monospace; font-size:0.68rem; color:var(--teal-dark);';

  // Replace text node
  heroTag.innerHTML = '';
  const dot = document.createElement('span');
  dot.className = 'tag-dot';
  heroTag.appendChild(dot);
  heroTag.appendChild(document.createTextNode(' '));
  heroTag.appendChild(typedEl);

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typedEl.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typedEl.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      setTimeout(() => { isDeleting = true; type(); }, pauseTime);
      return;
    }

    if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex  = (roleIndex + 1) % roles.length;
    }

    setTimeout(type, isDeleting ? deletingSpeed : typingSpeed);
  }

  // Start after a short delay
  setTimeout(type, 1200);
}


/* ══════════════════════════════════════════
   9. STATS COUNTER ANIMATION
   ══════════════════════════════════════════ */
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const statsRow = document.querySelector('.hero-stats');
if (statsRow) statsObserver.observe(statsRow);

function animateCounters() {
  document.querySelectorAll('.hstat strong').forEach(counter => {
    const target   = parseFloat(counter.textContent.replace(/[^0-9.]/g, ''));
    const suffix   = counter.textContent.replace(/[0-9.]/g, '');
    const duration = 1200;
    const step     = 16;
    const total    = Math.ceil(duration / step);
    let   current  = 0;
    let   frame    = 0;

    const timer = setInterval(() => {
      frame++;
      current = Math.round(easeOut(frame, 0, target, total));
      counter.textContent = current + suffix;
      if (frame >= total) {
        counter.textContent = target + suffix;
        clearInterval(timer);
      }
    }, step);
  });
}

function easeOut(t, b, c, d) {
  t /= d;
  return -c * t * (t - 2) + b;
}


/* ══════════════════════════════════════════
   10. INIT on load
   ══════════════════════════════════════════ */
window.addEventListener('DOMContentLoaded', () => {
  updateActiveLink();
});
