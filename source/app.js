const EMBEDDED = /*__DATA__*/null;
const DATA_URL = 'https://yaoakafrancois-code.github.io/AgroDiagCI/data/agrodiag-data.json';
function lsGet(k){ try { return localStorage.getItem(k) } catch(e){ return null } }
function lsSet(k,v){ try { localStorage.setItem(k,v); return true } catch(e){ return false } }
function lsDel(k){ try { localStorage.removeItem(k) } catch(e){} }
const IS_ADMIN = lsGet('agrodiag.admin')==='1';
function validData(d){ return d && Array.isArray(d.locs) && d.locs.length && Array.isArray(d.cults) && d.cults.length && Array.isArray(d.risques); }
function pickData(){
  let best=EMBEDDED;
  try { const r=JSON.parse(lsGet('agrodiag.data.remote')||'null'); if (validData(r) && (r.version||0)>(best.version||0)) best=r; } catch(e){}
  if (IS_ADMIN){ try { const a=JSON.parse(lsGet('agrodiag.data.draft')||'null'); if (validData(a)) { a.__draft=true; return a; } } catch(e){} }
  return best;
}
const D = pickData();
D.itin = D.itin || {};
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt = (n, d=0) => n==null || isNaN(n) ? '—' : Number(n).toLocaleString('fr-FR', {maximumFractionDigits:d, minimumFractionDigits:d});
const MOIS = ['Jan','Fév','Mar','Avr','Mai','Juin','Juil','Août','Sep','Oct','Nov','Déc'];
const MOIS_L = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
const CULT = Object.fromEntries(D.cults.map(c => [c.nom, c]));
const ACTIVE = D.cults.filter(c => !c.doublon);
const S = { loc:null, crop:null, over:null, costs:{}, fiches:{}, climat:{}, perso:{}, store:null, user:null, dl:null, online:false };
const pref = { get(k){ try { return localStorage.getItem(k) } catch(e){ return null } }, set(k,v){ try { localStorage.setItem(k,v) } catch(e){} } };
function toast(msg){ const t=$('#toast'); t.textContent=msg; t.hidden=false; clearTimeout(toast._t); toast._t=setTimeout(()=>t.hidden=true, 3000); }
const slug = s => String(s).normalize('NFKD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');

/* ================= Stockage : appareil (hors connexion) ou base partagée ================= */
const LocalStore = {
  kind:'local', subs:{},
  key: c => 'agrodiag.v3.'+c,
  read(c){ try { return JSON.parse(localStorage.getItem(this.key(c)) || '{}') || {}; } catch(e){ return {}; } },
  write(c,o){ try { localStorage.setItem(this.key(c), JSON.stringify(o)); return true; } catch(e){ return false; } },
  subscribe(c, cb){ (this.subs[c] = this.subs[c] || []).push(cb); cb(this.read(c)); },
  emit(c){ const o=this.read(c); (this.subs[c]||[]).forEach(f=>f(o)); },
  async set(c,id,data){ const o=this.read(c); o[id]=data; if(!this.write(c,o)) throw {code:'storage', message:"Mémoire de l'appareil indisponible (navigation privée ?)"}; this.emit(c); },
  async add(c,data){ const id=Date.now().toString(36)+Math.random().toString(36).slice(2,7); await this.set(c,id,data); return id; },
  async del(c,id){ const o=this.read(c); delete o[id]; this.write(c,o); this.emit(c); },
  available(){ try { localStorage.setItem('agrodiag.t','1'); localStorage.removeItem('agrodiag.t'); return true; } catch(e){ return false; } }
};
function DbStore(db){ return {
  kind:'db',
  subscribe(c, cb){ db.collection(c).onSnapshot(s=>{ const o={}; s.docs.forEach(d=>o[d.id]=d.data()); cb(o); }, ()=>{}); },
  set:(c,id,data)=>db.collection(c).doc(String(id)).set(data),
  add:async(c,data)=>(await db.collection(c).add(data)).id,
  del:(c,id)=>db.collection(c).doc(String(id)).delete()
}; }
const COLS = ['fiches','couts','climat','localites'];
function bindStore(store){
  S.store = store;
  store.subscribe('fiches', o=>{ S.fiches=o; renderFiches(); });
  store.subscribe('couts', o=>{ S.costs=o; renderCostCount(); refreshCostMeta(); });
  store.subscribe('climat', o=>{ S.climat=o; if(S.loc){ renderLoc(); } });
  store.subscribe('localites', o=>{ S.perso=o; refreshLocs(); });
}
function storeErr(e){ return e?.code==='not_granted' ? "Vous n'avez pas le droit d'enregistrer ici" : e?.code==='storage' ? e.message : 'Enregistrement impossible, réessayez'; }
const IS_ANDROID = !!window.AgroDiagAndroid;
function blobToBase64(blob){ return new Promise((res,rej)=>{ const r=new FileReader(); r.onload=()=>res(String(r.result).split(',')[1]||''); r.onerror=rej; r.readAsDataURL(blob); }); }
async function saveFile(name, data, mime){
  const blob = data instanceof Blob ? data : new Blob([data], {type:mime});
  if (IS_ANDROID){
    try {
      const b64 = await blobToBase64(blob);
      return await new Promise(res=>{ window.__agrodiagSaved = st=>{ window.__agrodiagSaved=null; res(st); }; window.AgroDiagAndroid.saveFile(name, mime||blob.type||'application/octet-stream', b64); });
    } catch(e){ return 'error'; }
  }
  if (S.dl){ try { await S.dl.save({filename:name, data:blob}); return 'ok'; } catch(e){ return e?.code==='declined' ? 'declined' : 'error'; } }
  try { const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=name; document.body.appendChild(a); a.click(); setTimeout(()=>{ URL.revokeObjectURL(a.href); a.remove(); }, 1000); return 'ok'; }
  catch(e){ return 'error'; }
}

/* ================= Localités (référentiel + villages ajoutés) ================= */
function persoLocs(){
  return Object.entries(S.perso).map(([id,p])=>{
    const zv=D.zoneVals[p.zone]||{};
    return { id:'p_'+id, pid:id, nom:p.nom, sp:p.nom, dep:'', reg:p.reg||'Mes villages', reg0:p.reg, zone:p.zone, sol:p.sol||'non précisé',
      ph:p.ph, mo:p.mo, drain:p.drain, contr:p.contr||'', pluie:zv.pluie, pluieSrc:'zone', st:D.zoneSt[p.zone], statut:'perso',
      note:'Village ajouté par vous : données de sol saisies.', ref:{}, orig:null, perso:true };
  });
}
function allLocs(){ return D.locs.concat(persoLocs()); }
function findLoc(id){ return allLocs().find(l=>String(l.id)===String(id)); }

/* ================= Climat ================= */
function stationMonthly(loc){
  const base=D.stations[loc.st]; if(!base) return null;
  const tot=base.reduce((a,b)=>a+b,0);
  const own = loc.pluieSrc && loc.pluieSrc.startsWith('station');
  const k = own ? 1 : (loc.pluie||tot)/tot;
  return base.map(v=>Math.round(v*k));
}
function climOf(loc){
  const c=S.climat[loc.id];
  if (c && c.pluie>0){
    const mens = Array.isArray(c.mensuel)&&c.mensuel.length===12 ? c.mensuel : (()=>{ const m=stationMonthly(loc); const t=m.reduce((a,b)=>a+b,0); return m.map(v=>Math.round(v*c.pluie/t)); })();
    return { pluie:c.pluie, mens, secs: c.secs ?? mens.filter(v=>v<50).length, src:c.source||'import', local:true, date:c.date };
  }
  const mens=stationMonthly(loc);
  const own = loc.pluieSrc && loc.pluieSrc.startsWith('station');
  const src = own ? `${loc.pluieSrc} (normale 1961-1990)` : `zone, profil de la station ${loc.st}${D.stNote[loc.st]?' ('+D.stNote[loc.st]+')':''}`;
  return { pluie:loc.pluie, mens, secs: mens.filter(v=>v<50).length, src, local:own };
}
function reliability(loc){
  const k=climOf(loc), soil=!!S.over || loc.perso;
  if (soil && k.local) return {lab:'Fiabilité élevée', cls:'p-fav', txt:'Sol mesuré et climat local (station ou NASA POWER).'};
  if (soil || k.local) return {lab:'Fiabilité moyenne', cls:'p-cond', txt: soil ? 'Sol mesuré, climat issu de la zone : importez les données NASA POWER de la localité.' : 'Climat local, sol issu de la moyenne de zone : saisissez une analyse de sol de la parcelle.'};
  return {lab:'Fiabilité indicative', cls:'p-risk', txt:'Sol et climat issus de moyennes de zone : à confirmer par une analyse de sol et les données NASA POWER.'};
}
function soilOf(loc){ const o=S.over; return { ph:o?.ph ?? loc.ph, mo:o?.mo ?? loc.mo, drain:o?.drain ?? loc.drain }; }

