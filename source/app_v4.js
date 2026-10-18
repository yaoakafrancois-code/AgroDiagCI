/* ================= Connexion sans mot de passe ================= */
let PROFIL = null;
try { PROFIL = JSON.parse(lsGet('agrodiag.profil') || 'null'); } catch(e){ PROFIL = null; }
function profilNom(){ return PROFIL ? `${PROFIL.prenoms} ${PROFIL.nom}`.trim() : ''; }
function initLogin(){
  const f=$('#loginForm');
  f.onsubmit=e=>{
    e.preventDefault();
    const nom=$('#lgNom').value.trim(), prenoms=$('#lgPrenoms').value.trim(), contact=$('#lgContact').value.trim();
    if (!nom || !prenoms){ $('#lgMsg').textContent='Indiquez votre nom et vos prénoms.'; return; }
    const digits=contact.replace(/\D/g,'');
    if (!(digits.length>=8 || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contact))){ $('#lgMsg').textContent='Indiquez un numéro de téléphone (8 chiffres au moins) ou une adresse e-mail valide.'; return; }
    PROFIL={ nom, prenoms, contact, profil:$('#lgProfil').value, date: PROFIL?.date || new Date().toISOString(), maj:new Date().toISOString() };
    if (!lsSet('agrodiag.profil', JSON.stringify(PROFIL))){ $('#lgMsg').textContent="Impossible d'enregistrer sur cet appareil (navigation privée ?)."; return; }
    $('#lgMsg').textContent=''; applyProfil(); toast(`Bienvenue ${PROFIL.prenoms}`);
  };
  applyProfil();
}
function applyProfil(){
  const ok=!!(PROFIL && PROFIL.nom && PROFIL.contact);
  $('#login').hidden=ok;
  document.body.style.overflow = ok ? '' : 'hidden';
  $('#userChip').textContent = ok ? `${PROFIL.prenoms.split(' ')[0]} ${PROFIL.nom.charAt(0)}.` + (IS_ADMIN?' · admin':'') : '';
  $('#userChip').hidden=!ok;
  if (!ok){ ['#lgNom','#lgPrenoms','#lgContact'].forEach(s=>$(s).value=''); setTimeout(()=>$('#lgNom').focus(),50); }
}
$('#userChip').onclick=()=>show('compte');
function renderCompte(){
  if (!PROFIL) return;
  $('#profilView').innerHTML=`<dt>Nom</dt><dd>${esc(PROFIL.nom)}</dd><dt>Prénoms</dt><dd>${esc(PROFIL.prenoms)}</dd><dt>Contact</dt><dd>${esc(PROFIL.contact)}</dd>${PROFIL.profil?`<dt>Profil</dt><dd>${esc(PROFIL.profil)}</dd>`:''}<dt>Inscrit le</dt><dd>${new Date(PROFIL.date).toLocaleDateString('fr-FR')}</dd>`;
  $('#dataVersion').textContent = `Données agronomiques : version du ${new Date(D.version||Date.parse('2026-10-13')).toLocaleDateString('fr-FR')}${D.__draft?' (brouillon administrateur)':''}.`;
  $('#adminLogin').hidden = IS_ADMIN;
}
$('#profilEdit').onclick=()=>{ $('#lgNom').value=PROFIL.nom; $('#lgPrenoms').value=PROFIL.prenoms; $('#lgContact').value=PROFIL.contact; $('#lgProfil').value=PROFIL.profil||''; $('#login').hidden=false; };
$('#logout').onclick=()=>{
  const b=$('#logout'); b.outerHTML=`<span class="inline-confirm">Se déconnecter ? Vos fiches restent sur l'appareil. <button class="btn danger" id="loYes">Oui</button><button class="btn ghost" id="loNo">Non</button></span>`;
  $('#loNo').onclick=()=>location.reload();
  $('#loYes').onclick=()=>{ lsDel('agrodiag.profil'); lsDel('agrodiag.admin'); location.reload(); };
};

/* ================= SHA-256 (code administrateur, fonctionne aussi hors https) ================= */
function sha256(str){
  const K=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
  const bytes=new TextEncoder().encode(str), l=bytes.length, n=((l+9+63)>>6)<<6, m=new Uint8Array(n);
  m.set(bytes); m[l]=0x80; const dv=new DataView(m.buffer); dv.setUint32(n-4, l*8); dv.setUint32(n-8, Math.floor(l/0x20000000));
  let h=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19]; const w=new Uint32Array(64);
  const r=(x,y)=>(x>>>y)|(x<<(32-y));
  for (let o=0;o<n;o+=64){
    for (let i=0;i<16;i++) w[i]=dv.getUint32(o+i*4);
    for (let i=16;i<64;i++){ const s0=r(w[i-15],7)^r(w[i-15],18)^(w[i-15]>>>3), s1=r(w[i-2],17)^r(w[i-2],19)^(w[i-2]>>>10); w[i]=(w[i-16]+s0+w[i-7]+s1)|0; }
    let [a,b,c,d,e,f,g,hh]=h;
    for (let i=0;i<64;i++){ const S1=r(e,6)^r(e,11)^r(e,25), ch=(e&f)^(~e&g), t1=(hh+S1+ch+K[i]+w[i])|0, S0=r(a,2)^r(a,13)^r(a,22), mj=(a&b)^(a&c)^(b&c), t2=(S0+mj)|0; hh=g; g=f; f=e; e=(d+t1)|0; d=c; c=b; b=a; a=(t1+t2)|0; }
    h=[h[0]+a,h[1]+b,h[2]+c,h[3]+d,h[4]+e,h[5]+f,h[6]+g,h[7]+hh].map(x=>x|0);
  }
  return h.map(x=>(x>>>0).toString(16).padStart(8,'0')).join('');
}

