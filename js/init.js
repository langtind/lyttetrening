/* ═══════════════════════════════════════════
   INIT
   ═══════════════════════════════════════════ */
initTheme();

// Install tip — show once for mobile users not in standalone mode
(function() {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    || window.navigator.standalone === true;
  const dismissed = localStorage.getItem('ci-install-dismissed');
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (!isStandalone && !dismissed && isMobile) {
    const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
    const tip = document.createElement('div');
    tip.className = 'install-tip show';
    tip.innerHTML = `
      <div class="install-tip-icon"><span class="material-icons-round">add_to_home_screen</span></div>
      <div class="install-tip-content">
        <div class="install-tip-title">Legg til på hjemskjermen</div>
        <div class="install-tip-desc">${isIOS
          ? 'Trykk <strong>Del</strong>-knappen og velg <strong>Legg til på Hjem-skjerm</strong> for best opplevelse.'
          : 'Trykk menyen <strong>(&#8942;)</strong> og velg <strong>Legg til på startskjermen</strong> for best opplevelse.'}</div>
      </div>
      <button class="install-tip-close" onclick="this.parentElement.remove(); localStorage.setItem('ci-install-dismissed','1')">
        <span class="material-icons-round">close</span>
      </button>`;
    document.body.appendChild(tip);

    // Auto-dismiss after 15 seconds
    setTimeout(() => { if (tip.parentElement) tip.remove(); }, 15000);
  }
})();
