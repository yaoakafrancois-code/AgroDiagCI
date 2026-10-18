"""Assemble AgroDiag CI : données + interface -> application Android, version ordinateur (web) et fichier de données publié.
Usage : python3 source/build.py  (depuis la racine du dépôt)"""
import json, os, sys, importlib.util
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'source')

def load_itin():
    spec = importlib.util.spec_from_file_location('itin', os.path.join(SRC, 'itineraires.py'))
    m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m); return m.IT

cfg = json.load(open(os.path.join(SRC, 'config.json')))
data = json.load(open(os.path.join(SRC, 'data_base.json')))
data['itin'] = load_itin()
data['version'] = cfg['version']
data['adminHash'] = cfg['adminHash']
missing = [c['nom'] for c in data['cults'] if not c.get('doublon') and not c.get('horsModele') and c['nom'] not in data['itin']]
if missing:
    sys.exit('Fiche technique manquante pour : ' + ', '.join(missing))

css = open(os.path.join(SRC, 'base.css')).read()
body = open(os.path.join(SRC, 'body.html')).read()
app = open(os.path.join(SRC, 'app.js')).read()
mod = open(os.path.join(SRC, 'app_v4.js')).read() + '\n' + open(os.path.join(SRC, 'app_parcel.js')).read()
marker = '/* ================= Démarrage ================= */'
assert marker in app
app = app.replace(marker, mod + '\n' + marker, 1)
js = app.replace('/*__DATA__*/null', json.dumps(data, ensure_ascii=False, separators=(',', ':')), 1)

page = '<title>AgroDiag CI</title>\n<style>' + css + '</style>\n' + body + '\n<script>\n' + js + '\n</script>\n'
reset = ('<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}'
         'body{margin:0;font:14px system-ui,sans-serif}img{max-width:100%}[hidden]{display:none!important}</style>')

# 1. Android (tout hors ligne, sans polices externes)
android = ('<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
           + reset + '</head><body>' + page + '</body></html>')
open(os.path.join(ROOT, 'app/src/main/assets/index.html'), 'w').write(android)

# 2. Version ordinateur installable (application web)
web_head = ('<meta name="theme-color" content="#1D6A4A"><link rel="manifest" href="manifest.webmanifest">'
            '<link rel="icon" type="image/png" href="icon-192.png"><link rel="apple-touch-icon" href="icon-192.png">'
            '<meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-title" content="AgroDiag CI">')
sw = ("<script>if('serviceWorker' in navigator){window.addEventListener('load',()=>{navigator.serviceWorker.register('sw.js').catch(()=>{});});}</script>")
web = ('<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
       + web_head + reset + '</head><body>' + page + sw + '</body></html>')
open(os.path.join(ROOT, 'docs/app/index.html'), 'w').write(web)
swp = os.path.join(ROOT, 'docs/app/sw.js')
s = open(swp).read()
import re
s = re.sub(r"const CACHE = 'agrodiag-[^']*';", f"const CACHE = 'agrodiag-{cfg['version']}';", s)
open(swp, 'w').write(s)

# 3. Données publiées (lues par toutes les applications connectées)
os.makedirs(os.path.join(ROOT, 'docs/data'), exist_ok=True)
json.dump(data, open(os.path.join(ROOT, 'docs/data/agrodiag-data.json'), 'w'), ensure_ascii=False, separators=(',', ':'))
print('OK', len(android), 'octets ;', len(data['itin']), 'fiches techniques ; version', data['version'])
