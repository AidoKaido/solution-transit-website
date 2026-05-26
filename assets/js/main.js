// Mobile nav toggle
document.addEventListener('DOMContentLoaded', () => {
  const burger = document.querySelector('.nav-menu-btn');
  const nav = document.querySelector('.nav-links');
  if (burger && nav) {
    burger.addEventListener('click', () => nav.classList.toggle('open'));
  }

  // Active nav link based on page
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path) a.classList.add('active');
  });

  // Counters
  const counters = document.querySelectorAll('.counter[data-target]');
  if (counters.length) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          const el = en.target;
          const target = parseInt(el.dataset.target, 10);
          const isPct = el.querySelector('.pct') !== null;
          const hasPlus = el.querySelector('.plus') !== null;
          let cur = 0;
          const step = Math.max(1, Math.ceil(target / 50));
          const t = setInterval(() => {
            cur = Math.min(target, cur + step);
            el.innerHTML =
              (hasPlus ? '<span class="plus">+</span>' : '') +
              cur +
              (isPct ? '<span class="pct">%</span>' : '');
            if (cur >= target) clearInterval(t);
          }, 24);
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(c => obs.observe(c));
  }

  // Reveal on scroll
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const ro = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); ro.unobserve(en.target); } });
    }, { threshold: 0.12 });
    reveals.forEach(r => ro.observe(r));
  }

  // Clear invalid styling on user input
  document.querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('input', () => el.classList.remove('invalid'));
    el.addEventListener('change', () => el.classList.remove('invalid'));
  });
});