/* ================= Données publiées : mise à jour automatique ================= */
async function checkRemoteData(){
  if (!navigator.onLine && navigator.onLine!==undefined) return;
  try {
    const res=await fetch(DATA_URL+'?t='+Date.now(), {cache:'no-store'});
    if (!res.ok) return;
    const r=await res.json();
    if (!validData(r)) return;
    const cur=Math.max(EMBEDDED.version||0, (()=>{ try { return JSON.parse(lsGet('agrodiag.data.remote')||'{}').version||0 } catch(e){ return 0 } })());
    if ((r.version||0)>cur){
      lsSet('agrodiag.data.remote', JSON.stringify(r));
      if (!D.__draft){ toast('Nouvelles données agronomiques reçues : mise à jour…'); setTimeout(()=>location.reload(), 1500); }
    }
  } catch(e){ /* hors connexion : on garde les données en mémoire */ }
}

/* ================= Fiches techniques adaptées à la zone ================= */
const TECH = { loc:null, crop:null };
const TECH_CULTS = ACTIVE.filter(c=>!c.horsModele);
function initTech(){
  $('#ftCult').innerHTML=TECH_CULTS.map(c=>`<option>${esc(c.nom)}</option>`).join('');
  const regs={}; allLocs().forEach(l=>(regs[l.reg]=regs[l.reg]||[]).push(l));
  $('#ftLoc').innerHTML=Object.keys(regs).sort((a,b)=>a.localeCompare(b,'fr')).map(r=>`<optgroup label="${esc(r)}">${regs[r].sort((a,b)=>a.nom.localeCompare(b.nom,'fr')).map(l=>`<option value="${esc(l.id)}">${esc(l.nom)}${l.perso?' (mon village)':''}</option>`).join('')}</optgroup>`).join('');
  ['#ftCult','#ftLoc','#ftSurf'].forEach(s=>$(s).addEventListener('change',()=>{ TECH.crop=$('#ftCult').value; TECH.loc=$('#ftLoc').value; renderTech(); }));
  $('#ftSurf').addEventListener('input',()=>renderTech());
  $('#ftDl').onclick=downloadTech;
}
function monthsBetween(a,n){ return [...Array(Math.max(0,n))].map((_,i)=>((a+i)%12+12)%12); }
function rainOnset(mens){
  // premier mois de la grande saison des pluies : passage sous 100 mm -> au-dessus, suivi de la plus longue période humide
  let best=null, bestLen=-1;
  for (let m=0;m<12;m++){
    if (mens[m]>=100 && mens[(m+11)%12]<100){ let len=0; while(len<12 && mens[(m+len)%12]>=100) len++; if (len>bestLen){ bestLen=len; best=m; } }
  }
  if (best==null){ let mx=-1; for (let m=0;m<12;m++){ const d=mens[m]-mens[(m+11)%12]; if (d>mx){ mx=d; best=m; } } }
  return best;
}
function riskClimate(r, K){
  const humid = K.pluie>=1500 || K.secs<=3, dry = K.secs>=5, t=(r.type||'').toLowerCase();
  if (humid && /fongi|bact/.test(t)) return 'Pression forte dans cette zone humide';
  if (dry && /insect|acarien|adventice|viral|virale/.test(t)) return 'Pression forte en zone à longue saison sèche';
  if (/fongi|bact/.test(t) && K.secs>=5) return 'Surtout en saison des pluies';
  return '';
}
const AGROECO = {
  fongique:"Variétés tolérantes, espacement suffisant pour aérer, élimination et destruction des organes atteints, rotation, fongicides à base de cuivre homologués en dernier recours.",
  bacterienne:"Semences et plants sains, rotation longue, désinfection des outils, arrachage des plants malades.",
  insecte:"Surveillance hebdomadaire, extrait aqueux de graines de neem (50 g/L), pièges (jaunes, phéromones), préservation des auxiliaires (bandes fleuries), Bacillus thuringiensis contre les chenilles.",
  acarien:"Arrosage des feuilles en saison sèche, extrait de neem ou de piment-ail, éviter les insecticides qui tuent les acariens prédateurs.",
  virale:"Semences et boutures saines, lutte contre les insectes vecteurs (neem, filets), arrachage précoce des plants malades, variétés résistantes.",
  adventice:"Rotation avec légumineuses, fumure organique, variétés tolérantes, arrachage avant floraison, paillage.",
  nematode:"Matériel de plantation sain (traitement à l'eau chaude), rotation avec plantes non hôtes (Tagetes, Crotalaria), fumure organique.",
  defaut:"Surveillance régulière, prophylaxie (propreté de la parcelle, rotation) et intervention avec un produit homologué seulement au-delà du seuil de nuisibilité."
};
function agroecoFor(type){ const t=(type||'').toLowerCase();
  if (/fongi/.test(t)) return AGROECO.fongique; if (/bact/.test(t)) return AGROECO.bacterienne; if (/acarien/.test(t)) return AGROECO.acarien;
  if (/vir/.test(t)) return AGROECO.virale; if (/adventice/.test(t)) return AGROECO.adventice; if (/n[ée]mato/.test(t)) return AGROECO.nematode;
  if (/insect/.test(t)) return AGROECO.insecte; return AGROECO.defaut; }
function round(x,s){ return Math.round(x/s)*s; }

