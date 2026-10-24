/* Avis de mise à jour : à l'ouverture, l'application regarde (si Internet est disponible)
   si une version plus récente est publiée, et propose de la télécharger. */
(function () {
  var URL_VERSION = 'https://yaoakafrancois-code.github.io/AgroDiagCI/docs/version.json';
  var APK_DEFAUT = 'https://github.com/yaoakafrancois-code/AgroDiagCI/releases/download/test/AgroDiag-CI-test.apk';
  var K_PLUS_TARD = 'agrodiag.maj_plus_tard';

  function codeActuel() {
    try {
      if (window.AgroDiagAndroid && AgroDiagAndroid.versionCode) return parseInt(AgroDiagAndroid.versionCode(), 10) || 0;
    } catch (e) {}
    return 0; // hors téléphone : pas d'avis
  }
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function txt(s) { var d = document.createElement('div'); d.textContent = s == null ? '' : String(s); return d.innerHTML; }

  function afficher(info) {
    if (document.getElementById('maj-avis')) return;
    var apk = /^https:\/\/github\.com\//.test(info.apk || '') ? info.apk : APK_DEFAUT;
    var box = document.createElement('div');
    box.id = 'maj-avis';
    box.setAttribute('role', 'dialog');
    box.style.cssText = 'position:fixed;left:12px;right:12px;bottom:12px;z-index:9999;max-width:560px;margin:0 auto;' +
      'background:var(--surface,#fff);color:var(--ink,#17201A);border:2px solid var(--accent,#17694A);border-radius:14px;' +
      'padding:14px 16px;box-shadow:0 6px 24px rgba(0,0,0,.25);font:16px/1.45 var(--body,system-ui,sans-serif)';
    var nouv = (info.nouveautes || []).slice(0, 5).map(function (n) { return '<li>' + txt(n) + '</li>'; }).join('');
    box.innerHTML =
      '<strong style="font-size:1.1rem">Nouvelle version ' + txt(info.version) + ' disponible</strong>' +
      (nouv ? '<ul style="margin:6px 0 8px;padding-left:20px">' + nouv + '</ul>' : '') +
      '<p style="margin:4px 0 10px;font-size:.9rem;color:var(--muted,#566259)">Appuyez sur « Télécharger », puis ouvrez le fichier ' +
      'et appuyez sur « Mettre à jour » ou « Installer ». Vos données restent dans le téléphone.</p>' +
      '<div style="display:flex;gap:10px;flex-wrap:wrap">' +
      '<a id="maj-ok" href="' + txt(apk) + '" style="flex:1;text-align:center;background:var(--accent,#17694A);color:var(--accent-ink,#fff);' +
      'padding:10px 14px;border-radius:10px;font-weight:700;text-decoration:none">Télécharger</a>' +
      '<button id="maj-non" type="button" style="flex:0 0 auto;background:transparent;color:inherit;border:1px solid var(--line,#D5DBD1);' +
      'padding:10px 14px;border-radius:10px;font:inherit">Plus tard</button></div>';
    document.body.appendChild(box);
    document.getElementById('maj-non').onclick = function () {
      lsSet(K_PLUS_TARD, info.versionCode + '|' + Date.now());
      box.remove();
    };
  }

  function verifier() {
    var actuel = codeActuel();
    if (!actuel || !window.fetch) return;
    fetch(URL_VERSION + '?t=' + Date.now(), { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (info) {
        if (!info || !(info.versionCode > actuel)) return;
        var pt = (lsGet(K_PLUS_TARD) || '').split('|');
        // « Plus tard » : on redemande au bout d'un jour, ou tout de suite si une version encore plus récente sort.
        if (pt[0] == String(info.versionCode) && Date.now() - (+pt[1] || 0) < 86400000) return;
        afficher(info);
      })
      .catch(function () {}); // pas d'Internet : rien à faire
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', verifier); else verifier();
})();
