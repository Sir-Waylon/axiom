#!/usr/bin/env python3
"""build_open.py <outdir> <slug>=<pack.json> [...]  -> static site (hub + per-event dirs + SW)"""
import json,sys,os,hashlib,shutil
d=os.path.dirname(os.path.abspath(__file__))+'/engine3/'
out=sys.argv[1];packs=[a.split('=',1) for a in sys.argv[2:]]
shutil.rmtree(out,ignore_errors=True);os.makedirs(out)
css=open(d+'app.css',encoding='utf8').read()+open(d+'roster.css',encoding='utf8').read()
rd=lambda f:open(d+f,encoding='utf8').read()
ver=hashlib.sha1((css+''.join(rd(f) for f in os.listdir(d))).encode()).hexdigest()[:8]
files=['sw.js','manifest.webmanifest','icon.svg','hub.css','index.html']
ICON='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#5b4bff"/><path d="M34 8 18 36h12l-4 20 20-30H33z" fill="#ffd23f" stroke="#1b1464" stroke-width="3" stroke-linejoin="round"/></svg>'
open(out+'/icon.svg','w').write(ICON)
open(out+'/manifest.webmanifest','w').write(json.dumps({"name":os.environ.get("APPNAME","Trainers"),"short_name":os.environ.get("APPNAME","Trainers"),"start_url":"./","display":"standalone","background_color":"#ffffff","theme_color":"#5b4bff","icons":[{"src":"icon.svg","sizes":"any","type":"image/svg+xml","purpose":"any"}]}))
allf=[]
cards=''
for slug,pp in packs:
    pack=json.load(open(pp,encoding='utf8'));m=pack['meta']
    ROOT=os.environ.get('ROOT')=='1'
    D=out if ROOT else f'{out}/{slug}';P_='' if ROOT else '../';S_='' if ROOT else slug+'/'
    os.makedirs(D,exist_ok=True)
    SIB=[] if os.environ.get('ROOT')=='1' else [dict(slug=s_,brand=json.load(open(p_,encoding='utf8'))['meta'].get('brand',s_),tag=json.load(open(p_,encoding='utf8'))['meta'].get('tagline','').split(' · ')[0],acc=json.load(open(p_,encoding='utf8'))['meta'].get('accent',['#5b4bff'])[0]) for s_,p_ in packs]
    js='var __SIB='+json.dumps(SIB)+';\n'+rd('sec_open.js').replace('__PACK_ID__',json.dumps(m['id']))+'\n'+''.join(rd(f)+'\n' for f in ['core.js','fig.js','char.js','roster1.js','session.js','brain.js','app.js','roster2.js','labs.js','audio.js','itypes.js','itypes2.js','rewards.js','tools.js','personal.js','style.js','accounts.js','refs.js','stn_core.js','stn_circ1.js','stn_circ2.js','stn_met1.js','stn_met2.js','extras.js','tracks.js','shorts.js','a11y.js'])
    js=js.replace('__PACK__',json.dumps(pack,ensure_ascii=False,separators=(',',':')).replace('</','<\\/'))
    js='(function(){"use strict";\n'+js+'\n})();' if os.environ.get('WRAP') else js
    hj=hashlib.sha1(js.encode()).hexdigest()[:8];hc=ver
    open(f'{D}/app.{hj}.js','w',encoding='utf8').write(js)
    open(f'{D}/app.{hc}.css','w',encoding='utf8').write(css)
    open(f'{D}/index.html','w',encoding='utf8').write(f'<!doctype html><html lang="en" data-theme="auto"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#5b4bff"><link rel="manifest" href="{P_}manifest.webmanifest"><link rel="icon" href="{P_}icon.svg"><title>{m["title"]}</title><link rel="stylesheet" href="app.{hc}.css"></head><body class="ok"><script src="app.{hj}.js"></script><script src="{P_}reg.js"></script></body></html>')
    allf+= [S_ or './',f'{S_}app.{hj}.js',f'{S_}app.{hc}.css']
    acc=m.get('accent',['#5b4bff','#eceaff']);cards+=f'<a class="c" href="{slug}/" style="--b:{acc[0]};--s:{acc[1]}"><i></i><div><b>{m.get("brand",m["title"])}</b><span>{m.get("tagline","")}</span></div></a>'
