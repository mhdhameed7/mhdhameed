/* =====================================================
   Mohammed Hameed - Portfolio Scripts (Vanilla JS)
   - Navbar scroll, mobile menu, smooth anchor
   - Reveal on scroll, active nav, typing, form, year
   ===================================================== */
(function () {
  'use strict';

  /* ---------- 0. Preloader ---------- */
  const preloader = document.getElementById('preloader');
  const progressBar = document.getElementById('preloader-progress');
  
  if (preloader && progressBar) {
    let progress = 0;
    const duration = 2000; // minimum loading time 2s
    const intervalTime = 30;
    const increment = 100 / (duration / intervalTime);
    
    let isLoaded = false;
    window.addEventListener('load', () => { isLoaded = true; });

    const progressInterval = setInterval(() => {
      progress += increment;
      
      // hold at 90% if window isn't fully loaded
      if (!isLoaded && progress > 90) {
        progress = 90;
      }
      
      progressBar.style.width = `${progress}%`;
      
      if (progress >= 100) {
        clearInterval(progressInterval);
        setTimeout(() => {
          preloader.classList.add('hidden');
          setTimeout(() => preloader.remove(), 500);
        }, 400); // small delay after 100%
      }
    }, intervalTime);
  }

  /* ---------- 1. Navbar scroll effect ---------- */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 24);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 2. Mobile menu ---------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  function closeMenu() {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open menu');
  }
  function toggleMenu() {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  }
  hamburger.addEventListener('click', toggleMenu);

  // Close on link click + Escape for keyboard users
  navLinks.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  /* ---------- 3. Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el) => revealObs.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('visible'));
  }

  /* ---------- 4. Active nav link on scroll ---------- */
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-link');
  if ('IntersectionObserver' in window) {
    const navObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            links.forEach((l) =>
              l.classList.toggle('active', l.getAttribute('href') === '#' + id)
            );
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    sections.forEach((s) => navObs.observe(s));
  }

  /* ---------- 5. Typing animation (hero label) ---------- */
  const typedEl = document.getElementById('typed-text');
  const phrases = [
    'Intern Software Engineer',
    'Java & MySQL Developer',
    'Web & Desktop App Builder',
    'Clean Code Advocate'
  ];
  let pIndex = 0, cIndex = phrases[0].length, deleting = true;

  // Respect reduced motion
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (typedEl && !reduceMotion) {
    function typeLoop() {
      const current = phrases[pIndex];
      if (deleting) {
        cIndex--;
        typedEl.textContent = current.slice(0, cIndex);
        if (cIndex === 0) {
          deleting = false;
          pIndex = (pIndex + 1) % phrases.length;
          return void setTimeout(typeLoop, 350);
        }
        return void setTimeout(typeLoop, 35);
      } else {
        const next = phrases[pIndex];
        cIndex++;
        typedEl.textContent = next.slice(0, cIndex);
        if (cIndex === next.length) {
          deleting = true;
          return void setTimeout(typeLoop, 1800);
        }
        return void setTimeout(typeLoop, 55);
      }
    }
    setTimeout(typeLoop, 1800);
  }

  /* ---------- 6. Contact form validation (frontend-only) ---------- */
  const form = document.getElementById('contact-form');
  if (form) {
    const fields = {
      name: { el: document.getElementById('name'), err: document.getElementById('err-name') },
      email: { el: document.getElementById('email'), err: document.getElementById('err-email') },
      subject: { el: document.getElementById('subject'), err: document.getElementById('err-subject') },
      message: { el: document.getElementById('message'), err: document.getElementById('err-message') }
    };
    const successBox = document.getElementById('form-success');
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    function setError(key, msg) {
      fields[key].err.textContent = msg || '';
      fields[key].el.closest('.form-group').classList.toggle('invalid', Boolean(msg));
      return !msg;
    }
    function validate() {
      let ok = true;
      const v = {
        name: fields.name.el.value.trim(),
        email: fields.email.el.value.trim(),
        subject: fields.subject.el.value.trim(),
        message: fields.message.el.value.trim()
      };
      if (v.name.length < 2) ok = setError('name', 'Please enter your name.') && ok;
      else ok = setError('name', '') && ok;

      if (!emailRe.test(v.email)) ok = setError('email', 'Please enter a valid email.') && ok;
      else ok = setError('email', '') && ok;

      if (v.subject.length < 3) ok = setError('subject', 'Please add a subject.') && ok;
      else ok = setError('subject', '') && ok;

      if (v.message.length < 10) ok = setError('message', 'Message should be at least 10 characters.') && ok;
      else ok = setError('message', '') && ok;

      return ok;
    }

    // Live clear errors
    Object.keys(fields).forEach((k) =>
      fields[k].el.addEventListener('input', () => setError(k, ''))
    );

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      successBox.hidden = true;
      if (!validate()) {
        const firstInvalid = form.querySelector('.form-group.invalid input, .form-group.invalid textarea');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      const name = fields.name.el.value.trim();
      const email = fields.email.el.value.trim();
      const subject = fields.subject.el.value.trim();
      const message = fields.message.el.value.trim();
      
      const text = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`);
      window.open(`https://wa.me/94773727815?text=${text}`, '_blank');

      form.reset();
    });
  }

  /* ---------- 7. Dynamic footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