function ficheTech(loc, c, surf){
  const it = D.itin[c.nom] || {};
  const soil = { ph:loc.ph, mo:loc.mo, drain:loc.drain };
  const e = evaluate(loc, c, soil), d = decision(e.score), K = e.K, mens = K.mens, ct = (loc.contr||'').toLowerCase();
  const S_ = [];  // sections {t, items[], note, html}
  const cycleM = Math.max(1, Math.round((c.cycle||90)/30));
  // ---------- Calendrier
  let cal = { rows:[], txt:'' };
  const pep = it.pep||0;
  if (c.per || !e.cal){
    const p = rainOnset(mens);
    cal.rows.push(['Pépinière', monthsBetween(p-pep, pep), 'c-pep']);
    cal.rows.push(['Préparation du terrain', monthsBetween(p-2, 2), 'c-prep']);
    cal.rows.push(['Plantation', [p], 'c-sem']);
    cal.rows.push(['Entretien des jeunes plants', monthsBetween(p+1, 11), 'c-ent']);
    cal.rows.push(['Mois secs (< 50 mm)', mens.map((v,i)=>v<50?i:-1).filter(i=>i>=0), 'c-sec']);
    cal.txt = `Planter au début de la grande saison des pluies, en ${MOIS_L[p]}` + (pep?`, avec une pépinière lancée vers ${MOIS_L[(p-pep+12)%12]} (${pep} mois avant)`:'') + '.';
  } else {
    const s = e.cal.start;
    cal.rows.push(['Pépinière', monthsBetween(s-pep, pep), 'c-pep']);
    cal.rows.push(['Préparation du terrain', [ (s-1+12)%12 ], 'c-prep']);
    cal.rows.push([pep?'Repiquage':'Semis', [s], 'c-sem']);
    cal.rows.push(['Entretien', monthsBetween(s+1, Math.max(0,cycleM-2)), 'c-ent']);
    cal.rows.push(['Récolte', [ (s+cycleM-1)%12 ], 'c-rec']);
    if (e.cal.second!=null){ const s2=e.cal.second; cal.rows.push(['2e saison : semis', [s2], 'c-sem']); cal.rows.push(['2e saison : récolte', [ (s2+cycleM-1)%12 ], 'c-rec']); }
    cal.rows.push(['Mois secs (< 50 mm)', mens.map((v,i)=>v<50?i:-1).filter(i=>i>=0), 'c-sec']);
    cal.txt = e.cal.txt;
  }
  // ---------- Matériel végétal
  const zoneVar = [];
  if (K.secs>=5 && !c.irr) zoneVar.push("Zone à longue saison sèche : préférer des variétés précoces ou tolérantes à la sécheresse.");
  if ((K.pluie>=1500 || K.secs<=3) && !c.per) zoneVar.push("Zone humide : choisir des variétés tolérantes aux maladies fongiques.");
  if (c.alt && loc.zone!=='Zone Montagneuse Ouest') zoneVar.push("Culture de climat frais : hors zone montagneuse, les rendements seront nettement réduits.");
  // ---------- Préparation du terrain
  const prep = [];
  if (/érosion|relief/.test(ct)) prep.push("Pente ou érosion : travailler en courbes de niveau, installer des bandes enherbées ou haies vives tous les 20 à 30 m.");
  if (/engorgement/.test(ct) || soil.drain==='Variable') prep.push(c.drainI ? "Sol engorgeable : adapté à cette culture, mais prévoir l'évacuation de l'eau en excès." : "Sol engorgeable : planter sur billons ou buttes hautes et ouvrir des drains.");
  if (/compaction/.test(ct)) prep.push("Sol compacté : décompacter avant la mise en place (labour profond ou sous-solage léger).");
  if (/salinit/.test(ct)) prep.push("Salinité : éviter les bas-fonds proches de la lagune ou de la mer, cultiver sur billons, n'irriguer qu'à l'eau douce.");
  if (/pollution|anthropique/.test(ct)) prep.push("Zone périurbaine : faire analyser les métaux lourds du sol et de l'eau d'arrosage avant toute culture maraîchère.");
  if (K.secs>=5) prep.push("Zone sèche : techniques de collecte de l'eau (zaï, demi-lunes, cordons pierreux) et paillage dès l'installation.");
  // ---------- Fertilisation adaptée
  const fert = [];
  if (soil.ph < c.ph[1]){
    const dose = Math.min(2000, Math.max(300, round((c.ph[1]-soil.ph)*1000, 100)));
    fert.push(`Chaulage : sol à pH ${fmt(soil.ph,1)} pour un optimum de ${fmt(c.ph[1],1)}–${fmt(c.ph[2],1)}. Apporter environ ${fmt(dose)} kg/ha de dolomie (${fmt(dose*surf)} kg pour ${fmt(surf,2)} ha), 1 à 2 mois avant la mise en place ; ajuster sur l'analyse de l'aluminium échangeable.`);
  } else if (soil.ph > c.ph[2]) fert.push(`pH ${fmt(soil.ph,1)} au-dessus de l'optimum : privilégier la matière organique et les engrais azotés acidifiants (sulfate d'ammonium) ; ne pas chauler.`);
  const comp = soil.mo<1.5 ? 10 : soil.mo<2 ? 7 : soil.mo<3 ? 4 : 0;
  if (comp) fert.push(`Matière organique ${fmt(soil.mo,1)} % : apporter ${comp} t/ha de compost ou fumier décomposé (${fmt(comp*surf,1)} t pour ${fmt(surf,2)} ha), avec paillage et plantes de couverture.`);
  if (/déficit p/.test(ct)) fert.push(`Déficit en phosphore : ajouter 200 à 300 kg/ha de phosphate naturel en fumure de fond (${fmt(250*surf)} kg pour ${fmt(surf,2)} ha).`);
  if (/lessivage/.test(ct) || soil.drain==='Rapide') fert.push("Sol lessivé ou filtrant : fractionner l'azote et la potasse en 3 apports au lieu de 2, et toujours après une pluie.");
  if (c.engF && c.engKg){ const kg=c.engKg*surf; fert.push(`Repère de dose : ${c.engF} à ${fmt(c.engKg)} kg/ha, soit ${fmt(kg)} kg (${fmt(kg/50,1)} sacs de 50 kg) pour ${fmt(surf,2)} ha.`); }
  // ---------- Eau
  const eau = [];
  if (e.cal && !e.cal.irr && !c.per){
    const low = e.cal.months.filter(m=>mens[m]<e.cal.need);
    eau.push(low.length ? `Pluie insuffisante (< ${e.cal.need} mm) en ${low.map(m=>MOIS_L[m]).join(', ')} pendant le cycle : prévoir une irrigation d'appoint ou un semis plus précoce, et pailler.` : `La pluie couvre normalement les besoins du cycle (≥ ${e.cal.need} mm/mois) si le semis est fait en ${MOIS_L[e.cal.start]}.`);
  }
  if (c.irr) eau.push(`Culture conduite avec maîtrise de l'eau : saison sèche de ${K.secs} mois (< 50 mm). Prévoir une source d'eau sûre (puits, forage, retenue) et l'irrigation au goutte-à-goutte ou à la raie.`);
  if (c.per && K.secs>=4) eau.push(`Saison sèche de ${K.secs} mois : arroser la pépinière et les jeunes plants la première année (${mens.map((v,i)=>v<50?MOIS_L[i]:null).filter(Boolean).join(', ')}), pailler et maintenir un ombrage temporaire.`);
  if (soil.drain==='Rapide' && !c.drainE) eau.push("Sol filtrant : augmenter la matière organique pour retenir l'eau.");
  // ---------- Ravageurs et maladies
  const rs = D.risques.filter(r=>r.cult===c.nom || r.cult0===c.nom).map(r=>({r, zone:riskClimate(r,K)}))
    .sort((a,b)=>(b.zone?1:0)-(a.zone?1:0) || (/très/i.test(b.r.niv)?3:/élevé/i.test(b.r.niv)?2:1)-(/très/i.test(a.r.niv)?3:/élevé/i.test(a.r.niv)?2:1));
  // ---------- Aléas
  const aleas = [];
  if (K.secs>=5) aleas.push(`Sécheresse : ${K.secs} mois sous 50 mm. Semer dès l'installation des pluies (attendre 20 à 30 mm cumulés), variétés précoces, paillage.`);
  if (K.secs>=5 && c.per) aleas.push("Feux de brousse : entretenir un pare-feu de 10 m autour de la parcelle avant la saison sèche.");
  if (/Savane/.test(loc.zone) && K.secs>=5) aleas.push("Harmattan (décembre à février) : vent sec et poussiéreux ; brise-vent, paillage et arrosage des jeunes plants.");
  if (K.pluie>=1700) aleas.push(`Fortes pluies (${fmt(K.pluie)} mm/an) : risque d'excès d'eau et de maladies ; drainer et aérer les cultures.`);
  if (/engorgement/.test(ct)) aleas.push("Inondation ou engorgement en saison des pluies : éviter les bas de pente pour les cultures sensibles.");
  if (/érosion|relief/.test(ct)) aleas.push("Ravinement : couvrir le sol en permanence et travailler en courbes de niveau.");
  aleas.push("Installation irrégulière des pluies : ne semer qu'après 20 à 30 mm cumulés ; garder des semences pour un éventuel ressemis.");
  // ---------- Rendement attendu
  let rend='';
  if (c.rmoy!=null){
    const s=e.score;
    rend = s>=75 ? `${fmt(c.rmoy,1)} à ${fmt((c.rmoy+c.rmax)/2,1)} t/ha avec un bon itinéraire (max ${fmt(c.rmax,1)} t/ha)` : s>=60 ? `environ ${fmt(c.rmoy,1)} t/ha si les corrections du sol sont faites` : s>=45 ? `${fmt(c.rmoy*0.5,1)} à ${fmt(c.rmoy*0.8,1)} t/ha : zone à risque pour cette culture` : `rendement faible et incertain : culture déconseillée dans cette zone`;
    rend += ` · soit pour ${fmt(surf,2)} ha : ${s>=45?fmt(c.rmoy*surf*(s>=75?1:s>=60?0.9:0.65),1)+' t':'—'}`;
  }
  return { loc, c, it, e, d, K, cal, zoneVar, prep, fert, eau, rs, aleas, rend, surf };
}