/* ================= Calendrier ================= */
function calendrier(c, mens){
  const n=Math.max(1, Math.round((c.cycle||90)/30));
  if (c.per || n>=12) return null;
  const need = c.sec===0?100 : c.sec===1?75 : 50;
  const win=[];
  for (let s=0;s<12;s++){ let ok=0, tot=0, dry=0; for (let i=0;i<n;i++){ const m=mens[(s+i)%12]; tot+=m; if(m>=need) ok++; if(m<50) dry++; } win.push({s, ok, tot, dry}); }
  if (c.irr){
    const best=[...win].sort((a,b)=>a.tot-b.tot)[0];
    return { irr:true, n, need, start:best.s, months:[...Array(n)].map((_,i)=>(best.s+i)%12), txt:`Contre-saison avec irrigation : semis ou repiquage en ${MOIS_L[best.s]}, période la plus sèche (${fmt(best.tot)} mm sur le cycle).` };
  }
  const maxOk=Math.max(...win.map(w=>w.ok));
  const goods=win.filter(w=>w.ok===maxOk).sort((a,b)=>b.tot-a.tot);
  const best=goods[0];
  const second=goods.find(w=>{ const d=Math.min((w.s-best.s+12)%12,(best.s-w.s+12)%12); return d>=n; });
  const months=[...Array(n)].map((_,i)=>(best.s+i)%12);
  const starts=[...new Set(goods.map(w=>w.s))].sort((a,b)=>a-b).map(s=>MOIS_L[s]);
  let txt = maxOk===0 ? `Aucun mois de semis ne donne ${need} mm/mois pendant le cycle : culture pluviale très risquée sans irrigation.`
    : `Meilleur semis : ${MOIS_L[best.s]} (${maxOk} mois sur ${n} avec au moins ${need} mm${best.dry?`, ${best.dry} mois sous 50 mm`:''}).`;
  if (maxOk>0 && second) txt += ` Deuxième saison possible : semis en ${MOIS_L[second.s]}.`;
  else if (maxOk>0 && starts.length>1) txt += ` Fenêtre équivalente : ${starts.join(', ')}.`;
  return { irr:false, n, need, ok:maxOk, start:best.s, months, second: second?.s, txt, pts: 10*maxOk/n };
}

/* ================= Moteur de score ================= */
function rangePts(x, r, max, floor){
  const [a,o1,o2,b]=r;
  if (x>=o1 && x<=o2) return max;
  if (x<o1 && x>=a) return floor + (max-floor)*(x-a)/(o1-a);
  if (x>o2 && x<=b) return floor + (max-floor)*(b-x)/(b-o2);
  return 0;
}
function decision(s){
  if (s==null) return {lab:'Hors modèle', cls:'p-neutral', col:'var(--muted)'};
  if (s>=75) return {lab:'Favorable', cls:'p-fav', col:'var(--good)'};
  if (s>=60) return {lab:'Sous conditions', cls:'p-cond', col:'var(--warn)'};
  if (s>=45) return {lab:'Risqué', cls:'p-risk', col:'var(--risk)'};
  return {lab:'Déconseillé', cls:'p-bad', col:'var(--bad)'};
}
function evaluate(loc, c, soil){
  soil = soil || soilOf(loc);
  if (c.horsModele) return { score:null, facts:[], reco:["Activité hors du modèle sol/climat (aquaculture) : à évaluer avec des critères propres (eau, salinité, site)."], cal:null };
  const facts=[], reco=[], ct=(loc.contr||'').toLowerCase(), fam=(c.fam||'').toLowerCase();
  const K=climOf(loc);
  // pH
  const phPts=rangePts(soil.ph, c.ph, 25, 8);
  facts.push(['pH', phPts, 25, soil.ph>=c.ph[1]&&soil.ph<=c.ph[2] ? `pH ${fmt(soil.ph,1)} dans l'optimum Ecocrop (${fmt(c.ph[1],1)}–${fmt(c.ph[2],1)})` : soil.ph<c.ph[0]||soil.ph>c.ph[3] ? `pH ${fmt(soil.ph,1)} hors des limites (${fmt(c.ph[0],1)}–${fmt(c.ph[3],1)})` : `pH ${fmt(soil.ph,1)} hors optimum (${fmt(c.ph[1],1)}–${fmt(c.ph[2],1)})`]);
  if (soil.ph < c.ph[1]) reco.push(soil.ph < c.ph[1]-0.7 ? "Chauler : dolomie ou calcaire broyé 1 000–2 000 kg/ha, 1 à 2 mois avant semis ou plantation. Ajuster la dose sur l'analyse (Al échangeable)." : "Chauler légèrement : dolomie 500–1 000 kg/ha avant semis ou plantation, à ajuster selon l'analyse.");
  if (soil.ph > c.ph[2]) reco.push("pH élevé pour cette culture : apporter de la matière organique et privilégier des engrais azotés acidifiants (sulfate d'ammonium).");
  // MO
  const mo=soil.mo, moPts=mo>=3?10:mo>=2?7:mo>=1.5?5:3;
  facts.push(['Matière organique', moPts, 10, `${fmt(mo,1)} % ${mo>=3?'(bon niveau)':mo>=2?'(moyen)':'(faible)'}`]);
  if (mo<2) reco.push("Relever la matière organique : compost ou fumier décomposé 5–10 t/ha, paillage, plantes de couverture (mucuna, pueraria) ou jachère améliorée.");
  else if (mo<3) reco.push("Entretenir la matière organique : compost 3–5 t/ha et restitution des résidus de récolte.");
  // Drainage (tolérances Ecocrop)
  const dr=soil.drain; let drPts, drTxt=dr;
  if (dr==='Bon') { drPts = (c.drainI && /riz/i.test(c.nom) && c.irr) ? 6 : 10; }
  else if (dr==='Moyen') drPts = c.drainI?10:8;
  else if (dr==='Rapide') { drPts = c.drainE?10:6; if(!c.drainE) drTxt+=' (sol filtrant, culture peu tolérante)'; }
  else { drPts = c.drainI?9:5; if(!c.drainI) drTxt+=' (risque d\'engorgement, culture peu tolérante)'; }
  facts.push(['Drainage', drPts, 10, drTxt + (c.drainI?' · tolère un drainage imparfait':'') + (c.drainE?' · tolère un sol filtrant':'')]);
  // Pluie annuelle
  const pl=K.pluie; let plPts, plTxt;
  if (c.irr){
    plPts = pl>=c.pl[0] ? 25 : 20;
    plTxt = `~${fmt(pl)} mm/an · culture conduite avec maîtrise de l'eau`;
    if (/bas-fond/i.test(c.nom)) reco.push("Bas-fond : aménager diguettes et canaux pour maîtriser la lame d'eau ; le profil de sol de zone ne décrit pas le bas-fond, faire une analyse (pH, MO, fer).");
    else reco.push("Conduire en contre-saison avec irrigation, de préférence au goutte-à-goutte, pour limiter les maladies.");
  } else {
    plPts=rangePts(pl, c.pl, 25, 8);
    plTxt = pl>=c.pl[1]&&pl<=c.pl[2] ? `${fmt(pl)} mm/an dans l'optimum Ecocrop (${fmt(c.pl[1])}–${fmt(c.pl[2])})` : pl<c.pl[0]||pl>c.pl[3] ? `${fmt(pl)} mm/an hors des limites (${fmt(c.pl[0])}–${fmt(c.pl[3])})` : `${fmt(pl)} mm/an hors optimum (${fmt(c.pl[1])}–${fmt(c.pl[2])})`;
    if (pl>c.pl[2]) reco.push("Pluie au-dessus de l'optimum : risque de maladies fongiques, choisir des variétés tolérantes, bien espacer et drainer.");
  }
  facts.push(['Pluie annuelle', plPts, 25, plTxt]);
  // Calendrier / saison sèche
  const cal=calendrier(c, K.mens); let ssPts, ssTxt;
  if (c.per || !cal){
    const m=K.secs;
    if (c.per && c.sec===0) ssPts = m<=3?10:m===4?5:0;
    else if (c.per && c.sec===2) ssPts = m>=5?10:m===4?7:m===3?4:2;
    else if (c.sec===2) ssPts = m>=3?10:m===2?7:5;
    else ssPts = m<=5?10:7;
    ssTxt = `${m} mois sous 50 mm${c.per&&c.sec===0?' (pérenne sensible au déficit hydrique)':''}${c.sec===2&&c.per?' (a besoin d\'une saison sèche marquée pour fleurir)':''}`;
    if (c.per && c.sec===0 && m>=4) reco.push("Saison sèche marquée pour une pérenne : ombrage temporaire (bananier), paillage, irrigation de la pépinière et des jeunes plants la première année.");
  } else if (cal.irr){ ssPts=10; ssTxt=cal.txt; }
  else { ssPts=cal.pts; ssTxt=cal.txt; if(cal.ok<cal.n) reco.push("Pluie insuffisante sur une partie du cycle : variétés précoces, semis dès l'installation des pluies, paillage, irrigation d'appoint si possible."); }
  facts.push([c.per||!cal?'Saison sèche':'Calendrier', ssPts, 10, ssTxt]);
  // Contraintes
  let pen=0; const pens=[];
  const P=(n,why)=>{ if(n>0){ pen+=n; pens.push(`−${n} ${why}`); } };
  if (/al échangeable|ph bas|acidit/.test(ct)) P(c.ph[1]>=5.5?6:2, 'acidité / aluminium');
  if (/déficit p/.test(ct)) { P(fam.includes('légumineuse')?4:2, 'déficit en phosphore'); reco.push("Fumure phosphatée de fond : phosphate naturel ou TSP, localisé au semis ou à la plantation."); }
  if (/lessivage/.test(ct)) { P(2, 'lessivage'); reco.push("Fractionner l'azote et la potasse en 2 ou 3 apports pour limiter les pertes par lessivage."); }
  if (/faible rétention/.test(ct)) { P(c.drainE?1:5, 'faible rétention en eau'); reco.push("Sol filtrant : paillage, apport de matière organique, irrigation d'appoint en période sèche."); }
  if (/salinit/.test(ct)) { P(c.sal?2:8, 'salinité'); if(!c.sal) reco.push("Salinité : éviter les parcelles proches de la lagune ou de la mer, cultiver sur billons, ne pas irriguer avec une eau saumâtre."); }
  if (/engorgement/.test(ct)) { P(c.drainI?0:(fam.includes('tubercule')?8:6), 'engorgement'); if(!c.drainI) reco.push("Risque d'engorgement : planter sur buttes ou billons hauts et ouvrir des drains."); }
  if (/sécheresse|sèche|déficit hydrique/.test(ct)) { const k=/sévère|très|longue/.test(ct)?1.5:1; P(Math.round((c.sec===0?6:c.sec===1?3:0)*k), 'sécheresse'); }
  if (/érosion|relief/.test(ct)) { P(c.per?1:3, 'érosion / relief'); reco.push("Lutter contre l'érosion : cultures en courbes de niveau, haies vives ou bandes enherbées, couverture permanente du sol."); }
  if (/compaction/.test(ct)) { P(fam.includes('tubercule')?4:2, 'compaction'); reco.push("Compaction : travail du sol léger ou décompactage, plantes de couverture à racine pivotante."); }
  if (/faible mo|pauvre en mo/.test(ct)) P(2, 'sol pauvre en MO');
  if (/faible fertilit/.test(ct)) P(2, 'faible fertilité');
  if (/pollution|anthropique/.test(ct)) { P(c.feuille||fam.includes('maraîch')?10:3, 'pollution possible'); reco.push("Zone périurbaine : faire analyser les métaux lourds avant toute culture maraîchère et ne pas irriguer avec des eaux usées."); }
  facts.push(['Contraintes du sol', Math.max(0,20-pen), 20, pens.length?pens.join(' · '):'aucune contrainte pénalisante']);
  let score=facts.reduce((s,f)=>s+f[1],0);
  let cap=100, capWhy=null;
  for (const [nm,pts,max] of facts.filter(f=>f[0]==='pH'||f[0]==='Pluie annuelle')){
    if (pts===0 && cap>44){ cap=44; capWhy=`${nm} hors des limites de la culture`; }
    else if (pts<max*0.5 && cap>64){ cap=64; capWhy=`${nm} très défavorable`; }
  }
  if (cal && !cal.irr && cal.ok===0 && cap>44){ cap=44; capWhy='aucune fenêtre de semis suffisamment arrosée'; }
  if (c.per && c.sec===0){ const m=K.secs; if (m>=6 && cap>44){ cap=44; capWhy=`${m} mois secs : trop long pour cette pérenne`; } else if (m>=5 && cap>59){ cap=59; capWhy=`${m} mois secs : trop long pour cette pérenne sans irrigation`; } }
  if (c.per && c.sec===2 && K.secs<=2 && cap>64){ cap=64; capWhy='pas de vraie saison sèche pour la floraison'; }
  if (score>cap){ facts.push(['Facteur limitant', cap-score, 0, `score plafonné à ${cap} : ${capWhy}`]); score=cap; }
  if (c.alt && loc.zone!=='Zone Montagneuse Ouest'){ score-=25; facts.push(['Altitude', -25, 0, `culture de climat frais (optimum ${fmt(c.ecoT[0])}–${fmt(c.ecoT[1])} °C) hors zone montagneuse`]); reco.push("Culture de climat frais : à réserver à la zone montagneuse de l'Ouest (Man, Biankouma, Danané)."); }
  if (!S.over && !loc.perso) reco.push("Sol issu de la moyenne de zone : confirmer par une analyse de la parcelle (rubrique « Saisir mon analyse de sol »).");
  return { score:Math.max(0,Math.min(100,Math.round(score))), facts, reco:[...new Set(reco)], cal, K };
}

