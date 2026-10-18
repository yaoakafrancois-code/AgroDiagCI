/* ================= Parcelles : délimitation GPS, surface, plan imprimable ================= */
S.parcelles = S.parcelles || {};
const PC = { pts:[], watch:null, editId:null };
const R_EARTH = 6371008.8;
function geoXY(pts){
  const lat0 = pts.reduce((a,p)=>a+p.lat,0)/pts.length, lon0 = pts.reduce((a,p)=>a+p.lon,0)/pts.length, k=Math.PI/180;
  return { lat0, lon0, xy: pts.map(p=>[R_EARTH*(p.lon-lon0)*k*Math.cos(lat0*k), R_EARTH*(p.lat-lat0)*k]) };
}
function geoStats(pts){
  if (pts.length<2) return { area:0, perim:0, sides:[] };
  const { xy, lat0, lon0 } = geoXY(pts);
  let a=0, per=0; const sides=[];
  for (let i=0;i<xy.length;i++){ const [x1,y1]=xy[i], [x2,y2]=xy[(i+1)%xy.length]; a += x1*y2-x2*y1; const d=Math.hypot(x2-x1,y2-y1); if (pts.length>2 || i===0) { per+=d; sides.push(d); } }
  return { area: pts.length>2 ? Math.abs(a)/2 : 0, perim: per, sides, lat0, lon0 };
}
function fmtArea(m2){ return m2>=10000 ? `${fmt(m2/10000,2)} ha` : `${fmt(m2)} m²`; }
function planSVG(pts, title){
  const W=640, H=440, pad=48;
  if (pts.length<1) return `<svg viewBox="0 0 ${W} 140" role="img" aria-label="Plan vide"><rect width="${W}" height="140" fill="#fff"/><text x="${W/2}" y="74" text-anchor="middle" font-size="14" fill="#5B6A60" font-family="system-ui,sans-serif">Le plan de la parcelle apparaîtra ici dès le premier point.</text></svg>`;
  const { xy } = geoXY(pts);
  const xs=xy.map(p=>p[0]), ys=xy.map(p=>p[1]);
  const minX=Math.min(...xs), maxX=Math.max(...xs), minY=Math.min(...ys), maxY=Math.max(...ys);
  const span=Math.max(maxX-minX, maxY-minY, 10);
  const sc=Math.min((W-2*pad)/Math.max(maxX-minX,1e-6), (H-2*pad-30)/Math.max(maxY-minY,1e-6), (W-2*pad)/span*1.0);
  const cx=(minX+maxX)/2, cy=(minY+maxY)/2;
  const P=([x,y])=>[W/2+(x-cx)*sc, (H-30)/2+ (cy-y)*sc + 10];
  const sp=xy.map(P);
  const st=geoStats(pts);
  // barre d'échelle « ronde »
  const target=(W*0.22)/sc, pow=Math.pow(10,Math.floor(Math.log10(target))), nice=[1,2,5,10].map(m=>m*pow).filter(v=>v<=target).pop()||pow, bar=nice*sc;
  const poly = pts.length>2 ? `<polygon points="${sp.map(p=>p.join(',')).join(' ')}" fill="#DCEDE3" stroke="#1D6A4A" stroke-width="2.5" stroke-linejoin="round"/>`
    : `<polyline points="${sp.map(p=>p.join(',')).join(' ')}" fill="none" stroke="#1D6A4A" stroke-width="2.5"/>`;
  const sideLabels = pts.length>2 ? sp.map((p,i)=>{ const q=sp[(i+1)%sp.length]; const mx=(p[0]+q[0])/2, my=(p[1]+q[1])/2; return st.sides[i]>=0 && sp.length<=24 ? `<text x="${mx}" y="${my-4}" font-size="11" text-anchor="middle" fill="#5B6A60" font-family="system-ui,sans-serif">${fmt(st.sides[i])} m</text>`:''; }).join('') : '';
  const vtx = sp.map((p,i)=> pts.length<=40 || i%Math.ceil(pts.length/40)===0 ? `<circle cx="${p[0]}" cy="${p[1]}" r="9" fill="#1D6A4A"/><text x="${p[0]}" y="${p[1]+4}" font-size="10" text-anchor="middle" fill="#fff" font-family="system-ui,sans-serif" font-weight="700">${i+1}</text>` : `<circle cx="${p[0]}" cy="${p[1]}" r="2.5" fill="#1D6A4A"/>`).join('');
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Plan de la parcelle ${esc(title||'')}">
    <rect width="${W}" height="${H}" fill="#fff"/>
    ${poly}${sideLabels}${vtx}
    <g transform="translate(${W-40},46)"><polygon points="0,-26 9,4 0,-3 -9,4" fill="#18231C"/><text x="0" y="20" font-size="13" text-anchor="middle" font-weight="700" fill="#18231C" font-family="system-ui,sans-serif">N</text></g>
    <g transform="translate(24,${H-22})"><rect x="0" y="-6" width="${bar}" height="6" fill="#18231C"/><rect x="${bar/2}" y="-6" width="${bar/2}" height="6" fill="#fff" stroke="#18231C"/><text x="0" y="12" font-size="11" fill="#18231C" font-family="system-ui,sans-serif">0</text><text x="${bar}" y="12" font-size="11" text-anchor="middle" fill="#18231C" font-family="system-ui,sans-serif">${fmt(nice)} m</text></g>
    <text x="${W-16}" y="${H-12}" font-size="12" text-anchor="end" fill="#18231C" font-family="system-ui,sans-serif">${pts.length>2?`Surface ${fmtArea(st.area)} · périmètre ${fmt(st.perim)} m`:`${pts.length} point(s)`}</text>
  </svg>`;
}
function coordsTable(pts){
  return `<table class="coords"><thead><tr><th>Point</th><th>Latitude</th><th>Longitude</th>${pts.some(p=>p.acc)?'<th>Précision</th>':''}</tr></thead><tbody>${pts.map((p,i)=>`<tr><td>${i+1}</td><td>${p.lat.toFixed(6)}</td><td>${p.lon.toFixed(6)}</td>${pts.some(q=>q.acc)?`<td>${p.acc?'± '+Math.round(p.acc)+' m':'saisi'}</td>`:''}</tr>`).join('')}</tbody></table>`;
}
function renderPcDraft(){
  const st=geoStats(PC.pts);
  const last=PC.pts[PC.pts.length-1];
  $('#pcStats').innerHTML = `<span class="pill p-acc">${PC.pts.length} point${PC.pts.length>1?'s':''}</span>` +
    (PC.pts.length>2 ? `<span class="pill p-fav">Surface ${fmtArea(st.area)}</span><span class="pill p-neutral">Périmètre ${fmt(st.perim)} m</span>` : '<span class="pill p-neutral">3 points minimum pour une surface</span>') +
    (last?.acc ? `<span class="pill ${last.acc<=10?'p-fav':last.acc<=20?'p-cond':'p-risk'}">Précision du dernier point ± ${Math.round(last.acc)} m</span>`:'');
  $('#pcPlan').innerHTML = planSVG(PC.pts, $('#pcNom').value) + (PC.pts.length ? `<div style="padding:0 12px 12px;overflow-x:auto">${coordsTable(PC.pts)}</div>` : '');
}
function gpsMsg(m, bad){ $('#pcGps').textContent=m; $('#pcGps').style.color = bad ? 'var(--bad)' : 'var(--muted)'; }
function gpsError(e){
  const m = e && e.code===1 ? "Accès à la localisation refusé : autorisez la localisation pour AgroDiag CI dans les paramètres du téléphone." :
            e && e.code===2 ? "Position introuvable : activez le GPS et placez-vous à découvert." :
            e && e.code===3 ? "Le GPS met trop de temps à répondre : patientez à découvert et réessayez." : "Localisation indisponible sur cet appareil.";
  gpsMsg(m, true); stopWalk();
}
function addPoint(lat, lon, acc){
  if (!(lat>=-90&&lat<=90&&lon>=-180&&lon<=180)) return false;
  PC.pts.push({ lat:+lat, lon:+lon, acc: acc!=null ? +acc : null, t: Date.now() });
  renderPcDraft(); return true;
}
function distM(a,b){ const {xy}=geoXY([a,b]); return Math.hypot(xy[1][0]-xy[0][0], xy[1][1]-xy[0][1]); }
function stopWalk(){ if (PC.watch!=null && navigator.geolocation){ navigator.geolocation.clearWatch(PC.watch); } PC.watch=null; $('#pcWalk').textContent='Commencer le tour en marchant'; }
function initParcelles(){
  $('#pcLoc').innerHTML = $('#ftLoc').innerHTML;
  $('#pcCult').innerHTML = TECH_CULTS.map(c=>`<option>${esc(c.nom)}</option>`).join('');
  if (S.loc) $('#pcLoc').value=String(S.loc.id);
  $('#pcPoint').onclick=()=>{
    if (!navigator.geolocation) return gpsError();
    gpsMsg('Recherche de la position… restez immobile quelques secondes.');
    navigator.geolocation.getCurrentPosition(p=>{ addPoint(p.coords.latitude, p.coords.longitude, p.coords.accuracy); gpsMsg(`Point ${PC.pts.length} ajouté (précision ± ${Math.round(p.coords.accuracy)} m).`); }, gpsError, { enableHighAccuracy:true, timeout:30000, maximumAge:0 });
  };
  $('#pcWalk').onclick=()=>{
    if (PC.watch!=null){ stopWalk(); gpsMsg(`Tour terminé : ${PC.pts.length} points. Vérifiez le plan puis enregistrez.`); return; }
    if (!navigator.geolocation) return gpsError();
    gpsMsg('Marchez lentement le long de la limite. Un point est ajouté tous les 5 m environ.');
    $('#pcWalk').textContent='Terminer le tour';
    PC.watch = navigator.geolocation.watchPosition(p=>{
      const c=p.coords, last=PC.pts[PC.pts.length-1];
      if (c.accuracy>25){ gpsMsg(`Signal GPS faible (± ${Math.round(c.accuracy)} m) : patientez à découvert…`); return; }
      if (!last || distM(last,{lat:c.latitude,lon:c.longitude})>=5){ addPoint(c.latitude, c.longitude, c.accuracy); gpsMsg(`${PC.pts.length} points enregistrés · précision ± ${Math.round(c.accuracy)} m. Touchez « Terminer le tour » une fois revenu au départ.`); }
    }, err=>{
      // Coupure momentanée (sous les arbres, nuages) : on continue d'écouter ; seul un refus d'accès arrête le tour
      if (err && err.code===1) return gpsError(err);
      gpsMsg('Signal GPS perdu un instant… continuez à marcher lentement, la mesure reprend automatiquement.');
    }, { enableHighAccuracy:true, timeout:60000, maximumAge:0 });
  };
  $('#pcUndo').onclick=()=>{ PC.pts.pop(); renderPcDraft(); };
  $('#pcClear').onclick=()=>{ stopWalk(); PC.pts=[]; PC.editId=null; renderPcDraft(); gpsMsg(''); };
  $('#pcAddManual').onclick=()=>{
    const lat=parseFloat(($('#pcLat').value||'').replace(',','.')), lon=parseFloat(($('#pcLon').value||'').replace(',','.'));
    if (!(lat>=4 && lat<=11 && lon>=-9 && lon<=-2)) return gpsMsg("Coordonnées hors de la Côte d'Ivoire : vérifiez (latitude 4 à 11, longitude -9 à -2).", true);
    addPoint(lat, lon, null); $('#pcLat').value=''; $('#pcLon').value=''; gpsMsg(`Point ${PC.pts.length} ajouté.`);
  };
  $('#pcNom').oninput=()=>renderPcDraft();
  $('#pcSave').onclick=async()=>{
    const msg=(m,bad)=>{ $('#pcMsg').textContent=m; $('#pcMsg').style.color=bad?'var(--bad)':'var(--good)'; };
    const nom=$('#pcNom').value.trim();
    if (!nom) return msg('Donnez un nom à la parcelle.', true);
    if (PC.pts.length<3) return msg('Il faut au moins 3 points pour une parcelle.', true);
    stopWalk();
    const st=geoStats(PC.pts), loc=findLoc($('#pcLoc').value);
    const rec={ nom, producteur:$('#pcProd').value.trim(), localiteId:String(loc?.id||''), localite:loc?.nom||'', region:loc?.reg||'', culture:$('#pcCult').value,
      points:PC.pts, surfaceM2:Math.round(st.area), perimetreM:Math.round(st.perim), centre:{lat:+st.lat0.toFixed(6), lon:+st.lon0.toFixed(6)},
      auteur:profilNom(), date:new Date().toISOString() };
    try { if (PC.editId) await S.store.set('parcelles', PC.editId, rec); else await S.store.add('parcelles', rec);
      msg(`Parcelle enregistrée : ${fmtArea(st.area)}.`); PC.pts=[]; PC.editId=null; $('#pcNom').value=''; $('#pcProd').value=''; renderPcDraft(); gpsMsg(''); }
    catch(e){ msg(storeErr(e), true); }
  };
  renderPcDraft(); renderParcelles();
}
function parcList(){ return Object.entries(S.parcelles||{}).map(([id,p])=>({id,...p})).sort((a,b)=>String(b.date).localeCompare(String(a.date))); }
function renderParcelles(){
  if (!$('#pcList')) return;
  const list=parcList();
  // liste déroulante de la fiche technique
  const cur=$('#ftParc').value;
  $('#ftParc').innerHTML='<option value="">— aucune —</option>'+list.map(p=>`<option value="${esc(p.id)}">${esc(p.nom)} · ${fmtArea(p.surfaceM2)}</option>`).join('');
  if (list.find(p=>p.id===cur)) $('#ftParc').value=cur;
  if (!list.length){ $('#pcList').innerHTML='<p class="small muted">Aucune parcelle enregistrée pour l\'instant.</p>'; return; }
  $('#pcList').innerHTML=list.map(p=>`<div class="pc-item">
      <div><b>${esc(p.nom)}</b> <span class="pill p-fav">${fmtArea(p.surfaceM2)}</span>
        <div class="small muted">${esc(p.producteur||'')}${p.producteur?' · ':''}${esc(p.localite)} · ${esc(p.culture)} · ${p.points.length} points · ${new Date(p.date).toLocaleDateString('fr-FR')}${p.auteur?' · par '+esc(p.auteur):''}</div>
        <div class="small muted">Centre : ${p.centre.lat.toFixed(6)}, ${p.centre.lon.toFixed(6)}</div></div>
      <div class="row" style="justify-content:flex-end">
        <button class="btn primary" data-pf="${esc(p.id)}">Fiche technique</button>
        <a class="btn" href="https://www.google.com/maps/search/?api=1&query=${p.centre.lat},${p.centre.lon}" target="_blank" rel="noopener">Voir sur la carte</a>
        <button class="btn" data-pk="${esc(p.id)}">Exporter (KML)</button>
        <button class="btn ghost" data-pe="${esc(p.id)}">Modifier</button>
        <span><button class="btn ghost danger" data-pd="${esc(p.id)}">Supprimer</button></span>
      </div></div>`).join('');
  $('#pcList').querySelectorAll('[data-pf]').forEach(b=>b.onclick=()=>{ const p=S.parcelles[b.dataset.pf]; TECH.parc=b.dataset.pf; TECH.loc=p.localiteId||TECH.loc; TECH.crop=p.culture; show('tech'); });
  $('#pcList').querySelectorAll('[data-pk]').forEach(b=>b.onclick=()=>exportKML(b.dataset.pk));
  $('#pcList').querySelectorAll('[data-pe]').forEach(b=>b.onclick=()=>{ const p=S.parcelles[b.dataset.pe]; PC.editId=b.dataset.pe; PC.pts=p.points.map(x=>({...x})); $('#pcNom').value=p.nom; $('#pcProd').value=p.producteur||''; if (p.localiteId) $('#pcLoc').value=p.localiteId; $('#pcCult').value=p.culture; renderPcDraft(); window.scrollTo(0,0); });
  $('#pcList').querySelectorAll('[data-pd]').forEach(b=>b.onclick=()=>{ const id=b.dataset.pd, w=b.parentElement;
    w.innerHTML=`<span class="inline-confirm">Supprimer ? <button class="btn danger" data-y>Oui</button><button class="btn ghost" data-n>Non</button></span>`;
    w.querySelector('[data-n]').onclick=renderParcelles; w.querySelector('[data-y]').onclick=async()=>{ try{ await S.store.del('parcelles', id); toast('Parcelle supprimée'); }catch(e){ toast(storeErr(e)); } }; });
}
async function exportKML(id){
  const p=S.parcelles[id]; if(!p) return;
  const ring=[...p.points, p.points[0]].map(q=>`${q.lon},${q.lat},0`).join(' ');
  const kml=`<?xml version="1.0" encoding="UTF-8"?>\n<kml xmlns="http://www.opengis.net/kml/2.2"><Document><name>${esc(p.nom)}</name><Placemark><name>${esc(p.nom)}</name><description>${esc(`${p.producteur||''} · ${p.localite} · ${p.culture} · ${fmtArea(p.surfaceM2)}`)}</description><Style><LineStyle><color>ff4a6a1d</color><width>3</width></LineStyle><PolyStyle><color>551d6a4a</color></PolyStyle></Style><Polygon><outerBoundaryIs><LinearRing><coordinates>${ring}</coordinates></LinearRing></outerBoundaryIs></Polygon></Placemark></Document></kml>`;
  const r=await saveFile(`Parcelle_${slug(p.nom)}.kml`, kml, 'application/vnd.google-earth.kml+xml');
  toast(r==='ok'?'Fichier KML enregistré (à ouvrir dans Google Earth)':r==='declined'?'Export annulé':'Export impossible');
}
function parcelSection(p){
  return `<h3>Parcelle : ${esc(p.nom)}</h3>
    <p style="margin:0 0 6px">${p.producteur?`<b>Producteur :</b> ${esc(p.producteur)} · `:''}<b>Surface :</b> ${fmtArea(p.surfaceM2)} · <b>Périmètre :</b> ${fmt(p.perimetreM)} m · <b>Centre :</b> ${p.centre.lat.toFixed(6)}, ${p.centre.lon.toFixed(6)} · <b>Levé le</b> ${new Date(p.date).toLocaleDateString('fr-FR')}${p.auteur?` par ${esc(p.auteur)}`:''}</p>
    <div class="pc-plan" style="border:1px solid #D3DACF;border-radius:10px;overflow:hidden;background:#fff">${planSVG(p.points, p.nom)}</div>
    <p class="small muted" style="margin:6px 0 0">Coordonnées géographiques (WGS84, degrés décimaux) :</p>
    ${coordsTable(p.points)}`;
}
async function printTech(){
  const html = techFileHTML();
  if (window.AgroDiagAndroid && window.AgroDiagAndroid.printHtml){ window.AgroDiagAndroid.printHtml(html, 'Fiche technique AgroDiag CI'); return; }
  const w = window.open('', '_blank');
  if (w){ w.document.open(); w.document.write(html.replace('</body>','<script>setTimeout(()=>window.print(),400)<\/script></body>')); w.document.close(); }
  else { const r=await saveFile('Fiche_technique.html', html, 'text/html'); toast(r==='ok'?'Fiche enregistrée : ouvrez-la puis imprimez-la':'Impression impossible ici'); }
}