function calTable(rows){
  return `<div class="cal-wrap"><table class="cal"><thead><tr><th></th>${MOIS.map(m=>`<th>${m}</th>`).join('')}</tr></thead><tbody>
    ${rows.filter(r=>r[1].length).map(([lab, ms, cls])=>`<tr><td class="lab">${esc(lab)}</td>${MOIS.map((_,i)=>`<td class="${ms.includes(i)?cls:''}"></td>`).join('')}</tr>`).join('')}
  </tbody></table></div>`;
}
function ficheHTML(F, forFile){
  const {loc,c,it,e,d,K,cal,surf}=F;
  const li = arr => arr.filter(Boolean).map(x=>`<li>${esc(x)}</li>`).join('');
  const zn = arr => arr.length ? `<div class="zone-note"><b>Adapté à ${esc(loc.nom)} :</b><ul>${li(arr)}</ul></div>` : '';
  const pestRows = F.rs.length ? F.rs.map(({r,zone})=>`<li><b>${esc(r.pb)}</b> (${esc(r.type)}, risque ${esc((r.niv||'').toLowerCase())}${zone?` · <span style="color:var(--risk)">${esc(zone)}</span>`:''}). Période : ${esc(r.per)} · ${esc(r.stade)}.<br>
      ${r.st==='interdit' ? `<span style="color:var(--bad)">Le produit « ${esc(r.prod)} » (${esc(r.ma)}) est interdit en Côte d'Ivoire.</span>` : `Lutte chimique si nécessaire : ${esc(r.prod)} (${esc(r.ma)})${r.st==='verifier'?' — homologation à vérifier':''}.`}<br>
      Lutte agroécologique : ${esc(r.alt || agroecoFor(r.type))}</li>`).join('')
    : `<li>Aucun ravageur documenté pour cette culture dans la base. ${esc(AGROECO.defaut)}</li>`;
  return `
  ${forFile?'':`<div class="lab">${esc(c.fam)} · ${esc(loc.nom)} (${esc(loc.reg)})</div>`}
  <h2>Fiche technique : ${esc(c.nom)}</h2>
  ${forFile?`<p><b>Localité :</b> ${esc(loc.nom)} (${esc(loc.reg)}) · <b>Surface :</b> ${fmt(surf,2)} ha</p>`:''}
  <div class="big"><span class="n">${e.score??'—'}</span><span class="muted">/ 100</span><span class="pill ${d.cls}">${d.lab}</span><span class="pill ${reliability(loc).cls}">${reliability(loc).lab}</span></div>
  <p class="small muted" style="margin:4px 0 0">Zone : ${esc(loc.zone)} · Sol : ${esc(loc.sol)}, pH ${fmt(loc.ph,1)}, MO ${fmt(loc.mo,1)} %, drainage ${esc((loc.drain||'').toLowerCase())} · Pluie : ${fmt(K.pluie)} mm/an, ${K.secs} mois sous 50 mm${loc.contr?` · Contraintes : ${esc(loc.contr)}`:''}.</p>
  ${d.lab==='Déconseillé'?`<div class="notice warn" style="margin-top:10px">Cette culture est déconseillée dans cette zone. Consultez l'onglet « Où planter ? » pour trouver une zone plus favorable.</div>`:''}

  <h3>1. Calendrier cultural pour ${esc(loc.nom)}</h3>
  ${calTable(cal.rows)}
  <div class="legend"><span><i style="background:#B9D7C7"></i>Pépinière</span><span><i style="background:#E6D3B3"></i>Préparation</span><span><i style="background:var(--accent)"></i>Semis / plantation</span><span><i style="background:var(--good-bg)"></i>Entretien</span><span><i style="background:var(--warn)"></i>Récolte</span><span><i style="background:var(--risk-bg)"></i>Mois secs</span></div>
  <p style="margin:8px 0 0">${esc(cal.txt)}</p>

  <h3>2. Matériel végétal</h3>
  <ul>${li([it.mat, it.var && ('Variétés : '+it.var), it.sem && ('Quantité : '+it.sem)])}</ul>
  ${zn(F.zoneVar)}

  <h3>3. Préparation du terrain</h3>
  <ul>${li([it.prep])}</ul>
  ${zn(F.prep)}

  <h3>4. Semis ou plantation</h3>
  <ul>${li([it.ecart && ('Écartement : '+it.ecart), it.dens && ('Densité : '+it.dens), it.plant])}</ul>

  <h3>5. Fertilisation et amendements</h3>
  <ul>${li([it.fond && ('Fumure de fond : '+it.fond), it.couv && ('Fumure d\'entretien : '+it.couv)])}</ul>
  ${zn(F.fert)}

  <h3>6. Gestion de l'eau</h3>
  ${F.eau.length?`<ul>${li(F.eau)}</ul>`:'<p class="small muted">Pas de contrainte particulière identifiée.</p>'}

  <h3>7. Entretien de la culture</h3>
  <ul>${li([it.entr])}</ul>

  <h3>8. Ravageurs et maladies à surveiller</h3>
  <ul>${pestRows}</ul>

  <h3>9. Aléas de la zone et parades</h3>
  <ul>${li(F.aleas)}</ul>

  <h3>10. Récolte et post-récolte</h3>
  <ul>${li([it.recolte, it.post])}</ul>
  ${F.rend?`<p style="margin:8px 0 0"><b>Rendement attendu dans cette zone :</b> ${esc(F.rend)}.</p>`:''}

  ${it.assoc?`<h3>11. Pratiques agroécologiques recommandées</h3><ul>${li([it.assoc])}</ul>`:''}

  <p class="small muted" style="margin-top:18px">Fiche générée par AgroDiag CI le ${new Date().toLocaleDateString('fr-FR')} à partir des exigences des cultures (FAO Ecocrop), de la pluie mensuelle de référence, du sol de la zone et des repères techniques usuels. À valider avec votre conseiller agricole (ANADER ou structure d'encadrement) et à adapter à l'analyse de sol de la parcelle.${PROFIL?` Préparée pour ${esc(profilNom())}.`:''}</p>`;
}
function renderTech(){
  if (!TECH.crop) TECH.crop = S.crop && TECH_CULTS.find(c=>c.nom===S.crop) ? S.crop : 'Cacao';
  if (!TECH.loc) TECH.loc = S.loc ? S.loc.id : D.locs[0].id;
  if (!TECH_CULTS.find(c=>c.nom===TECH.crop)) TECH.crop=TECH_CULTS[0].nom;
  const loc = findLoc(TECH.loc) || D.locs[0];
  $('#ftCult').value=TECH.crop; $('#ftLoc').value=String(loc.id);
  const surf = Math.max(0.01, parseFloat($('#ftSurf').value)||1);
  const F = ficheTech(loc, CULT[TECH.crop], surf);
  $('#ftOut').innerHTML = ficheHTML(F, false);
}
async function downloadTech(){
  const loc = findLoc(TECH.loc) || D.locs[0], c=CULT[TECH.crop], surf=Math.max(0.01, parseFloat($('#ftSurf').value)||1);
  const F = ficheTech(loc, c, surf);
  const css = `body{font:15px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif;color:#18231C;max-width:860px;margin:0 auto;padding:20px}h2{font-size:24px;margin:0 0 6px;color:#1D6A4A}h3{font-size:17px;margin:22px 0 8px;padding-top:12px;border-top:1px solid #D3DACF}ul{padding-left:20px}li{margin:4px 0}.muted{color:#5B6A60}.small{font-size:13px}.big{display:flex;gap:10px;align-items:center;margin:10px 0}.big .n{font-size:34px;font-weight:700}.pill{border-radius:99px;padding:2px 10px;font-size:12px;font-weight:600;background:#E8ECE5}.p-fav{background:#DDF1E5;color:#1E7B4C}.p-cond{background:#FBEBC9;color:#9A6400}.p-risk{background:#FADFCF;color:#B4501A}.p-bad{background:#F8DADE;color:#B42335}.zone-note{border-left:3px solid #1D6A4A;background:#DCEDE3;padding:8px 12px;margin-top:8px;border-radius:0 8px 8px 0}.notice{background:#FBEBC9;padding:8px 12px;border-radius:8px}table.cal{border-collapse:separate;border-spacing:2px;width:100%;font-size:12px}table.cal td{height:22px;border-radius:4px;background:#E8ECE5}table.cal td.lab{background:none;font-weight:600;white-space:nowrap;padding-right:8px}.c-pep{background:#B9D7C7!important}.c-prep{background:#E6D3B3!important}.c-sem{background:#1D6A4A!important}.c-ent{background:#DDF1E5!important}.c-rec{background:#9A6400!important}.c-sec{background:#FADFCF!important}.legend{display:flex;flex-wrap:wrap;gap:10px;font-size:12px;color:#5B6A60}.legend i{display:inline-block;width:12px;height:12px;border-radius:3px;margin-right:4px}:root{--accent:#1D6A4A;--good-bg:#DDF1E5;--warn:#9A6400;--risk-bg:#FADFCF;--risk:#B4501A;--bad:#B42335}`;
  const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Fiche technique ${esc(c.nom)} – ${esc(loc.nom)}</title><style>${css}</style></head><body><p class="small muted">AgroDiag CI · Outil de décision agricole</p>${ficheHTML(F, true)}</body></html>`;
  const name = `Fiche_${slug(c.nom)}_${slug(loc.nom)}.html`;
  const r = await saveFile(name, html, 'text/html');
  toast(r==='ok' ? `Fiche enregistrée : ${name}` : r==='declined' ? 'Enregistrement annulé' : 'Enregistrement impossible');
}

/* ================= Administration des données ================= */
const ADMIN = { set:'itin', key:null, q:'' };
const SCHEMA = {
  itin: { label:'Fiche technique', keyOf:x=>x.__k, title:x=>x.__k, sub:x=>(CULT[x.__k]?.fam)||'',
    fields:[['mat','Matériel végétal','area'],['var','Variétés recommandées','area'],['pep','Mois de pépinière avant plantation','num'],['ecart','Écartement','text'],['dens','Densité','text'],['sem','Quantité de semence / plants','text'],['prep','Préparation du terrain','area'],['plant','Semis ou plantation','area'],['fond','Fumure de fond','area'],['couv',"Fumure d'entretien",'area'],['entr','Entretien','area'],['recolte','Récolte','area'],['post','Post-récolte','area'],['assoc','Pratiques agroécologiques','area']] },
  cults: { label:'Culture', keyOf:x=>x.nom, title:x=>x.nom, sub:x=>x.fam,
    fields:[['nom','Nom de la culture','text'],['fam','Famille','text'],['saison','Saison','text'],['cycle','Durée du cycle (jours)','num'],['rmoy','Rendement moyen (t/ha)','num'],['rmax','Rendement maximum (t/ha)','num'],['diff','Difficulté','text'],['com','Débouché','text'],['eng','Engrais de fond (texte)','text'],['engF','Formule d\'engrais (ex. 15-15-15)','text'],['engKg','Dose d\'engrais (kg/ha)','num'],['ph','pH : limite basse, optimum bas, optimum haut, limite haute','quad'],['pl','Pluie annuelle (mm) : limite basse, optimum bas, optimum haut, limite haute','quad'],['sec','Tolérance à la sécheresse','sel',[[0,'Sensible'],[1,'Moyenne'],[2,'Tolérante']]],['per','Culture pérenne','bool'],['irr','Conduite irriguée / contre-saison','bool'],['drainI','Tolère un drainage imparfait','bool'],['drainE','Tolère un sol filtrant','bool'],['sal','Tolère une salinité moyenne','bool'],['alt',"Culture d'altitude (climat frais)",'bool']] },
  locs: { label:'Localité', keyOf:x=>String(x.id), title:x=>x.nom, sub:x=>x.reg,
    fields:[['nom','Nom','text'],['reg','Région','text'],['dep','Département','text'],['zone','Zone agro-climatique','sel',()=>Object.keys(D.zoneVals).map(z=>[z,z])],['sol','Type de sol','text'],['ph','pH eau','num'],['mo','Matière organique (%)','num'],['drain','Drainage','sel',[['Bon','Bon'],['Moyen','Moyen'],['Rapide','Rapide'],['Variable','Variable']]],['contr','Contraintes (séparées par des virgules)','text'],['pluie','Pluie annuelle (mm)','num'],['st','Station de référence du profil mensuel','sel',()=>Object.keys(D.stations).map(s=>[s,s])]] },
  risques: { label:'Ravageur / maladie', keyOf:x=>String(x.__i), title:x=>x.pb, sub:x=>x.cult,
    fields:[['cult','Culture','sel',()=>D.cults.map(c=>[c.nom,c.nom])],['pb','Ravageur ou maladie','text'],['type','Type (Fongique, Insecte, Virale…)','text'],['niv','Niveau de risque','sel',[['Faible','Faible'],['Modéré','Modéré'],['Élevé','Élevé'],['Très élevé','Très élevé']]],['per','Période d\'intervention','text'],['stade','Stade de détection','text'],['prod','Produit recommandé','text'],['ma','Matière active','text'],['st','Statut réglementaire','sel',[['ok','Pas d\'alerte'],['verifier','À vérifier'],['interdit','Interdit en CI']]],['msg','Commentaire réglementaire','area'],['alt','Alternative agroécologique','area'],['pertes','Pertes estimées','text']] },
};
function draftData(){ // copie de travail complète
  try { const a=JSON.parse(lsGet('agrodiag.data.draft')||'null'); if (validData(a)) return a; } catch(e){}
  return JSON.parse(JSON.stringify(D, (k,v)=>k==='__draft'?undefined:v));
}
function saveDraft(dd, msg){
  dd.draftDate=new Date().toISOString();
  if (!lsSet('agrodiag.data.draft', JSON.stringify(dd))){ toast("Impossible d'enregistrer sur cet appareil"); return false; }
  pref.set('agrodiag.adminSel', JSON.stringify({set:ADMIN.set, key:ADMIN.key}));
  toast(msg||'Modification enregistrée'); setTimeout(()=>location.reload(), 600); return true;
}
function rowsOf(dd, set){
  if (set==='itin') return dd.cults.filter(c=>!c.doublon && !c.horsModele).map(c=>({__k:c.nom, ...(dd.itin[c.nom]||{})}));
  if (set==='risques') return dd.risques.map((r,i)=>({__i:i, ...r}));
  return dd[set];
}
function initAdmin(){
  if (!IS_ADMIN) return;
  $('#tab-qual').hidden=false;
  try { const s=JSON.parse(pref.get('agrodiag.adminSel')||'null'); if (s){ ADMIN.set=s.set; ADMIN.key=s.key; } } catch(e){}
  $('#edSet').value=ADMIN.set;
  $('#edSet').onchange=()=>{ ADMIN.set=$('#edSet').value; ADMIN.key=null; renderAdmin(); };
  $('#edSearch').oninput=()=>{ ADMIN.q=$('#edSearch').value.toLowerCase(); renderEdList(); };
  $('#edAdd').onclick=()=>{ ADMIN.key='__new__'; renderEdList(); renderEdForm(); };
  $('#admQuit').onclick=()=>{ lsDel('agrodiag.admin'); location.reload(); };
  $('#pubDl').onclick=async()=>{
    const dd=draftData(); delete dd.draftDate; dd.version=Date.now();
    const r=await saveFile('agrodiag-data.json', JSON.stringify(dd), 'application/json');
    $('#pubMsg').textContent = r==='ok' ? `Fichier prêt (version du ${new Date(dd.version).toLocaleString('fr-FR')}). Envoyez-le maintenant sur GitHub (étape 2).` : r==='declined' ? 'Téléchargement annulé.' : 'Téléchargement impossible.';
    if (r==='ok'){ lsSet('agrodiag.data.remote', JSON.stringify(dd)); }
  };
  $('#pubImport').onchange=async e=>{
    const f=e.target.files[0]; if(!f) return;
    try { const dd=JSON.parse(await f.text()); if (!validData(dd)) throw 0; saveDraft(dd, 'Données importées dans le brouillon'); }
    catch(err){ $('#pubMsg').textContent="Ce fichier n'est pas un fichier de données AgroDiag CI."; }
  };
  $('#draftReset').onclick=()=>{
    const b=$('#draftReset'); b.outerHTML=`<span class="inline-confirm">Effacer le brouillon ? <button class="btn danger" id="drYes">Oui</button><button class="btn ghost" id="drNo">Non</button></span>`;
    $('#drNo').onclick=()=>location.reload(); $('#drYes').onclick=()=>{ lsDel('agrodiag.data.draft'); location.reload(); };
  };
  $('#admSet').onclick=()=>{
    const v=$('#admNew').value; if ((v||'').length<6){ $('#admSetMsg').textContent='Le code doit contenir au moins 6 caractères.'; return; }
    const dd=draftData(); dd.adminHash=sha256(v); saveDraft(dd, 'Nouveau code enregistré dans le brouillon : publiez pour l\'appliquer partout');
  };
}
function renderAdmin(){
  if (!IS_ADMIN) return;
  renderQual();
  const has = !!lsGet('agrodiag.data.draft');
  $('#draftState').innerHTML = `<span class="pill p-acc">Données en service : version du ${new Date(D.version||0).toLocaleString('fr-FR')}</span>` +
    (has ? `<span class="pill p-cond">Brouillon non publié du ${new Date(D.draftDate||Date.now()).toLocaleString('fr-FR')}</span>` : '<span class="pill p-fav">Aucune modification en attente</span>');
  renderEdList(); renderEdForm();
}
function renderEdList(){
  const sc=SCHEMA[ADMIN.set], rows=rowsOf(D, ADMIN.set).filter(x=>!ADMIN.q || (sc.title(x)+' '+sc.sub(x)).toLowerCase().includes(ADMIN.q));
  if (!ADMIN.key && rows[0]) ADMIN.key=sc.keyOf(rows[0]);
  $('#edList').innerHTML = (ADMIN.key==='__new__'?`<li><button aria-current="true">Nouvel élément<small>${esc(sc.label)}</small></button></li>`:'') +
    rows.map(x=>`<li><button data-k="${esc(sc.keyOf(x))}" aria-current="${sc.keyOf(x)===ADMIN.key}">${esc(sc.title(x)||'(sans nom)')}<small>${esc(sc.sub(x)||'')}</small></button></li>`).join('');
  $('#edList').querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{ ADMIN.key=b.dataset.k; renderEdList(); renderEdForm(); if (window.innerWidth<900) $('#edForm').scrollIntoView({behavior:'smooth'}); });
}
function renderEdForm(){
  const sc=SCHEMA[ADMIN.set]; if(!sc) return;
  const isNew = ADMIN.key==='__new__';
  if (ADMIN.set==='itin' && isNew){ $('#edForm').innerHTML='<p class="small muted">Pour une nouvelle fiche technique, ajoutez d\'abord la culture dans « Cultures ».</p>'; return; }
  const x = isNew ? {} : rowsOf(D, ADMIN.set).find(r=>sc.keyOf(r)===ADMIN.key);
  if (!x){ $('#edForm').innerHTML='<p class="small muted">Choisissez un élément dans la liste.</p>'; return; }
  const inp=(f)=>{ const [k,lab,t,opts]=f, v=x[k], id='ef-'+k;
    if (t==='area') return `<div class="field"><label for="${id}">${esc(lab)}</label><textarea id="${id}">${esc(v??'')}</textarea></div>`;
    if (t==='num') return `<div class="field"><label for="${id}">${esc(lab)}</label><input type="number" step="any" id="${id}" value="${v??''}"></div>`;
    if (t==='bool') return `<label class="chk"><input type="checkbox" id="${id}" ${v?'checked':''}> ${esc(lab)}</label>`;
    if (t==='quad') return `<div class="field"><label>${esc(lab)}</label><div class="quad">${[0,1,2,3].map(i=>`<input type="number" step="any" id="${id}-${i}" value="${Array.isArray(v)?v[i]:''}" aria-label="${esc(lab)} ${i+1}">`).join('')}</div></div>`;
    if (t==='sel'){ const o=typeof opts==='function'?opts():opts; return `<div class="field"><label for="${id}">${esc(lab)}</label><select id="${id}">${o.map(([val,l])=>`<option value="${esc(val)}" ${String(v)===String(val)?'selected':''}>${esc(l)}</option>`).join('')}</select></div>`; }
    return `<div class="field"><label for="${id}">${esc(lab)}</label><input type="text" id="${id}" value="${esc(v??'')}" ${ADMIN.set==='cults'&&k==='nom'&&!isNew?'readonly':''}></div>`; };
  const bools=sc.fields.filter(f=>f[2]==='bool'), others=sc.fields.filter(f=>f[2]!=='bool');
  $('#edForm').innerHTML=`<h3 style="font-size:16px;margin:0">${isNew?'Ajouter : ':''}${esc(isNew?sc.label:sc.title(x))}</h3>
    ${others.map(inp).join('')}${bools.length?`<div class="chkrow">${bools.map(inp).join('')}</div>`:''}
    <div class="row" style="align-items:center"><button class="btn primary" type="submit">Enregistrer</button>${isNew?'':'<span id="edDelWrap"><button class="btn ghost danger" type="button" id="edDel">Supprimer</button></span>'}<span class="small" id="edMsg" style="color:var(--bad)"></span></div>`;
  $('#edForm').onsubmit=ev=>{ ev.preventDefault(); saveEd(x, isNew); };
  if ($('#edDel')) $('#edDel').onclick=()=>{ $('#edDelWrap').innerHTML=`<span class="inline-confirm">Supprimer définitivement ? <button class="btn danger" type="button" id="edDy">Oui</button><button class="btn ghost" type="button" id="edDn">Non</button></span>`; $('#edDn').onclick=renderEdForm; $('#edDy').onclick=()=>delEd(x); };
}
function readForm(sc){
  const out={}; let err='';
  for (const [k,lab,t] of sc.fields){
    const id='ef-'+k;
    if (t==='bool') out[k]=$('#'+id).checked ? 1 : 0;
    else if (t==='num'){ const v=$('#'+id).value; out[k]= v==='' ? null : Number(v); if (v!=='' && !isFinite(out[k])) err=`« ${lab} » doit être un nombre.`; }
    else if (t==='quad'){ const q=[0,1,2,3].map(i=>Number($(`#${id}-${i}`).value)); if (q.some(v=>!isFinite(v)) || !(q[0]<=q[1]&&q[1]<=q[2]&&q[2]<=q[3])) err=`« ${lab} » : 4 nombres croissants attendus.`; out[k]=q; }
    else if (t==='sel'){ const v=$('#'+id).value; out[k]= (k==='sec') ? Number(v) : v; }
    else out[k]=$('#'+id).value.trim();
  }
  return {out, err};
}
function saveEd(x, isNew){
  const sc=SCHEMA[ADMIN.set], {out, err}=readForm(sc);
  if (err){ $('#edMsg').textContent=err; return; }
  const dd=draftData();
  if (ADMIN.set==='itin'){ dd.itin[x.__k]=out; ADMIN.key=x.__k; }
  else if (ADMIN.set==='cults'){
    if (!out.nom){ $('#edMsg').textContent='Indiquez le nom de la culture.'; return; }
    if (isNew){ if (dd.cults.find(c=>c.nom===out.nom)){ $('#edMsg').textContent='Cette culture existe déjà.'; return; } dd.cults.push({...out, slug:slug(out.nom), ecoT:[20,32]}); }
    else Object.assign(dd.cults.find(c=>c.nom===x.nom), out);
    if (out.engF && out.engKg) dd.cults.find(c=>c.nom===out.nom).eng = `${out.engF} ${out.engKg} kg/ha`;
    ADMIN.key=out.nom;
  } else if (ADMIN.set==='locs'){
    if (!out.nom || !out.reg){ $('#edMsg').textContent='Indiquez le nom et la région.'; return; }
    if (!(out.ph>=3&&out.ph<=10)){ $('#edMsg').textContent='Le pH doit être compris entre 3 et 10.'; return; }
    if (!(out.pluie>=100&&out.pluie<=6000)){ $('#edMsg').textContent='La pluie annuelle doit être comprise entre 100 et 6 000 mm.'; return; }
    out.pluieSrc='zone';
    if (isNew){ const id=Math.max(...dd.locs.map(l=>Number(l.id)||0))+1; dd.locs.push({...out, id, sp:out.nom, reg0:out.reg, statut:'ajoutee', note:'Localité ajoutée par l\'administrateur.', ref:{}, orig:null, secs:null}); ADMIN.key=String(id); }
    else Object.assign(dd.locs.find(l=>String(l.id)===String(x.id)), out);
  } else if (ADMIN.set==='risques'){
    if (!out.pb){ $('#edMsg').textContent='Indiquez le ravageur ou la maladie.'; return; }
    out.cult0=out.cult;
    if (isNew){ dd.risques.push(out); ADMIN.key=String(dd.risques.length-1); } else Object.assign(dd.risques[x.__i], out);
  }
  saveDraft(dd);
}
function delEd(x){
  const dd=draftData();
  if (ADMIN.set==='itin') delete dd.itin[x.__k];
  else if (ADMIN.set==='cults'){ dd.cults=dd.cults.filter(c=>c.nom!==x.nom); delete dd.itin[x.nom]; }
  else if (ADMIN.set==='locs') dd.locs=dd.locs.filter(l=>String(l.id)!==String(x.id));
  else if (ADMIN.set==='risques') dd.risques.splice(x.__i,1);
  ADMIN.key=null; saveDraft(dd, 'Élément supprimé du brouillon');
}
$('#admGo').onclick=()=>{
  const v=$('#admCode').value;
  if (D.adminHash && sha256(v)===D.adminHash){ lsSet('agrodiag.admin','1'); $('#admMsg').textContent=''; toast('Mode administrateur activé'); setTimeout(()=>{ pref.set('agrodiag.tab','qual'); location.reload(); }, 500); }
  else { $('#admMsg').textContent='Code incorrect.'; $('#admMsg').style.color='var(--bad)'; }
};