/* ================= Navigation ================= */
function show(v){
  if (v==='qual' && !IS_ADMIN) v='diag';
  document.querySelectorAll('nav.tabs button').forEach(b=>b.setAttribute('aria-selected', b.dataset.v===v));
  document.querySelectorAll('section.view').forEach(s=>s.hidden = s.id!=='v-'+v);
  pref.set('agrodiag.tab', v);
  if (v==='cult') renderCult();
  if (v==='tech') renderTech();
  if (v==='compte') renderCompte();
  if (v==='qual') renderAdmin();
  window.scrollTo(0,0);
}
document.querySelectorAll('nav.tabs button').forEach(b=>b.addEventListener('click',()=>show(b.dataset.v)));

/* ================= Que planter ici ================= */
const fams=[...new Set(ACTIVE.map(c=>c.fam))].sort((a,b)=>a.localeCompare(b,'fr'));
$('#selFam').innerHTML='<option value="">Toutes familles</option>'+fams.map(f=>`<option>${esc(f)}</option>`).join('');
const zonesList=Object.keys(D.zoneVals).sort((a,b)=>a.localeCompare(b,'fr'));
$('#nlZone').innerHTML=zonesList.map(z=>`<option>${esc(z)}</option>`).join('');
const CONTR=['Al échangeable','pH bas','Déficit P','lessivage','Faible rétention eau','Salinité','Engorgement','Sécheresse','Érosion','Compaction','Faible MO','Pollution'];
$('#nlContr').innerHTML=CONTR.map((c,i)=>`<label class="chk pill p-neutral"><input type="checkbox" value="${esc(c)}" id="nlc${i}"> ${esc(c)}</label>`).join('');
function refreshLocs(){
  const regs=[...new Set(allLocs().map(l=>l.reg))].sort((a,b)=>a.localeCompare(b,'fr'));
  const cur=$('#selReg').value;
  $('#selReg').innerHTML='<option value="">Toutes les régions</option>'+regs.map(r=>`<option>${esc(r)}</option>`).join('');
  if (regs.includes(cur)) $('#selReg').value=cur;
  $('#regList').innerHTML=regs.map(r=>`<option value="${esc(r)}">`).join('');
  if (S.loc) fillLocs();
}
function fillLocs(){
  const r=$('#selReg').value;
  const ls=allLocs().filter(l=>!r||l.reg===r).sort((a,b)=>a.nom.localeCompare(b.nom,'fr'));
  $('#selLoc').innerHTML=ls.map(l=>`<option value="${esc(l.id)}">${esc(l.nom)}${l.perso?' (mon village)':''}${r?'':' — '+esc(l.reg)}</option>`).join('');
  if (!ls.find(l=>String(l.id)===String(S.loc?.id))) setLoc(ls[0]?.id); else { $('#selLoc').value=S.loc.id; S.loc=findLoc(S.loc.id); renderLoc(); }
}
function setLoc(id){
  const l=findLoc(id); if(!l) return;
  S.loc=l; S.over=null; S.crop=null; $('#selLoc').value=l.id; pref.set('agrodiag.loc', l.id);
  const nr=Object.keys(l.ref).length; $('#onlyRef').checked=nr>0; $('#onlyRef').disabled=!nr;
  renderLoc();
}
$('#selReg').addEventListener('change', fillLocs);
$('#selLoc').addEventListener('change', e=>setLoc(e.target.value));
$('#onlyRef').addEventListener('change', renderCrops);
$('#selFam').addEventListener('change', renderCrops);

function monthBars(mens, hi, need, opts={}){
  const W=600, H=opts.h||120, pad=22, bw=(W-pad*2)/12, max=Math.max(...mens, need||0, 50)*1.1;
  const y=v=>H-18-(v/max)*(H-34);
  const bars=mens.map((v,i)=>`<rect x="${pad+i*bw+3}" y="${y(v)}" width="${bw-6}" height="${Math.max(0,H-18-y(v))}" rx="2" fill="${hi&&hi.includes(i)?'var(--accent)':'var(--line)'}"/>
    <text x="${pad+i*bw+bw/2}" y="${H-4}" font-size="11" text-anchor="middle" fill="var(--muted)">${MOIS[i]}</text>
    <text x="${pad+i*bw+bw/2}" y="${y(v)-3}" font-size="10" text-anchor="middle" fill="var(--muted)" font-family="JetBrains Mono, monospace">${Math.round(v)}</text>`).join('');
  const line = need ? `<line x1="${pad}" x2="${W-pad}" y1="${y(need)}" y2="${y(need)}" stroke="var(--warn)" stroke-dasharray="4 3"/><text x="${W-pad}" y="${y(need)-4}" font-size="10" text-anchor="end" fill="var(--warn)">${need} mm</text>` : '';
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Pluie mensuelle en mm" style="width:100%;height:auto;display:block">${bars}${line}</svg>`;
}

