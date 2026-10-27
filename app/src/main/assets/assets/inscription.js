/* AKA AgroDiag CI : inscription des utilisateurs auprès de l'éditeur.
   L'identification (nom, prénoms, contact, profil) reste enregistrée sur le téléphone ;
   avec l'accord de la personne, elle est aussi transmise une fois à la base de l'éditeur
   pour connaître le nombre d'utilisateurs et pouvoir les contacter au sujet de l'application.
   Hors connexion, l'envoi attend le retour du réseau. */
(function () {
  'use strict';
  var URL_API = 'https://uxgwwwdtvrocuqnxuzzn.supabase.co';
  var CLE = 'sb_publishable_J47WwSHCMHxPtIzne5ShhA_HApNZf2t';
  var K_PROFIL = 'agrodiag.profil', K_ID = 'agrodiag.inscrit_id', K_SYNC = 'agrodiag.inscrit_sync', K_VU = 'agrodiag.inscrit_vu';
  var APPAREIL = 'Android · AKA AgroDiag CI 1.11.0';
  var TEXTE = "J'accepte que mes nom, prénoms, contact et profil soient transmis à l'éditeur de l'application (YAO Aka François) pour suivre son utilisation et me contacter à son sujet. Ils ne sont ni vendus ni partagés.";

  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); return true; } catch (e) { return false; } }
  function profil() { try { return JSON.parse(lsGet(K_PROFIL) || 'null'); } catch (e) { return null; } }
  function saveProfil(p) { return lsSet(K_PROFIL, JSON.stringify(p)); }
  function uuid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) { var r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 3 | 8)).toString(16); });
  }
  function today() { return new Date().toISOString().slice(0, 10); }

  function api(path, body, prefer) {
    var h = { 'apikey': CLE, 'Authorization': 'Bearer ' + CLE, 'Content-Type': 'application/json' };
    if (prefer) h['Prefer'] = prefer;
    return fetch(URL_API + path, { method: 'POST', headers: h, body: JSON.stringify(body) })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r; });
  }

  function champs(p) {
    var c = String(p.contact || '').trim(), mail = c.indexOf('@') > 0;
    return {
      nom: String(p.nom || '').slice(0, 80), prenom: String(p.prenoms || '').slice(0, 80),
      telephone: mail ? null : c.slice(0, 30), email: mail ? c.slice(0, 120) : null,
      profil: String(p.profil || '').slice(0, 60)
    };
  }

  var enCours = false;
  function synchroniser() {
    var p = profil();
    if (enCours || !p || !p.nom || !p.contact || !p.consentInscription) return;
    if (navigator.onLine === false) return;
    enCours = true;
    var f = champs(p), id = lsGet(K_ID), signature = JSON.stringify(f);
    var tache;
    if (!id) {
      id = uuid();
      var ligne = { id: id, consentement: true, appareil: APPAREIL };
      for (var k in f) ligne[k] = f[k];
      tache = api('/rest/v1/inscrits', ligne, 'return=minimal').then(function () {
        lsSet(K_ID, id); lsSet(K_SYNC, signature); lsSet(K_VU, today());
      });
    } else if (lsGet(K_SYNC) !== signature) {
      tache = api('/rest/v1/rpc/maj_inscrit', { p_id: id, p_nom: f.nom, p_prenom: f.prenom, p_telephone: f.telephone, p_email: f.email, p_profil: f.profil, p_localite: null })
        .then(function () { lsSet(K_SYNC, signature); lsSet(K_VU, today()); });
    } else if (lsGet(K_VU) !== today()) {
      tache = api('/rest/v1/rpc/signaler_visite', { p_id: id }).then(function () { lsSet(K_VU, today()); });
    } else {
      tache = Promise.resolve();
    }
    tache.catch(function () { /* nouvel essai au prochain lancement ou au retour du réseau */ })
      .then(function () { enCours = false; });
  }

  /* Case de consentement ajoutée aux formulaires d'identification (Cultures et Élevage) */
  function caseConsentement(form) {
    if (!form || form.querySelector('.aka-consent')) return;
    var lab = document.createElement('label');
    lab.className = 'aka-consent';
    lab.style.cssText = 'display:flex;gap:8px;align-items:flex-start;font-weight:400;font-size:13px;line-height:1.4;color:inherit;flex-direction:row';
    lab.innerHTML = '<input type="checkbox" required style="width:auto;margin-top:2px;flex:none"><span></span>';
    lab.querySelector('span').textContent = TEXTE;
    var btn = form.querySelector('button[type=submit]');
    form.insertBefore(lab, btn);
    var p = profil();
    if (p && p.consentInscription) lab.querySelector('input').checked = true;
  }

  // Bloque l'envoi du formulaire tant que la case n'est pas cochée (avant le traitement du module)
  document.addEventListener('submit', function (e) {
    var form = e.target;
    var lab = form && form.querySelector && form.querySelector('.aka-consent');
    if (!lab) return;
    var ok = lab.querySelector('input').checked;
    var msg = form.querySelector('#lgMsg, #seMsg');
    if (!ok) {
      e.preventDefault(); e.stopImmediatePropagation();
      if (msg) msg.textContent = "Cochez la case d'accord pour continuer.";
      return;
    }
    // Le module enregistre le profil juste après : on y ajoute l'accord, puis on synchronise
    setTimeout(function () {
      var p = profil();
      if (p && !p.consentInscription) { p.consentInscription = new Date().toISOString(); saveProfil(p); }
      synchroniser();
    }, 50);
  }, true);

  /* Personnes déjà identifiées avant cette version : demande d'accord une seule fois */
  function demanderAccord() {
    var p = profil();
    if (!p || !p.nom || !p.contact || p.consentInscription) return;
    var fond = document.createElement('div');
    fond.style.cssText = 'position:fixed;inset:0;z-index:2000;background:rgba(10,20,14,.55);display:flex;align-items:center;justify-content:center;padding:16px';
    fond.innerHTML = '<div role="dialog" aria-modal="true" style="background:#fff;color:#17201A;max-width:420px;width:100%;border-radius:14px;padding:20px;display:flex;flex-direction:column;gap:12px;font:15px/1.45 system-ui,sans-serif">' +
      '<b style="font-size:17px">Votre inscription</b><p style="margin:0"></p>' +
      '<button type="button" data-ok style="font:600 15px system-ui,sans-serif;background:#17694A;color:#fff;border:0;border-radius:8px;padding:11px">J\'accepte et je continue</button>' +
      '<button type="button" data-non style="font:600 14px system-ui,sans-serif;background:none;color:#566259;border:0;padding:6px">Refuser et me déconnecter</button></div>';
    fond.querySelector('p').textContent = TEXTE;
    fond.querySelector('[data-ok]').onclick = function () {
      var q = profil(); if (q) { q.consentInscription = new Date().toISOString(); saveProfil(q); }
      fond.remove(); synchroniser();
    };
    fond.querySelector('[data-non]').onclick = function () {
      try { localStorage.removeItem(K_PROFIL); localStorage.removeItem('agrodiag.admin'); } catch (e) {}
      location.reload();
    };
    document.body.appendChild(fond);
  }

  function demarrer() {
    caseConsentement(document.getElementById('loginForm'));
    caseConsentement(document.getElementById('seLoginForm'));
    demanderAccord();
    synchroniser();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', demarrer); else demarrer();
  window.addEventListener('online', synchroniser);
})();
