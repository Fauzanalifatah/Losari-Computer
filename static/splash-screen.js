(function () {
  // Minimum time to show splash so the user experiences the beautiful branding (in ms)
  const isPreview = window.location.search.includes('previewSplash=1') || window.location.search.includes('splash=1');
  const MIN_DISPLAY_TIME = 1300;
  const startTime = Date.now();
  let dismissed = false;

  if (isPreview) return; // Keeps splash screen visible for preview / inspection

  function dismissSplash() {
    if (dismissed) return;
    const splash = document.getElementById('losari-splash');
    if (!splash) return;

    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, MIN_DISPLAY_TIME - elapsed);

    setTimeout(() => {
      dismissed = true;
      splash.classList.add('splash-hidden');
      setTimeout(() => {
        if (splash && splash.parentNode) {
          splash.parentNode.removeChild(splash);
        }
      }, 650);
    }, remaining);
  }

  // Dismiss on window load or fallback timer
  if (document.readyState === 'complete') {
    dismissSplash();
  } else {
    window.addEventListener('load', dismissSplash);
    // Fallback in case load takes longer
    setTimeout(dismissSplash, 3500);
  }

  // Also allow instant dismiss by clicking anywhere on splash screen or pressing Escape
  document.addEventListener('DOMContentLoaded', () => {
    const splash = document.getElementById('losari-splash');
    if (splash) {
      splash.addEventListener('click', () => {
        dismissed = true;
        splash.classList.add('splash-hidden');
        setTimeout(() => {
          if (splash && splash.parentNode) splash.parentNode.removeChild(splash);
        }, 650);
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !dismissed) {
        const s = document.getElementById('losari-splash');
        if (s) {
          dismissed = true;
          s.classList.add('splash-hidden');
          setTimeout(() => {
            if (s && s.parentNode) s.parentNode.removeChild(s);
          }, 650);
        }
      }
    });
  });
})();