function renderLoc(){
  const l=S.loc; if(!l) return;
  const s=soilOf(l), o=S.over, K=climOf(l), rel=reliability(l);
  const stNote = l.statut==='corrige' ? `<div class="notice ok" style="margin-top:12px">Ligne corrigée${l.orig&&l.orig!==l.nom?` (origine : « ${esc(l.orig)} »)`:''}. ${esc(l.note)}</div>`
    : l.statut==='ajoutee' ? `<div class="notice warn" style="margin-top:12px">${esc(l.note)} Aucune liste de cultures pratiquées : toutes les cultures sont évaluées.</div>`
    : l.perso ? `<div class="notice" style="margin-top:12px">${esc(l.note)} <button class="btn ghost danger" id="delPerso">Supprimer ce village</button></div>` : '';
  $('#locInfo').innerHTML=`
    <div class="soil">
      <div><div class="lab">Zone agro-climatique</div><div>${esc(l.zone)}</div></div>
      <div><div class="lab">Type de sol</div><div>${esc(l.sol)}</div></div>
      <div><div class="lab">pH</div><div class="v ${o?.ph!=null?'edited':''}">${fmt(s.ph,1)}</div></div>
      <div><div class="lab">MO %</div><div class="v ${o?.mo!=null?'edited':''}">${fmt(s.mo,1)}</div></div>
      <div><div class="lab">Drainage</div><div class="v ${o?.drain!=null?'edited':''}" style="font-family:var(--font-body);font-size:15px">${esc(s.drain)}</div></div>
      <div><div class="lab">Pluie annuelle</div><div class="v">${fmt(K.pluie)} <span class="small muted">mm</span></div></div>
      <div><div class="lab">Mois &lt; 50 mm</div><div class="v">${K.secs}</div></div>
    </div>
    <div style="margin-top:12px">${monthBars(K.mens, null, null)}<div class="small muted">Pluie mensuelle (mm) · source : ${esc(K.src)}</div></div>
    <div class="constr">${(l.contr||'').split(',').map(x=>x.trim()).filter(Boolean).map(x=>`<span class="pill p-neutral">${esc(x)}</span>`).join('')}
      ${l.perso?'':`<span class="pill p-acc">${Object.keys(l.ref).length} cultures pratiquées dans la zone</span>`}<span class="pill ${rel.cls}">${rel.lab}</span></div>
    <p class="small muted" style="margin:6px 0 0">${esc(rel.txt)}</p>
    ${stNote}
    <details class="override" ${o?'open':''}>
      <summary style="cursor:pointer;font-weight:600">Saisir mon analyse de sol</summary>
      <p class="small muted" style="margin:6px 0 10px">Saisissez les résultats de laboratoire de la parcelle pour recalculer tous les scores.</p>
      <div class="row">
        <div class="field"><label for="oPh">pH eau</label><input type="number" id="oPh" step="0.1" min="3" max="10" value="${o?.ph??''}" placeholder="${fmt(l.ph,1)}"></div>
        <div class="field"><label for="oMo">MO (%)</label><input type="number" id="oMo" step="0.1" min="0" max="20" value="${o?.mo??''}" placeholder="${fmt(l.mo,1)}"></div>
        <div class="field"><label for="oDr">Drainage</label><select id="oDr"><option value="">${esc(l.drain)} (actuel)</option>${['Bon','Moyen','Rapide','Variable'].map(d=>`<option ${o?.drain===d?'selected':''}>${d}</option>`).join('')}</select></div>
      </div>
      <div class="row" style="margin-top:10px"><button class="btn primary" id="oApply">Recalculer</button><button class="btn ghost" id="oReset">Revenir aux valeurs de départ</button></div>
    </details>
    <details class="override">
      <summary style="cursor:pointer;font-weight:600">Données climatiques NASA POWER ou SODEXAM</summary>
      <ol class="small" style="margin:8px 0 10px;padding-left:18px;max-width:70ch">
        <li>Ouvrez <a href="https://power.larc.nasa.gov/data-access-viewer/" target="_blank" rel="noopener">NASA POWER Data Access Viewer</a> (connexion nécessaire pour cette étape seulement).</li>
        <li>Choisissez « Agroclimatology » et « Single Point », puis cliquez sur la localité sur la carte.</li>
        <li>Choisissez « Climatology », cochez « Precipitation Corrected » (PRECTOTCORR), format CSV, puis « Submit » et téléchargez le fichier.</li>
        <li>Importez le fichier ici : l'app calcule la pluie de chaque mois, le total annuel et les mois secs.</li>
      </ol>
      <div class="field"><label for="powFile">Fichier NASA POWER (CSV ou JSON)</label><input type="file" id="powFile" accept=".csv,.json,.txt,text/csv,application/json"></div>
      <p class="small muted" style="margin:12px 0 4px">Ou saisissez la pluie mensuelle d'une station SODEXAM (mm, de janvier à décembre, séparés par des espaces ou des points-virgules) :</p>
      <div class="row" style="align-items:flex-end">
        <div class="field" style="flex-basis:320px"><label for="mMens">12 valeurs mensuelles</label><input type="text" id="mMens" placeholder="ex. 15 40 85 125 150 160 110 90 170 140 50 20"></div>
        <div class="field" style="flex:0 0 auto"><button class="btn" id="mSave">Enregistrer</button></div>
      </div>
      ${S.climat[l.id]?`<div class="row" style="margin-top:8px"><button class="btn ghost danger" id="climReset">Revenir aux valeurs de référence</button></div>`:''}
      <p class="small" id="climMsg" style="margin:8px 0 0"></p>
    </details>`;
  $('#powFile').onchange=e=>importPower(e.target.files[0]);
  $('#mSave').onclick=()=>{
    const v=$('#mMens').value.trim().split(/[\s;,]+/).filter(Boolean).map(x=>Number(x.replace(',','.')));
    if (v.length!==12 || v.some(x=>!isFinite(x)||x<0||x>1500)) return climMsg('Saisissez exactement 12 valeurs entre 0 et 1 500 mm.', true);
    const pluie=Math.round(v.reduce((a,b)=>a+b,0));
    if (pluie<100||pluie>6000) return climMsg(`Total annuel incohérent (${pluie} mm).`, true);
    saveClimat({pluie, secs:v.filter(x=>x<50).length, mensuel:v.map(Math.round), source:'station SODEXAM (saisie)'});
  };
  if ($('#climReset')) $('#climReset').onclick=async()=>{ try{ await S.store.del('climat', String(l.id)); toast('Valeurs de référence rétablies'); }catch(e){ toast(storeErr(e)); } };
  if ($('#delPerso')) $('#delPerso').onclick=()=>{
    const b=$('#delPerso'); b.outerHTML=`<span class="inline-confirm">Supprimer ce village ? <button class="btn danger" id="dpYes">Oui</button><button class="btn ghost" id="dpNo">Non</button></span>`;
    $('#dpNo').onclick=renderLoc;
    $('#dpYes').onclick=async()=>{ try{ await S.store.del('localites', l.pid); S.loc=null; toast('Village supprimé'); refreshLocs(); fillLocs(); }catch(e){ toast(storeErr(e)); } };
  };
  $('#oApply').onclick=()=>{
    const ph=parseFloat($('#oPh').value), mo=parseFloat($('#oMo').value), dr=$('#oDr').value;
    if(!isNaN(ph)&&(ph<3||ph>10)){ toast('Le pH doit être compris entre 3 et 10'); $('#oPh').focus(); return; }
    if(!isNaN(mo)&&(mo<0||mo>20)){ toast('La MO doit être comprise entre 0 et 20 %'); $('#oMo').focus(); return; }
    S.over={ ph:isNaN(ph)?null:ph, mo:isNaN(mo)?null:mo, drain:dr||null };
    if (S.over.ph==null && S.over.mo==null && !S.over.drain) S.over=null;
    renderLoc(); toast(S.over?'Scores recalculés avec votre analyse':'Valeurs de départ rétablies');
  };
  $('#oReset').onclick=()=>{ S.over=null; renderLoc(); };
  renderCrops();
}
function climMsg(m,bad){ const e=$('#climMsg'); if(e){ e.textContent=m; e.style.color=bad?'var(--bad)':'var(--good)'; } }
const DAYS=[31,28.25,31,30,31,30,31,31,30,31,30,31], MKEYS=['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
function parsePower(text){
  let vals=null, isSum=false, unit='';
  const t=String(text||'').replace(/^﻿/,'').trim();
  if (t.startsWith('{')){
    const j=JSON.parse(t), p=j?.properties?.parameter||{};
    const key=Object.keys(p).find(k=>/^PRECTOT/.test(k)); if(!key) throw new Error('Paramètre PRECTOTCORR absent du fichier.');
    isSum=/_SUM$/.test(key); unit=String(j?.parameters?.[key]?.units||'');
    vals=MKEYS.map(m=>Number(p[key][m]));
  } else {
    const lines=t.split(/\r?\n/), hi=lines.findIndex(x=>/(^|,)\s*JAN\s*(,|$)/i.test(x)&&/DEC/i.test(x));
    if (hi<0) throw new Error("Format non reconnu : utilisez le fichier « Climatology » de NASA POWER.");
    const hdr=lines[hi].split(',').map(x=>x.trim().toUpperCase());
    const row=lines.slice(hi+1).map(x=>x.split(',')).find(c=>/^PRECTOT/i.test((c[0]||'').trim()));
    if (!row) throw new Error('Ligne PRECTOTCORR absente du fichier.');
    isSum=/_SUM$/i.test(row[0].trim());
    unit=lines.slice(0,hi).find(x=>/PRECTOT/i.test(x))||'';
    vals=MKEYS.map(m=>Number(row[hdr.indexOf(m)]));
  }
  if (vals.some(v=>!isFinite(v)||v<0)) throw new Error('Valeurs mensuelles manquantes ou négatives (−999 signifie donnée absente).');
  const perDay=!isSum && !/mm\/month/i.test(unit);
  const mens=vals.map((v,i)=>perDay? v*DAYS[i] : v);
  const pluie=Math.round(mens.reduce((a,b)=>a+b,0));
  if (pluie<100||pluie>6000) throw new Error(`Total annuel calculé incohérent (${pluie} mm) : vérifiez le fichier.`);
  return { pluie, secs:mens.filter(v=>v<50).length, mensuel:mens.map(v=>Math.round(v)) };
}
async function importPower(file){
  if(!file) return;
  try{ const r=parsePower(await file.text()); saveClimat({...r, source:'NASA POWER (climatologie)'}); }
  catch(e){ climMsg(e.message||'Lecture du fichier impossible.', true); }
}
async function saveClimat(rec){
  const l=S.loc; rec.date=new Date().toISOString(); rec.localite=l.nom;
  try{ if(S.user?.id) rec.auteur=await S.user.id(); }catch(_){}
  try{ await S.store.set('climat', String(l.id), rec); toast(`Climat enregistré : ${fmt(rec.pluie)} mm, ${rec.secs} mois sous 50 mm`); }
  catch(e){ climMsg(storeErr(e), true); }
}
$('#nlSave').onclick=async()=>{
  const msg=(m,bad)=>{ $('#nlMsg').textContent=m; $('#nlMsg').style.color=bad?'var(--bad)':'var(--good)'; };
  const nom=$('#nlNom').value.trim(), reg=$('#nlReg').value.trim()||'Mes villages', zone=$('#nlZone').value;
  const ph=parseFloat($('#nlPh').value), mo=parseFloat($('#nlMo').value);
  if (!nom) return msg('Indiquez le nom du village.', true);
  if (!(ph>=3&&ph<=10)) return msg('Le pH doit être compris entre 3 et 10.', true);
  if (!(mo>=0&&mo<=20)) return msg('La MO doit être comprise entre 0 et 20 %.', true);
  const contr=[...document.querySelectorAll('#nlContr input:checked')].map(i=>i.value).join(', ');
  const rec={nom, reg, zone, ph, mo, drain:$('#nlDr').value, sol:$('#nlSol').value.trim(), contr, date:new Date().toISOString()};
  try{ const id=await S.store.add('localites', rec); msg('Village ajouté.'); ['#nlNom','#nlPh','#nlMo','#nlSol'].forEach(s=>$(s).value=''); document.querySelectorAll('#nlContr input').forEach(i=>i.checked=false);
    setTimeout(()=>{ refreshLocs(); $('#selReg').value=reg; fillLocs(); setLoc('p_'+id); }, 50); }
  catch(e){ msg(storeErr(e), true); }
};

function renderCrops(){
  const l=S.loc, only=$('#onlyRef').checked&&!$('#onlyRef').disabled, fam=$('#selFam').value;
  let items=ACTIVE.filter(c=>(!only||l.ref[c.nom]!=null)&&(!fam||c.fam===fam)).map(c=>({c, e:evaluate(l,c)}));
  items.sort((a,b)=>(b.e.score??-1)-(a.e.score??-1));
  if (!items.length){ $('#cropList').innerHTML='<li class="empty">Aucune culture pour ce filtre.</li>'; $('#detail').innerHTML=''; return; }
  if (!S.crop || !items.find(i=>i.c.nom===S.crop)) S.crop=items[0].c.nom;
  $('#cropList').innerHTML=items.map(({c,e})=>{ const d=decision(e.score);
    const when = e.cal && !e.cal.irr && e.cal.ok>0 ? ` · semis ${MOIS[e.cal.start].toLowerCase()}${e.cal.second!=null?' et '+MOIS[e.cal.second].toLowerCase():''}` : e.cal?.irr ? ' · contre-saison' : '';
    return `<li><button data-c="${esc(c.nom)}" aria-current="${c.nom===S.crop}">
      <span class="cn">${esc(c.nom)}<small>${esc(c.fam)}${when}${!l.perso&&Object.keys(l.ref).length&&l.ref[c.nom]==null?' · non pratiquée ici':''}</small></span>
      <span class="bar" aria-hidden="true"><i style="width:${e.score??0}%;background:${d.col}"></i></span>
      <span style="display:flex;gap:8px;align-items:center;justify-content:flex-end"><span class="sc">${e.score??'—'}</span><span class="pill ${d.cls}">${d.lab}</span></span>
    </button></li>`; }).join('');
  $('#cropList').querySelectorAll('button').forEach(b=>b.onclick=()=>{ S.crop=b.dataset.c; renderCrops(); if (window.innerWidth<920) $('#detail').scrollIntoView({behavior:'smooth',block:'start'}); });
  renderDetail();
}
function phSvg(c, ph){
  const x=v=>20+(v-3.5)/(9-3.5)*560;
  const ticks=[4,5,6,7,8,9].map(t=>`<line x1="${x(t)}" x2="${x(t)}" y1="38" y2="44" stroke="var(--muted)"/><text x="${x(t)}" y="58" font-size="12" text-anchor="middle" fill="var(--muted)" font-family="JetBrains Mono, monospace">${t}</text>`).join('');
  const cx=v=>Math.min(9,Math.max(3.5,v));
  return `<svg viewBox="0 0 600 66" role="img" aria-label="pH du sol ${fmt(ph,1)} par rapport à la plage de la culture" style="width:100%;height:auto;display:block">
    <rect x="${x(3.5)}" y="22" width="${x(9)-x(3.5)}" height="14" rx="3" fill="var(--sunk)"/>
    <rect x="${x(cx(c.ph[0]))}" y="22" width="${x(cx(c.ph[3]))-x(cx(c.ph[0]))}" height="14" fill="var(--warn-bg)"/>
    <rect x="${x(cx(c.ph[1]))}" y="22" width="${x(cx(c.ph[2]))-x(cx(c.ph[1]))}" height="14" fill="var(--good-bg)" stroke="var(--good)" stroke-width="1"/>
    ${ticks}
    <line x1="${x(cx(ph))}" x2="${x(cx(ph))}" y1="14" y2="40" stroke="var(--fg)" stroke-width="2.5"/>
    <text x="${Math.min(560,Math.max(40,x(cx(ph))))}" y="11" font-size="12" text-anchor="middle" fill="var(--fg)" font-weight="600" font-family="JetBrains Mono, monospace">sol ${fmt(ph,1)}</text>
  </svg>`;
}
function engPlan(c, surf){
  if (!c.engF || !c.engKg) return null;
  const kg=c.engKg*(surf||1), sacs=kg/50;
  return { txt:`${c.engF} à ${fmt(c.engKg)} kg/ha`, kg, sacs };
}
function renderDetail(){
  const l=S.loc, c=CULT[S.crop]; if(!c) return;
  const e=evaluate(l,c), d=decision(e.score), s=soilOf(l);
  const nR=D.risques.filter(r=>r.cult===c.nom), nPb=nR.filter(r=>r.st!=='ok').length;
  const old=l.ref[c.nom], ep=engPlan(c,1);
  $('#detail').innerHTML=`
    <div class="lab">${esc(l.nom)}</div>
    <h2>${esc(c.nom)}</h2>
    <div class="big"><span class="n">${e.score??'—'}</span><span class="muted">/ 100</span><span class="pill ${d.cls}">${d.lab}</span></div>
    <div class="small muted">${old!=null?`Pratiquée dans la zone selon le fichier Excel (ancien score : ${old}).`:l.perso?'Village ajouté par vous.':'Non listée pour cette localité dans le fichier Excel.'}</div>
    ${c.horsModele?'':`<div class="phscale">${phSvg(c, s.ph)}<div class="small muted">Vert : optimum Ecocrop · Ocre : tolérable · Trait : pH du sol</div></div>`}
    ${e.cal?`<div class="sub"><h3>Calendrier de semis</h3>${monthBars(e.K.mens, e.cal.months, e.cal.irr?null:e.cal.need, {h:110})}<p class="small" style="margin:4px 0 0">${esc(e.cal.txt)}</p></div>`:''}
    ${e.facts.length?`<table class="facts"><tbody>${e.facts.map(f=>`<tr><td>${f[0]}</td><td class="muted">${esc(f[3])}</td><td class="pts">${Math.round(f[1])}${f[2]?' / '+f[2]:''}</td></tr>`).join('')}</tbody></table>`:''}
    <div class="sub"><h3>Amendements et pratiques recommandés</h3><ul class="reco">${e.reco.map(r=>`<li>${esc(r)}</li>`).join('')}</ul></div>
    <div class="sub"><h3>Repères techniques</h3>
      <dl class="kv">
        <dt>Fumure de fond</dt><dd>${ep?`${esc(ep.txt)} soit ${fmt(ep.sacs,1)} sacs de 50 kg/ha`:esc(c.eng||'à renseigner')}</dd>
        <dt>Rendement</dt><dd class="num">${c.rmoy!=null?`${fmt(c.rmoy,1)} t/ha (max ${fmt(c.rmax,1)})`:'à renseigner'}</dd>
        <dt>Cycle</dt><dd>${c.per?'pérenne':`environ ${fmt(c.cycle)} jours`} · ${esc(c.saison)}</dd>
        <dt>Débouché</dt><dd>${esc(c.com)}</dd>
        <dt>Risques phyto</dt><dd>${nR.length?`${nR.length} documentés${nPb?` · <span style="color:var(--bad);font-weight:600">${nPb} produit(s) à revoir</span>`:''}`:'aucun documenté'}</dd>
        ${c.eco?`<dt>Référence FAO</dt><dd class="small">Ecocrop : ${esc(c.eco)}</dd>`:''}
      </dl>
    </div>
    <div class="row" style="margin-top:16px">
      <button class="btn primary" id="goTech">Voir la fiche technique</button>
      <button class="btn" id="goPhy">Où planter cette culture ?</button>
      <button class="btn" id="goCalc">Calculer la rentabilité</button>
    </div>
    <div class="sub" id="saveBox"></div>`;
  $('#goTech').onclick=()=>{ TECH.loc=l.id; TECH.crop=c.nom; show('tech'); };
  $('#goPhy').onclick=()=>{ $('#selCult').value=c.nom; show('cult'); };
  $('#goCalc').onclick=()=>{ if (calcCults.find(x=>x.nom===c.nom)) { $('#cCult').value=c.nom; loadCalc(); } show('calc'); };
  renderSaveBox(e,d);
}
function renderSaveBox(e,d){
  const box=$('#saveBox'); if(!box) return;
  box.innerHTML=`<h3>Enregistrer la fiche terrain</h3>
    <div class="row"><div class="field"><label for="fProd">Producteur / OP</label><input type="text" id="fProd" maxlength="120" placeholder="Nom du producteur ou de l'OP"></div>
    <div class="field"><label for="fParc">Parcelle</label><input type="text" id="fParc" maxlength="80" placeholder="Code ou nom de la parcelle"></div></div>
    <div class="field" style="margin-top:8px"><label for="fNote">Observation</label><textarea id="fNote" rows="2" maxlength="1000" placeholder="Observation de terrain (facultatif)"></textarea></div>
    <div class="row" style="margin-top:10px;align-items:center"><button class="btn primary" id="fSave">Enregistrer la fiche</button><span class="small muted">${S.over?'Avec votre analyse de sol.':'Avec les valeurs de sol actuelles.'}</span></div>`;
  $('#fSave').onclick=async()=>{
    const prod=$('#fProd').value.trim();
    if(!prod){ toast("Indiquez le producteur ou l'OP"); $('#fProd').focus(); return; }
    const s=soilOf(S.loc), K=climOf(S.loc);
    const doc={ conseiller:profilNom(), contactConseiller:PROFIL?.contact||'', producteur:prod, parcelle:$('#fParc').value.trim(), note:$('#fNote').value.trim(), localite:S.loc.nom, localiteId:String(S.loc.id), region:S.loc.reg,
      culture:S.crop, ph:s.ph, mo:s.mo, drainage:s.drain, analyse:!!S.over, pluie:K.pluie, sourceClimat:K.src, semis:e.cal&&!e.cal.irr&&e.cal.ok>0?MOIS_L[e.cal.start]:null,
      score:e.score, decision:d.lab, fiabilite:reliability(S.loc).lab, date:new Date().toISOString() };
    try{ if(S.user?.id) doc.auteur=await S.user.id(); }catch(_){}
    $('#fSave').disabled=true;
    try{ await S.store.add('fiches', doc); toast('Fiche enregistrée'); $('#fProd').value=''; $('#fParc').value=''; $('#fNote').value=''; }
    catch(err){ toast(storeErr(err)); }
    finally{ $('#fSave').disabled=false; }
  };
}

/* ================= Où planter ================= */
const phyCults=[...new Set([...ACTIVE.map(c=>c.nom), ...D.risques.map(r=>r.cult)])].sort((a,b)=>a.localeCompare(b,'fr'));
$('#selCult').innerHTML=phyCults.map(n=>`<option>${esc(n)}</option>`).join('');
['#selCult','#selPhyFilter','#selWhere'].forEach(s=>$(s).addEventListener('change', renderCult));
function renderCult(){
  const n=$('#selCult').value, c=CULT[n];
  pref.set('agrodiag.cult', n);
  if (c && !c.horsModele){
    const saved=S.over; S.over=null;
    const rows=allLocs().map(l=>({l, e:evaluate(l,c,{ph:l.ph,mo:l.mo,drain:l.drain})})).sort((a,b)=> b.e.score-a.e.score || (c.sec===2 ? b.e.K.secs-a.e.K.secs : c.sec===0 ? a.e.K.secs-b.e.K.secs : 0) || a.l.nom.localeCompare(b.l.nom,'fr'));
    S.over=saved;
    const fav=rows.filter(r=>r.e.score>=75).length;
    const lim=$('#selWhere').value==='all'?rows.length:20;
    $('#cultCard').innerHTML=`
      <div class="lab">${esc(c.fam)}</div><h2 style="font-size:22px">${esc(c.nom)}</h2>
      <dl class="kv" style="margin-top:10px">
        <dt>Rendement moyen / max</dt><dd class="num">${c.rmoy!=null?`${fmt(c.rmoy,1)} / ${fmt(c.rmax,1)} t/ha`:'à renseigner'}</dd>
        <dt>Cycle</dt><dd>${c.per?'pérenne':`environ ${fmt(c.cycle)} jours`} · ${esc(c.saison)}</dd>
        <dt>pH (FAO Ecocrop)</dt><dd class="num">optimum ${fmt(c.ph[1],1)}–${fmt(c.ph[2],1)} · limites ${fmt(c.ph[0],1)}–${fmt(c.ph[3],1)}</dd>
        <dt>Pluie annuelle</dt><dd class="num">optimum ${fmt(c.pl[1])}–${fmt(c.pl[2])} mm · limites ${fmt(c.pl[0])}–${fmt(c.pl[3])} mm${c.irr?' · conduite avec maîtrise de l\'eau':''}</dd>
        <dt>Drainage toléré</dt><dd>bon${c.drainI?', imparfait':''}${c.drainE?', sol filtrant':''}</dd>
        <dt>Salinité</dt><dd>${c.sal?'tolérance moyenne':'peu tolérante'}</dd>
        <dt>Fumure de fond</dt><dd>${esc(c.eng||'à renseigner')}</dd>
        <dt>Référence FAO</dt><dd class="small">${esc(c.eco||'')}</dd>
        <dt>Bilan</dt><dd>Favorable (≥ 75) dans ${fav} localités sur ${rows.length}.</dd>
      </dl>`;
    $('#whereList').innerHTML=`<div class="tbl-wrap"><table class="t"><thead><tr><th>#</th><th>Localité</th><th>Région</th><th>Score</th><th>Semis conseillé</th><th>Facteur le plus faible</th><th></th></tr></thead><tbody>
      ${rows.slice(0,lim).map((r,i)=>{ const d=decision(r.e.score); const weak=r.e.facts.filter(f=>f[2]>0).map(f=>[f[0],f[1]/f[2]]).sort((a,b)=>a[1]-b[1])[0];
        const when=r.e.cal?(r.e.cal.irr?'contre-saison':r.e.cal.ok>0?MOIS_L[r.e.cal.start]+(r.e.cal.second!=null?' / '+MOIS_L[r.e.cal.second]:''):'aucun'):'—';
        return `<tr><td class="num">${i+1}</td><td><b>${esc(r.l.nom)}</b>${r.l.perso?' <span class="pill p-acc">mon village</span>':''}</td><td>${esc(r.l.reg)}</td>
        <td><span class="num">${r.e.score}</span> <span class="pill ${d.cls}">${d.lab}</span></td><td>${esc(when)}</td><td class="small">${weak?`${esc(weak[0])} (${Math.round(weak[1]*100)} %)`:''}</td>
        <td><button class="btn ghost" data-go="${esc(r.l.id)}">Voir</button></td></tr>`; }).join('')}
      </tbody></table></div>`;
    $('#whereList').querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>{ const l=findLoc(b.dataset.go); $('#selReg').value=l.reg; fillLocs(); setLoc(l.id); S.crop=n; $('#onlyRef').checked=false; renderCrops(); show('diag'); });
  } else {
    $('#cultCard').innerHTML = c ? `<div class="lab">${esc(c.fam)}</div><h2 style="font-size:22px">${esc(c.nom)}</h2><p class="small muted">Activité hors du modèle sol/climat.</p>`
      : `<div class="lab">Culture citée seulement dans Risques_Phyto</div><h2 style="font-size:22px">${esc(n)}</h2><p class="small muted">Absente de la feuille Cultures : pas de paramètres de score.</p>`;
    $('#whereList').innerHTML='<p class="small muted">Pas de classement possible pour cette culture.</p>';
  }
  const pbOnly=$('#selPhyFilter').value==='pb';
  const rs=D.risques.filter(r=>r.cult===n && (!pbOnly||r.st!=='ok'));
  const niv=v=>/très/i.test(v)?'p-bad':/élevé/i.test(v)?'p-risk':/modéré/i.test(v)?'p-cond':'p-neutral';
  $('#phyto').innerHTML = rs.length ? `<div class="tbl-wrap"><table class="t"><thead><tr><th>Problème</th><th>Risque</th><th>Produit / matière active</th><th>Période · stade</th><th>Pertes</th><th>Statut</th></tr></thead><tbody>
    ${rs.map(r=>`<tr class="st-${r.st}"><td><b>${esc(r.pb)}</b><div class="small muted">${esc(r.type)}${r.cult0!==r.cult?' · '+esc(r.cult0):''}</div>${r.corr?`<div class="small" style="margin-top:4px;color:var(--warn)">${esc(r.corr)}</div>`:''}</td>
      <td><span class="pill ${niv(r.niv)}">${esc(r.niv)}</span></td>
      <td>${esc(r.prod)}<div class="small muted">${esc(r.ma)}</div></td><td>${esc(r.per)}<div class="small muted">${esc(r.stade)}</div></td><td class="small">${esc(r.pertes)}</td>
      <td>${r.st==='ok'?'<span class="pill p-neutral">Pas d\'alerte</span>':`<span class="pill ${r.st==='interdit'?'p-bad':'p-cond'}">${r.st==='interdit'?'Interdit en CI':'À vérifier'}</span><div class="small" style="margin-top:4px;max-width:34ch">${esc(r.msg)}</div>${r.alt?`<div class="small" style="margin-top:6px;max-width:34ch"><b style="color:var(--good)">Alternative :</b> ${esc(r.alt)}</div>`:''}`}</td></tr>`).join('')}
    </tbody></table></div>` : `<p class="small muted">${pbOnly?'Aucun produit à problème pour cette culture.':'Aucun risque phytosanitaire documenté pour cette culture dans le fichier.'}</p>`;
}

