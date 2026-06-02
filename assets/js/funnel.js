// 3-step lead-magnet funnel — progressive disclosure + FormSubmit handoff + PDF auto-download
(function(){
  const shell = document.querySelector('.funnel-shell');
  if (!shell) return;
  const PDF_URL = 'assets/downloads/checklist.pdf';
  const steps = shell.querySelectorAll('.funnel-step');
  const dots = shell.querySelectorAll('.funnel-progress .fp-step');
  const stepCount = shell.querySelector('.step-count');
  const backBtn = shell.querySelector('.btn--back');
  const form = shell.querySelector('form');
  let current = 0;

  function triggerDownload(){
    const a = document.createElement('a');
    a.href = PDF_URL;
    a.download = 'checklist-importation-cameroun.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  function show(idx){
    steps.forEach((s, i) => s.classList.toggle('active', i === idx));
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === idx);
      d.classList.toggle('done', i < idx);
    });
    if (stepCount) stepCount.textContent = `Étape ${idx + 1} / ${steps.length}`;
    if (backBtn) backBtn.style.visibility = idx === 0 ? 'hidden' : 'visible';
    current = idx;
    // Focus first input in the new step
    const first = steps[idx].querySelector('input, select, textarea');
    if (first) setTimeout(() => first.focus(), 50);
  }

  function validateStep(idx){
    const required = steps[idx].querySelectorAll('[required]');
    let ok = true;
    required.forEach(el => {
      if (!el.value || (el.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value))) {
        el.classList.add('invalid');
        ok = false;
      } else {
        el.classList.remove('invalid');
      }
    });
    return ok;
  }

  shell.querySelectorAll('.btn--next').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (!validateStep(current)) return;
      if (current < steps.length - 1) show(current + 1);
    });
  });

  if (backBtn) backBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (current > 0) show(current - 1);
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      if (!validateStep(current)) { e.preventDefault(); return; }
      // honeypot present? bot
      const honey = form.querySelector('input[name="_honey"]');
      if (honey && honey.value) { e.preventDefault(); return; }
      // Lead magnet: capture lead via FormSubmit AJAX, then auto-download the PDF
      if (form.dataset.ajax === 'true') {
        e.preventDefault();
        const data = new FormData(form);
        const finish = () => { shell.classList.add('submitted'); triggerDownload(); };
        fetch(form.action, { method: 'POST', body: data, headers: { 'Accept': 'application/json' } })
          .then(finish)
          .catch(finish);
      }
    });
  }

  show(0);
})();
