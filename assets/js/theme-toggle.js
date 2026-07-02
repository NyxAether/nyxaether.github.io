/**
 * Theme Toggle
 * Manages light/dark theme switching with localStorage persistence.
 */
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;

  // Restore saved theme
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-theme');
  }

  function updateIcon() {
    const isDark = document.body.classList.contains('dark-theme');
    toggle.textContent = isDark ? '🌙' : '☀️';
  }

  // Set initial icon
  updateIcon();

  toggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem(
      'theme',
      document.body.classList.contains('dark-theme') ? 'dark' : 'light',
    );
    updateIcon();
  });
});