/* ================= Rentabilité ================= */
const LINES=[['semences','Semences ou plants'],['engrais','Engrais'],['amendements','Amendements (chaux, compost)'],['phyto','Produits phytosanitaires'],['irrigation','Irrigation'],['mo',"Main-d'œuvre"],['autres','Autres (transport, sacs…)']];
const calcCults=ACTIVE.filter(c=>!c.horsModele);
$('#cCult').innerHTML=calcCults.map(c=>`<option>${esc(c.nom)}</option>`).join('');
$('#costLines').innerHTML=LINES.map(([k,lab])=>`<label for="cl-${k}">${lab}</label><input type="number" id="cl-${k}" min="0" step="1000" placeholder="0">`).join('');
function refreshCostMeta(){ const c=CULT[$('#cCult').value]; if(!c) return; const r=S.costs[slug(c.nom)]; $('#costMeta').textContent = r ? `Référence enregistrée le ${new Date(r.maj).toLocaleDateString('fr-FR')}` : 'Aucune référence enregistrée pour cette culture.'; }
function loadCalc(){
  const c=CULT[$('#cCult').value], ref=S.costs[slug(c.nom)];
  $('#cRend').value = ref?.rendement ?? c.rmoy ?? '';
  $('#cPrix').value = ref?.prix ?? '';
  LINES.forEach(([k])=>$('#cl-'+k).value = ref?.charges?.[k] ?? '');
  $('#cRendHint').textContent = c.rmoy!=null ? `Repère du fichier : ${fmt(c.rmoy,1)} t/ha en moyenne, ${fmt(c.rmax,1)} t/ha au maximum.` : 'Pas de rendement de référence dans le fichier.';
  renderEng(ref?.prixSac);
  refreshCostMeta(); calc();
}
function renderEng(prixSac){
  const c=CULT[$('#cCult').value], surf=parseFloat($('#cSurf').value)||1, ep=engPlan(c, surf);
  if(!ep){ $('#engBox').innerHTML='<span class="small muted">Pas de dose d\'engrais de fond chiffrée pour cette culture dans le fichier.</span>'; return; }
  $('#engBox').innerHTML=`<div class="small"><b>Fumure de fond :</b> ${esc(ep.txt)}, soit <b>${fmt(ep.kg)} kg</b> (${fmt(ep.sacs,1)} sacs de 50 kg) pour ${fmt(surf,1)} ha.</div>
    <div class="row" style="margin-top:8px;align-items:flex-end"><div class="field" style="max-width:240px"><label for="cSac">Prix du sac de 50 kg (FCFA)</label><input type="number" id="cSac" min="0" step="500" value="${prixSac??''}" placeholder="à saisir"></div>
    <span class="small muted" style="flex:1 1 200px">Le prix du sac remplit la ligne Engrais (fumure de fond seulement ; ajoutez l'urée ou la couverture à la main).</span></div>`;
  $('#cSac').oninput=()=>{ const p=parseFloat($('#cSac').value); if(p>=0){ $('#cl-engrais').value=Math.round(c.engKg/50*p); calc(); } };
}
function calc(){
  const c=CULT[$('#cCult').value];
  const ids=['cSurf','cRend','cPrix',...LINES.map(([k])=>'cl-'+k)];
  const neg=ids.filter(id=>parseFloat($('#'+id).value)<0);
  ids.forEach(id=>$('#'+id).style.borderColor = neg.includes(id)?'var(--bad)':'');
  if (neg.length){ $('#calcRes').innerHTML='<p class="small" style="color:var(--bad);grid-column:1/-1;margin:0">Les valeurs négatives ne sont pas acceptées : corrigez les champs en rouge.</p>'; $('#calcNote').textContent=''; return; }
  const surf=parseFloat($('#cSurf').value)||0, rend=parseFloat($('#cRend').value)||0, prix=parseFloat($('#cPrix').value)||0;
  const ch=LINES.reduce((s,[k])=>s+(parseFloat($('#cl-'+k).value)||0),0);
  const pb=rend*1000*prix, mb=pb-ch;
  const cell=(k,v,cls='')=>`<div><div class="k">${k}</div><div class="v ${cls}">${v}</div></div>`;
  $('#calcRes').innerHTML=cell('Production', `${fmt(rend*surf,1)} t`)+cell('Produit brut', prix?`${fmt(pb*surf)} F`:'prix à saisir')+
    cell('Charges', `${fmt(ch*surf)} F`)+cell('Marge brute', prix?`${fmt(mb*surf)} F`:'—', prix?(mb<0?'neg':'pos'):'')+
    cell('Marge par ha', prix?`${fmt(mb)} F`:'—', prix?(mb<0?'neg':'pos'):'')+cell('Rentabilité / charges', prix&&ch?`${fmt(mb/ch*100)} %`:'—')+
    cell("Rendement d'équilibre", prix&&ch?`${fmt(ch/(prix*1000),2)} t/ha`:'—')+cell("Prix d'équilibre", rend&&ch?`${fmt(ch/(rend*1000))} F/kg`:'—');
  const warn = c.rmax && rend>c.rmax*1.2 ? `Attention : ${fmt(rend,1)} t/ha dépasse le rendement maximal de référence (${fmt(c.rmax,1)} t/ha). ` : '';
  $('#calcNote').textContent = warn + (c.per?"Culture pérenne : le calcul porte sur une année en pleine production, sans les frais d'installation. ":'') + (ch===0?'Saisissez les charges par hectare pour obtenir la marge.':'');
}
$('#cCult').addEventListener('change', loadCalc);
$('#cSurf').addEventListener('input', ()=>{ renderEng($('#cSac')?.value||null); calc(); });
['cRend','cPrix',...LINES.map(([k])=>'cl-'+k)].forEach(id=>$('#'+id).addEventListener('input', calc));
$('#saveCost').onclick=async()=>{
  const c=CULT[$('#cCult').value];
  const doc={ culture:c.nom, rendement:parseFloat($('#cRend').value)||null, prix:parseFloat($('#cPrix').value)||null, prixSac:parseFloat($('#cSac')?.value)||null,
    charges:Object.fromEntries(LINES.map(([k])=>[k, parseFloat($('#cl-'+k).value)||0])), maj:new Date().toISOString() };
  doc.total=Object.values(doc.charges).reduce((a,b)=>a+b,0);
  if (!doc.total){ toast('Saisissez au moins une charge'); return; }
  if (Object.values(doc.charges).some(v=>v<0)||doc.prix<0||doc.rendement<0){ toast('Les valeurs négatives ne sont pas acceptées'); return; }
  if (c.rmax && doc.rendement>c.rmax*2){ toast(`Rendement improbable : plus du double du maximum de référence (${fmt(c.rmax,1)} t/ha)`); return; }
  try{ if(S.user?.id) doc.auteur=await S.user.id(); }catch(_){}
  $('#saveCost').disabled=true;
  try{ await S.store.set('couts', slug(c.nom), doc); toast('Référence enregistrée'); }
  catch(err){ toast(storeErr(err)); }
  finally{ $('#saveCost').disabled=false; }
};
function renderCostCount(){ const n=Object.keys(S.costs).length, t=calcCults.length; $('#costCount').textContent=`${n} / ${t} cultures`; $('#costBar').style.width=(n/t*100)+'%'; }

