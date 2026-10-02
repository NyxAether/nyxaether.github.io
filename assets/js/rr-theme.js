/* Transition de thème rr/ : cercle qui s'étend depuis le bouton (View Transitions API).
   rrThemeTransition(btn, apply) exécute apply() (qui change data-theme et redessine ce qui est léger,
   de façon synchrone) dans la transition ; sans API ou en mouvement réduit, apply() est appelée directement.
   Renvoie une promesse résolue à la fin : le travail lourd (WebGL, etc.) s'y fait, hors animation.
   Événement document « rrthemetransition » {phase: start|end} pour mettre en pause les animations en cours.
   Styles : rr-theme.css. */
window.rrThemeTransition = function (btn, apply) {
  const root = document.documentElement;
  if (!document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    apply();
    return Promise.resolve();
  }
  // La forme de départ est posée en CSS (--vt-from) pour éviter un flash du nouveau thème
  // avant le début de l'animation.
  const b = btn.getBoundingClientRect();
  const x = b.left + b.width / 2, y = b.top + b.height / 2;
  const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  const clip = [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`];
  root.style.setProperty('--vt-from', clip[0]);
  root.setAttribute('data-vt', '');
  const phase = (p) => document.dispatchEvent(new CustomEvent('rrthemetransition', { detail: { phase: p } }));
  phase('start');
  const vt = document.startViewTransition(apply);
  vt.ready.then(() => root.animate({ clipPath: clip }, {
    duration: 600, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'forwards',
    pseudoElement: '::view-transition-new(root)'
  })).catch(() => {});
  return vt.finished.catch(() => {}).then(() => {
    root.removeAttribute('data-vt');
    phase('end');
  });
};
