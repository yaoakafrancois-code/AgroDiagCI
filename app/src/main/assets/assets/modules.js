/* Outils communs : onglets, nombres, impression */
(function () {
  var M = window.MOD = {};
  M.$ = function (s, r) { return (r || document).querySelector(s); };
  M.$$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  M.esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  M.num = function (id) { var el = document.getElementById(id); var v = el ? parseFloat(String(el.value).replace(',', '.')) : NaN; return isFinite(v) ? v : 0; };
  M.fmt = function (n, d) {
    if (!isFinite(n)) return '–';
    d = d == null ? 0 : d;
    var s = (Math.round(n * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d);
    var p = s.split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return p.join(',');
  };
  M.kg = function (k) { return k >= 1000 ? M.fmt(k / 1000, 2) + ' t' : (k >= 10 ? M.fmt(k, 0) : M.fmt(k, 1)) + ' kg'; };
  M.g = function (g) { return g >= 1000 ? M.fmt(g / 1000, 2) + ' kg' : M.fmt(g, g < 10 ? 1 : 0) + ' g'; };

  M.tabs = function () {
    var btns = M.$$('nav.tabs button[data-tab]');
    function show(id) {
      btns.forEach(function (b) { b.setAttribute('aria-selected', b.dataset.tab === id ? 'true' : 'false'); });
      M.$$('section.tab').forEach(function (s) { s.hidden = s.id !== id; });
      try { sessionStorage.setItem('tab:' + location.pathname, id); } catch (e) {}
      window.scrollTo(0, 0);
    }
    btns.forEach(function (b) { b.addEventListener('click', function () { show(b.dataset.tab); }); });
    var saved = null; try { saved = sessionStorage.getItem('tab:' + location.pathname); } catch (e) {}
    show(saved && document.getElementById(saved) ? saved : btns[0].dataset.tab);
  };

  /* Impression / PDF d'un bloc de la page */
  M.print = function (el, title) {
    var css = 'body{font:12pt/1.45 "Source Sans 3",Arial,sans-serif;color:#000;margin:16px}h1,h2,h3{font-family:"Arial Narrow",Arial,sans-serif;margin:12px 0 4px}' +
      'table{border-collapse:collapse;width:100%}th,td{border:1px solid #999;padding:4px 6px;text-align:left}td.n{text-align:right}' +
      'svg{max-width:100%;height:auto}figure{margin:8px 0;page-break-inside:avoid}.btns,.noprint,input,select,button{display:none!important}' +
      '.msg{border:1px solid #999;padding:6px 8px;margin:6px 0}.kpis{display:flex;flex-wrap:wrap;gap:8px}.kpi{border:1px solid #999;padding:6px}' +
      '.kpi span{display:block;font-size:9pt}.chip{border:1px solid #999;border-radius:9px;padding:0 6px;font-size:9pt;margin-right:4px}';
    var html = '<!doctype html><html><head><meta charset="utf-8"><title>' + M.esc(title) + '</title><style>' + css + '</style></head><body>' +
      '<p style="font-size:9pt;color:#555">AKA AgroDiag CI · ' + new Date().toLocaleDateString('fr-FR') + '</p>' + el.innerHTML + '</body></html>';
    if (window.AgroDiagAndroid && window.AgroDiagAndroid.printHtml) { window.AgroDiagAndroid.printHtml(html, title); return; }
    var w = window.open('', '_blank'); if (!w) { window.print(); return; }
    w.document.write(html); w.document.close(); w.focus(); w.print();
  };

  /* Mémorise les champs saisis sur ce téléphone */
  M.remember = function (key) {
    var data = {}; try { data = JSON.parse(localStorage.getItem(key) || '{}'); } catch (e) {}
    M.$$('input[id],select[id]').forEach(function (el) {
      if (el.dataset.nomem != null) return;
      if (data[el.id] != null) { if (el.type === 'checkbox') el.checked = !!data[el.id]; else el.value = data[el.id]; }
      el.addEventListener('change', function () {
        data[el.id] = el.type === 'checkbox' ? el.checked : el.value;
        try { localStorage.setItem(key, JSON.stringify(data)); } catch (e) {}
      });
    });
  };
})();