open(out+'/reg.js','w').write("if('serviceWorker' in navigator&&location.protocol.indexOf('http')==0)navigator.serviceWorker.register((document.currentScript.src.replace(/reg\\.js.*/,''))+'sw.js').catch(function(){});")
open(out+'/sw.js','w').write(f"""const V='tr-{ver}-{hashlib.sha1(''.join(allf).encode()).hexdigest()[:6]}';
const PRE={json.dumps(list(dict.fromkeys(['./','icon.svg','manifest.webmanifest','hub.css','reg.js']+allf)))};
self.addEventListener('install',e=>{{e.waitUntil(caches.open(V).then(c=>c.addAll(PRE)).then(()=>self.skipWaiting()))}});
self.addEventListener('activate',e=>{{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))}});
self.addEventListener('fetch',e=>{{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin||new URL(r.url).pathname.startsWith('/api/'))return;
e.respondWith(caches.match(r).then(h=>{{const n=fetch(r).then(x=>{{if(x.ok){{const y=x.clone();caches.open(V).then(c=>c.put(r,y))}}return x}}).catch(()=>h);return h||n}}))}});""")
open(out+'/hub.css','w').write(":root{--bg:#fff;--tx:#1b1b3a;--c:#f4f3ff;--b:#5b4bff}@media(prefers-color-scheme:dark){:root{--bg:#14132b;--tx:#f1f0ff;--c:#201f45}}*{box-sizing:border-box}body{margin:0;font:16px/1.4 system-ui,sans-serif;background:var(--bg);color:var(--tx);min-height:100vh;display:grid;place-items:center;padding:16px}main{max-width:520px;width:100%}h1{font-size:34px;margin:0 0 6px;letter-spacing:-.02em}.c{display:flex;gap:14px;align-items:center;background:var(--c);border:2px solid var(--b);border-bottom-width:5px;border-radius:22px;padding:18px;margin:12px 0;text-decoration:none;color:inherit;transition:transform .15s,box-shadow .15s}.c i{width:46px;height:46px;border-radius:14px;background:var(--b);flex:none}.sub{opacity:.7;margin:0 0 12px}.c:hover{box-shadow:0 10px 30px -12px var(--b)}.c:hover{transform:translateY(-2px)}.c:active{transform:translateY(2px)}.c b{display:block;font-size:20px}.c span{opacity:.75}")
if os.environ.get('ROOT')!='1':open(out+'/index.html','w').write(f'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#5b4bff"><link rel="manifest" href="manifest.webmanifest"><link rel="icon" href="icon.svg"><title>{os.environ.get('HUBNAME','Trainers')}</title><link rel="stylesheet" href="hub.css"></head><body><main><h1>{os.environ.get('HUBNAME','Trainers')}</h1><p class="sub">Pick a trainer. Your progress saves on this device.</p>{cards}</main><script src="reg.js"></script></body></html>')
open(out+'/_headers','w').write("""/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: no-referrer
  X-Frame-Options: DENY
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Content-Security-Policy: default-src 'none'; script-src 'self' https://accounts.google.com/gsi/client; style-src 'self' 'unsafe-inline' https://accounts.google.com/gsi/style; img-src 'self' data:; font-src 'self'; connect-src 'self' https://accounts.google.com/gsi/; frame-src https://accounts.google.com/gsi/; manifest-src 'self'; worker-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'
/sw.js
  Cache-Control: no-cache
/index.html
  Cache-Control: no-cache
/*/index.html
  Cache-Control: no-cache
/*/app.*
  Cache-Control: public, max-age=31536000, immutable
""")
print('built',out,ver)