/* ================= Fiches ================= */
function renderFiches(){
  const list=Object.entries(S.fiches).map(([id,f])=>({id,...f})).sort((a,b)=>String(b.date).localeCompare(String(a.date)));
  $('#nbFiches').textContent=list.length;
  $('#fichHint').textContent = S.online ? "Fiches partagées avec les personnes qui ont accès à l'application." : "Fiches enregistrées sur cet appareil. Exportez-les depuis « Mon compte » pour les transférer.";
  if (!list.length){ $('#fichList').innerHTML='<div class="card empty">Aucune fiche pour l\'instant. Dans « Que planter ici ? », choisissez une localité et une culture, puis « Enregistrer la fiche ».</div>'; return; }
  $('#fichList').innerHTML=`<div class="tbl-wrap"><table class="t"><thead><tr><th>Date</th><th>Producteur / parcelle</th><th>Localité</th><th>Culture</th><th>Sol · climat</th><th>Score</th><th></th></tr></thead><tbody>
    ${list.map(f=>{ const d=decision(f.score); return `<tr><td class="num small">${f.date?new Date(f.date).toLocaleDateString('fr-FR'):''}</td>
      <td><b>${esc(f.producteur)}</b><div class="small muted">${esc(f.parcelle||'')}${f.conseiller?' · par '+esc(f.conseiller):''}</div>${f.note?`<div class="small">${esc(f.note)}</div>`:''}</td>
      <td>${esc(f.localite)}<div class="small muted">${esc(f.region)}</div></td><td>${esc(f.culture)}${f.semis?`<div class="small muted">semis ${esc(f.semis)}</div>`:''}</td>
      <td class="small num">pH ${fmt(f.ph,1)} · MO ${fmt(f.mo,1)}<div class="muted">${f.analyse?'analyse parcelle':'valeurs de zone'} · ${fmt(f.pluie)} mm</div></td>
      <td><span class="num">${f.score??'—'}</span> <span class="pill ${d.cls}">${esc(f.decision)}</span>${f.fiabilite?`<div class="small muted">${esc(f.fiabilite)}</div>`:''}</td>
      <td><span><button class="btn ghost danger" data-ask="${esc(f.id)}">Supprimer</button></span></td></tr>`; }).join('')}
    </tbody></table></div>`;
  $('#fichList').querySelectorAll('[data-ask]').forEach(b=>b.onclick=()=>{
    const id=b.dataset.ask, wrap=b.parentElement;
    wrap.innerHTML=`<span class="inline-confirm">Supprimer ? <button class="btn danger" data-yes>Oui</button><button class="btn ghost" data-no>Non</button></span>`;
    wrap.querySelector('[data-no]').onclick=renderFiches;
    wrap.querySelector('[data-yes]').onclick=async()=>{ try{ await S.store.del('fiches', id); toast('Fiche supprimée'); }catch(e){ toast(storeErr(e)); renderFiches(); } };
  });
}

