(function () {
  // 1. Detect if navigation is a browser Reload / Refresh, or in preview mode
  var isPreview = window.location.search.indexOf('previewSplash=1') !== -1 || window.location.search.indexOf('splash=1') !== -1;
  var isReload = false;

  try {
    var navEntries = performance.getEntriesByType('navigation');
    if (navEntries && navEntries.length > 0) {
      isReload = (navEntries[0].type === 'reload');
    } else if (performance.navigation) {
      isReload = (performance.navigation.type === 1);
    }
  } catch (err) {}

  // 2. If NOT a reload and NOT preview mode:
  // Suppress splash screen completely so clicking menus (Shop, Service, Tentang, etc.) is instant!
  if (!isReload && !isPreview) {
    function removeSplashImmediate() {
      var splash = document.getElementById('losari-splash');
      if (splash && splash.parentNode) {
        splash.parentNode.removeChild(splash);
      }
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', removeSplashImmediate);
    } else {
      removeSplashImmediate();
    }
    return;
  }

  // 3. Page WAS reloaded or is in preview mode -> Activate Splash Screen!
  document.documentElement.classList.add('show-splash');

  if (isPreview) return; // Keep visible for review if explicitly requested

  // 4. Smooth timer & fade-out on reload
  var MIN_DISPLAY_TIME = 1300;
  var startTime = Date.now();
  var dismissed = false;

  function dismissSplash() {
    if (dismissed) return;
    var splash = document.getElementById('losari-splash');
    if (!splash) return;

    var elapsed = Date.now() - startTime;
    var remaining = Math.max(0, MIN_DISPLAY_TIME - elapsed);

    setTimeout(function () {
      dismissed = true;
      splash.classList.add('splash-hidden');
      setTimeout(function () {
        if (splash && splash.parentNode) {
          splash.parentNode.removeChild(splash);
        }
      }, 650);
    }, remaining);
  }

  if (document.readyState === 'complete') {
    dismissSplash();
  } else {
    window.addEventListener('load', dismissSplash);
    setTimeout(dismissSplash, 3500);
  }

  // Allow instant click / Escape key dismissal
  document.addEventListener('DOMContentLoaded', function () {
    var splash = document.getElementById('losari-splash');
    if (splash) {
      splash.addEventListener('click', function () {
        dismissed = true;
        splash.classList.add('splash-hidden');
        setTimeout(function () {
          if (splash && splash.parentNode) splash.parentNode.removeChild(splash);
        }, 650);
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !dismissed) {
        var s = document.getElementById('losari-splash');
        if (s) {
          dismissed = true;
          s.classList.add('splash-hidden');
          setTimeout(function () {
            if (s && s.parentNode) s.parentNode.removeChild(s);
          }, 650);
        }
      }
    });
  });
})();