/* ================= Données, exports, sauvegarde ================= */
function renderQual(){
  const A=D.anomalies, cnt={}; A.forEach(a=>cnt[a.statut]=(cnt[a.statut]||0)+1);
  const pcls={"Corrigé dans l'app":'p-fav','À valider':'p-cond','À compléter':'p-risk','À corriger':'p-bad','Limite signalée':'p-neutral'};
  $('#nbAno').textContent=A.filter(a=>a.statut!=="Corrigé dans l'app").length;
  $('#qSum').innerHTML=`<span class="pill p-acc">${D.locs.length} localités · ${ACTIVE.length} cultures · ${D.meta.lignesRef} lignes localité × culture</span>`+
    Object.entries(cnt).map(([k,v])=>`<span class="pill ${pcls[k]||'p-neutral'}">${v} ${esc(k.toLowerCase())}</span>`).join('');
  const cats=[...new Set(A.map(a=>a.cat))];
  $('#qList').innerHTML=cats.map(cat=>`<div class="q-cat" style="margin-top:14px"><div class="lab">${esc(cat)}</div><div>
    ${A.filter(a=>a.cat===cat).map(a=>`<div class="q-item"><b>${esc(a.objet)}</b><span class="pill ${pcls[a.statut]||'p-neutral'}">${esc(a.statut)}</span><p>${esc(a.detail)}</p></div>`).join('')}</div></div>`).join('');
  $('#zTbl').innerHTML=`<thead><tr><th>District</th><th>Région</th><th>Chef-lieu</th><th>Constat après revue</th></tr></thead><tbody>`+
    D.zones.map(z=>`<tr><td>${esc(z.district)}</td><td><b>${esc(z.region)}</b></td><td>${esc(z.chef)}</td><td>${esc(z.revu)}</td></tr>`).join('')+'</tbody>';
}
function renderSaveHint(){
  $('#saveHint').innerHTML = S.online
    ? "Vous utilisez la version en ligne : fiches, coûts, climats importés et villages ajoutés sont partagés avec les personnes qui ont accès à l'application. Importez ici la sauvegarde faite sur le terrain pour fusionner vos données hors connexion."
    : IS_ANDROID ? "Application hors connexion : les données sont enregistrées sur ce téléphone. Exportez régulièrement une sauvegarde (elle s'enregistre où vous voulez : téléphone, Google Drive, WhatsApp…) pour la transférer vers la version en ligne ou un autre téléphone."
    : (LocalStore.available() ? "Mode hors connexion : les données sont enregistrées dans le navigateur de cet appareil. Exportez régulièrement une sauvegarde, puis importez-la dans la version en ligne ou sur un autre appareil pour fusionner."
       : "Attention : ce navigateur bloque l'enregistrement (navigation privée ?). Les données saisies seront perdues à la fermeture. Ouvrez le fichier dans un navigateur normal.");
}
function csv(rows){ return '﻿'+rows.map(r=>r.map(v=>{ v=v==null?'':String(v); return /[;"\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v; }).join(';')).join('\r\n'); }
document.querySelectorAll('[data-exp]').forEach(b=>b.onclick=async()=>{
  const k=b.dataset.exp; let rows, name;
  if (k==='loc'){ name='localites_agrodiag.csv'; rows=[['id','localite','ligne_origine','departement','region','region_origine','statut','zone','type_sol','ph','mo','drainage','contraintes','pluie_mm','mois_sous_50mm',...MOIS.map(m=>'pluie_'+m),'source_climat','note']]
    .concat(allLocs().map(l=>{ const K=climOf(l); return [l.id,l.nom,l.orig,l.dep,l.reg,l.reg0,l.statut,l.zone,l.sol,l.ph,l.mo,l.drain,l.contr,K.pluie,K.secs,...K.mens,K.src,l.note]; })); }
  else if (k==='score'){ name='scores_agrodiag.csv'; rows=[['localite','region','culture','pratiquee_zone','score_excel','score','decision','semis_conseille','fiabilite','detail_facteurs','amendements_pratiques']];
    const saved=S.over; S.over=null;
    allLocs().forEach(l=>ACTIVE.forEach(c=>{ if(c.horsModele) return; const e=evaluate(l,c,{ph:l.ph,mo:l.mo,drain:l.drain});
      rows.push([l.nom,l.reg,c.nom,l.ref[c.nom]!=null?'oui':'non',l.ref[c.nom]??'',e.score,decision(e.score).lab,e.cal?(e.cal.irr?'contre-saison':e.cal.ok>0?MOIS_L[e.cal.start]:'aucun'):'pérenne',reliability(l).lab,e.facts.map(f=>`${f[0]} ${Math.round(f[1])}/${f[2]}`).join(' ; '),e.reco.join(' | ')]); }));
    S.over=saved; }
  else { name='couts_agrodiag.csv'; rows=[['culture','rendement_t_ha','prix_fcfa_kg','prix_sac_engrais',...LINES.map(l=>'cout_'+l[0]+'_fcfa_ha'),'cout_total_fcfa_ha','mise_a_jour']].concat(Object.values(S.costs).map(c=>[c.culture,c.rendement,c.prix,c.prixSac,...LINES.map(l=>c.charges?.[l[0]]??0),c.total,c.maj]));
    if (rows.length===1){ $('#expNote').textContent="Aucun coût enregistré pour l'instant."; return; } }
  const r=await saveFile(name, csv(rows), 'text/csv');
  $('#expNote').textContent = r==='ok' ? `${name} : ${rows.length-1} lignes.` : r==='declined' ? 'Téléchargement annulé.' : 'Téléchargement impossible.';
});
$('#bkExport').onclick=async()=>{
  const data={ app:'AgroDiag CI', version:3, date:new Date().toISOString(), fiches:S.fiches, couts:S.costs, climat:S.climat, localites:S.perso };
  const n=COLS.reduce((s,c)=>s+Object.keys(data[c]||{}).length,0);
  const r=await saveFile(`agrodiag_sauvegarde_${new Date().toISOString().slice(0,10)}.json`, JSON.stringify(data,null,1), 'application/json');
  $('#bkMsg').textContent = r==='ok' ? `Sauvegarde exportée : ${n} enregistrements.` : r==='declined' ? 'Export annulé.' : 'Export impossible.';
  $('#bkMsg').style.color = r==='ok' ? 'var(--good)' : 'var(--bad)';
};
$('#bkFile').onchange=async e=>{
  const f=e.target.files[0]; if(!f) return;
  const msg=(m,bad)=>{ $('#bkMsg').textContent=m; $('#bkMsg').style.color=bad?'var(--bad)':'var(--good)'; };
  try{
    const data=JSON.parse(await f.text());
    if (data?.app!=='AgroDiag CI') return msg("Ce fichier n'est pas une sauvegarde AgroDiag CI.", true);
    let n=0, skip=0;
    for (const c of COLS){
      for (const [id,doc] of Object.entries(data[c]||{})){
        if (!doc || typeof doc!=='object'){ skip++; continue; }
        const cur=({fiches:S.fiches,couts:S.costs,climat:S.climat,localites:S.perso})[c][id];
        const newer=!cur || String(doc.maj||doc.date||'')>String(cur.maj||cur.date||'');
        if (!newer){ skip++; continue; }
        await S.store.set(c, id, doc); n++;
      }
    }
    msg(`${n} enregistrement(s) importé(s)${skip?`, ${skip} ignoré(s) (déjà à jour)`:''}.`);
  }catch(err){ msg(err?.code ? storeErr(err) : 'Fichier illisible : choisissez un fichier .json exporté par AgroDiag CI.', true); }
  e.target.value='';
};

/* ================= Démarrage ================= */
if (IS_ADMIN) renderQual();
bindStore(LocalStore);
refreshLocs();
const savedLoc=pref.get('agrodiag.loc');
const start=findLoc(savedLoc) || D.locs.find(l=>/Tiassalé/.test(l.nom)) || D.locs[0];
$('#selReg').value=start.reg; fillLocs(); setLoc(start.id);
$('#selCult').value = phyCults.includes(pref.get('agrodiag.cult')) ? pref.get('agrodiag.cult') : 'Cacao';
$('#cCult').value='Cacao'; loadCalc();
renderSaveHint(); renderFiches();
if (IS_ANDROID){ $('#modeBadge').textContent='Application · données sur ce téléphone'; }
initTech(); initAdmin(); initLogin();
const savedTab=pref.get('agrodiag.tab'); show(savedTab && $('#v-'+savedTab) ? savedTab : 'diag');
checkRemoteData();

(async()=>{
  if (!window.claude?.use) return;
  claude.use('downloads').then(d=>{ S.dl=d; }).catch(()=>{});
  claude.use('user').then(u=>{ S.user=u; }).catch(()=>{});
  const db=await claude.use('db').catch(()=>null);
  if (!db) return;
  S.online=true;
  $('#modeBadge').textContent='En ligne · données partagées'; $('#modeBadge').className='pill p-fav';
  bindStore(DbStore(db));
  renderSaveHint(); renderFiches();
})();
